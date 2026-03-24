import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  const { course_id } = req.query;

  // Verify teacher is assigned to this course
  const { data: assignment } = await supabaseAdmin
    .from("teacher_courses")
    .select("course_id")
    .eq("teacher_user_id", userId)
    .eq("course_id", course_id)
    .single();

  if (!assignment) return res.status(403).json({ error: "Forbidden" });

  const { data: modules, error } = await supabaseAdmin
    .from("modules")
    .select("*, lessons(id, title, youtube_url, duration_mins, is_free, order)")
    .eq("course_id", course_id)
    .order("order", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  // Sort lessons within each module
  const sorted = (modules ?? []).map((m) => ({
    ...m,
    lessons: (m.lessons ?? []).sort((a, b) => a.order - b.order),
  }));

  return res.status(200).json({ modules: sorted });
}
