import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  // GET is public — students need to fetch quizzes
  if (req.method === "GET") {
    const { lesson_id } = req.query;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*, questions(*)")
      .eq("lesson_id", lesson_id)
      .order("order", { referencedTable: "questions", ascending: true })
      .single();
    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    if (!data) return res.status(200).json(null);

    // Question bank shuffle: pick N random questions per session
    let questions = data.questions ?? [];
    const perSession = data.questions_per_session ?? 0;
    const shouldShuffle = data.shuffle_options !== false; // default true

    // Always shuffle question order
    questions = [...questions].sort(() => Math.random() - 0.5);

    // Slice to session limit if set
    if (perSession > 0 && questions.length > perSession) {
      questions = questions.slice(0, perSession);
    }

    // Shuffle each question's options if enabled
    if (shouldShuffle) {
      questions = questions.map((q) => {
        const opts = [
          { text: q.option_a, idx: 0 },
          { text: q.option_b, idx: 1 },
          { text: q.option_c, idx: 2 },
          { text: q.option_d, idx: 3 },
        ].filter((o) => o.text);
        opts.sort(() => Math.random() - 0.5);
        const newCorrectIdx = opts.findIndex((o) => o.idx === q.correct_index);
        return {
          ...q,
          option_a: opts[0]?.text ?? "",
          option_b: opts[1]?.text ?? "",
          option_c: opts[2]?.text ?? "",
          option_d: opts[3]?.text ?? "",
          correct_index: newCorrectIdx,
        };
      });
    }

    return res.status(200).json({
      ...data,
      questions,
      total_questions_in_bank: data.questions.length,
    });
  }

  // All write operations require admin
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  // POST: create quiz + questions
  if (req.method === "POST") {
    const { lesson_id, title, passing_score, questions_per_session, shuffle_options, questions } = req.body;
    const { data: quiz, error: qErr } = await supabaseAdmin
      .from("quizzes")
      .insert([{ lesson_id, title, passing_score, questions_per_session: questions_per_session ?? 0, shuffle_options: shuffle_options ?? true }])
      .select()
      .single();
    if (qErr) return res.status(500).json({ error: qErr.message });

    if (questions?.length) {
      const rows = questions.map((q, i) => ({
        quiz_id: quiz.id,
        order: i,
        question: q.question,
        option_a: q.options?.[0] ?? q.option_a ?? "",
        option_b: q.options?.[1] ?? q.option_b ?? "",
        option_c: q.options?.[2] ?? q.option_c ?? "",
        option_d: q.options?.[3] ?? q.option_d ?? "",
        correct_index: q.correct_index,
        explanation: q.explanation ?? "",
      }));
      const { error: questErr } = await supabaseAdmin.from("questions").insert(rows);
      if (questErr) return res.status(500).json({ error: questErr.message });
    }

    return res.status(201).json(quiz);
  }

  // PUT: update quiz + replace questions
  if (req.method === "PUT") {
    const { id, title, passing_score, questions_per_session, shuffle_options, questions } = req.body;
    await supabaseAdmin.from("quizzes").update({ title, passing_score, questions_per_session: questions_per_session ?? 0, shuffle_options: shuffle_options ?? true }).eq("id", id);
    await supabaseAdmin.from("questions").delete().eq("quiz_id", id);
    if (questions?.length) {
      const rows = questions.map((q, i) => ({
        quiz_id: id,
        order: i,
        question: q.question,
        option_a: q.options?.[0] ?? q.option_a ?? "",
        option_b: q.options?.[1] ?? q.option_b ?? "",
        option_c: q.options?.[2] ?? q.option_c ?? "",
        option_d: q.options?.[3] ?? q.option_d ?? "",
        correct_index: q.correct_index,
        explanation: q.explanation ?? "",
      }));
      await supabaseAdmin.from("questions").insert(rows);
    }
    return res.status(200).json({ ok: true });
  }

  // DELETE: quiz (questions cascade)
  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("quizzes").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
