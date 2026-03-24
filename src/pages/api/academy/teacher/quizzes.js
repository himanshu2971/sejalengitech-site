import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Walk lesson → module → course to check ownership
async function teacherOwnsLesson(userId, lessonId) {
  const { data: lesson } = await supabaseAdmin.from("lessons").select("module_id").eq("id", lessonId).single();
  if (!lesson) return false;
  const { data: mod } = await supabaseAdmin.from("modules").select("course_id").eq("id", lesson.module_id).single();
  if (!mod) return false;
  const { data } = await supabaseAdmin
    .from("teacher_courses")
    .select("course_id")
    .eq("teacher_user_id", userId)
    .eq("course_id", mod.course_id)
    .single();
  return !!data;
}

export default async function handler(req, res) {
  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { lesson_id } = req.query;
    if (!await teacherOwnsLesson(userId, lesson_id)) return res.status(403).json({ error: "Forbidden" });
    const { data: quiz } = await supabaseAdmin.from("quizzes").select("*, questions(*)").eq("lesson_id", lesson_id).single();
    return res.status(200).json(quiz ?? null);
  }

  if (req.method === "POST") {
    const { lesson_id, questions, ...quizFields } = req.body;
    if (!await teacherOwnsLesson(userId, lesson_id)) return res.status(403).json({ error: "Forbidden" });
    const { data: quiz, error } = await supabaseAdmin.from("quizzes").insert([{ lesson_id, ...quizFields }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    if (questions?.length) {
      await supabaseAdmin.from("questions").insert(questions.map((q, i) => ({
        quiz_id: quiz.id, question: q.question,
        option_a: q.options?.[0] ?? "", option_b: q.options?.[1] ?? "",
        option_c: q.options?.[2] ?? "", option_d: q.options?.[3] ?? "",
        correct_index: q.correct_index, explanation: q.explanation ?? "", order: i,
      })));
    }
    return res.status(201).json(quiz);
  }

  if (req.method === "PUT") {
    const { id, lesson_id, questions, ...quizFields } = req.body;
    if (!await teacherOwnsLesson(userId, lesson_id)) return res.status(403).json({ error: "Forbidden" });
    await supabaseAdmin.from("quizzes").update(quizFields).eq("id", id);
    if (questions) {
      await supabaseAdmin.from("questions").delete().eq("quiz_id", id);
      if (questions.length) {
        await supabaseAdmin.from("questions").insert(questions.map((q, i) => ({
          quiz_id: id, question: q.question,
          option_a: q.options?.[0] ?? "", option_b: q.options?.[1] ?? "",
          option_c: q.options?.[2] ?? "", option_d: q.options?.[3] ?? "",
          correct_index: q.correct_index, explanation: q.explanation ?? "", order: i,
        })));
      }
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id, lesson_id } = req.query;
    if (!await teacherOwnsLesson(userId, lesson_id)) return res.status(403).json({ error: "Forbidden" });
    await supabaseAdmin.from("quizzes").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
