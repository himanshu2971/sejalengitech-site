import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Verify teacher owns the course before modifying its modules
async function teacherOwnsCourse(userId, courseId) {
  const { data } = await supabaseAdmin
    .from("teacher_courses")
    .select("course_id")
    .eq("teacher_user_id", userId)
    .eq("course_id", courseId)
    .single();
  return !!data;
}

export default async function handler(req, res) {
  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { course_id, ...rest } = req.body;
    if (!await teacherOwnsCourse(userId, course_id)) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin.from("modules").insert([{ course_id, ...rest }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, course_id, ...updates } = req.body;
    if (!await teacherOwnsCourse(userId, course_id)) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin.from("modules").update(updates).eq("id", id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id, course_id } = req.query;
    if (!await teacherOwnsCourse(userId, course_id)) return res.status(403).json({ error: "Forbidden" });
    const { error } = await supabaseAdmin.from("modules").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
