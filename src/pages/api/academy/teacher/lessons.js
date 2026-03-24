import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function teacherOwnsModule(userId, moduleId) {
  const { data: mod } = await supabaseAdmin.from("modules").select("course_id").eq("id", moduleId).single();
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

  if (req.method === "POST") {
    const { module_id, ...rest } = req.body;
    if (!await teacherOwnsModule(userId, module_id)) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin.from("lessons").insert([{ module_id, ...rest }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, module_id, ...updates } = req.body;
    if (!await teacherOwnsModule(userId, module_id)) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin.from("lessons").update(updates).eq("id", id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id, module_id } = req.query;
    if (!await teacherOwnsModule(userId, module_id)) return res.status(403).json({ error: "Forbidden" });
    const { error } = await supabaseAdmin.from("lessons").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
