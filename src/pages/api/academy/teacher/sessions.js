import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function teacherOwnsCourse(userId, courseId) {
  if (!courseId) return true; // sessions without a linked course are allowed
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

  if (req.method === "GET") {
    // Only return sessions for courses assigned to this teacher
    const { data: assignments } = await supabaseAdmin
      .from("teacher_courses").select("course_id").eq("teacher_user_id", userId);
    const courseIds = (assignments ?? []).map((a) => a.course_id);

    const { data: sessions, error } = await supabaseAdmin
      .from("sessions")
      .select("*, courses(id, title)")
      .or(courseIds.length
        ? `course_id.in.(${courseIds.join(",")}),course_id.is.null`
        : "course_id.is.null"
      )
      // Only include null-course sessions if this teacher has at least one assignment
      .order("scheduled_at", { ascending: true });

    // Further filter: only sessions linked to teacher's courses (or unlinked by teacher themselves)
    // We store teacher_user_id on sessions we create below, so filter by that too
    const { data: teacherSessions } = await supabaseAdmin
      .from("sessions")
      .select("*, courses(id, title)")
      .eq("created_by", userId)
      .order("scheduled_at", { ascending: true });

    const linked = (sessions ?? []).filter((s) => s.course_id && courseIds.includes(s.course_id));
    const own = (teacherSessions ?? []).filter((s) => !s.course_id);
    const combined = [...linked, ...own].filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

    return res.status(200).json(combined);
  }

  if (req.method === "POST") {
    const { course_id, ...rest } = req.body;
    if (!await teacherOwnsCourse(userId, course_id)) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .insert([{ course_id: course_id || null, created_by: userId, ...rest }])
      .select("*, courses(id, title)")
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, course_id, ...updates } = req.body;
    // Verify the session belongs to this teacher
    const { data: existing } = await supabaseAdmin.from("sessions").select("created_by, course_id").eq("id", id).single();
    const isOwner = existing?.created_by === userId || (existing?.course_id && await teacherOwnsCourse(userId, existing.course_id));
    if (!isOwner) return res.status(403).json({ error: "Forbidden" });
    const { data, error } = await supabaseAdmin
      .from("sessions").update({ course_id: course_id || null, ...updates }).eq("id", id)
      .select("*, courses(id, title)").single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const { data: existing } = await supabaseAdmin.from("sessions").select("created_by, course_id").eq("id", id).single();
    const isOwner = existing?.created_by === userId || (existing?.course_id && await teacherOwnsCourse(userId, existing.course_id));
    if (!isOwner) return res.status(403).json({ error: "Forbidden" });
    await supabaseAdmin.from("sessions").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
