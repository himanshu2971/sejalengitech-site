import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  // GET quiz with questions by lesson_id
  if (req.method === "GET") {
    const { lesson_id } = req.query;
    const { data, error } = await supabaseAdmin
      .from("quizzes")
      .select("*, questions(*)")
      .eq("lesson_id", lesson_id)
      .order("order", { referencedTable: "questions", ascending: true })
      .single();
    if (error && error.code !== "PGRST116") return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? null);
  }

  // POST: create quiz + questions
  if (req.method === "POST") {
    const { lesson_id, title, passing_score, questions } = req.body;
    const { data: quiz, error: qErr } = await supabaseAdmin
      .from("quizzes")
      .insert([{ lesson_id, title, passing_score }])
      .select()
      .single();
    if (qErr) return res.status(500).json({ error: qErr.message });

    if (questions?.length) {
      const rows = questions.map((q, i) => ({ ...q, quiz_id: quiz.id, order: i }));
      const { error: questErr } = await supabaseAdmin.from("questions").insert(rows);
      if (questErr) return res.status(500).json({ error: questErr.message });
    }

    return res.status(201).json(quiz);
  }

  // PUT: update quiz + replace questions
  if (req.method === "PUT") {
    const { id, title, passing_score, questions } = req.body;
    await supabaseAdmin.from("quizzes").update({ title, passing_score }).eq("id", id);
    await supabaseAdmin.from("questions").delete().eq("quiz_id", id);
    if (questions?.length) {
      const rows = questions.map((q, i) => ({ ...q, quiz_id: id, order: i }));
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
