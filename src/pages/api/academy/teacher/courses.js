import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  // Get IDs of courses assigned to this teacher
  const { data: assignments } = await supabaseAdmin
    .from("teacher_courses")
    .select("course_id")
    .eq("teacher_user_id", userId);

  const courseIds = (assignments ?? []).map((a) => a.course_id);

  if (courseIds.length === 0) return res.status(200).json([]);

  const { data: courses, error } = await supabaseAdmin
    .from("courses")
    .select("id, title, slug, category, difficulty, grade_level, published, total_lessons, instructor, thumbnail_url")
    .in("id", courseIds)
    .order("title");

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(courses ?? []);
}
