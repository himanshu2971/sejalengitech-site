import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  // GET — list active teachers + pending approval requests
  if (req.method === "GET") {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("user_id, display_name, role")
      .in("role", ["teacher", "pending_teacher"]);

    if (!profiles?.length) return res.status(200).json({ teachers: [], pending: [] });

    const userIds = profiles.map((p) => p.user_id);

    const [{ data: users }, { data: assignments }] = await Promise.all([
      supabaseAdmin.schema("auth").from("users").select("id, email, created_at, last_sign_in_at").in("id", userIds),
      supabaseAdmin.from("teacher_courses").select("teacher_user_id, course_id, courses(id, title)").in("teacher_user_id", userIds),
    ]);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const assignMap = {};
    (assignments ?? []).forEach((a) => {
      if (!assignMap[a.teacher_user_id]) assignMap[a.teacher_user_id] = [];
      assignMap[a.teacher_user_id].push({ course_id: a.course_id, title: a.courses?.title });
    });

    const all = profiles.map((p) => ({
      user_id: p.user_id,
      display_name: p.display_name,
      role: p.role,
      ...(userMap[p.user_id] ?? { email: "Unknown" }),
      courses: assignMap[p.user_id] ?? [],
    }));

    return res.status(200).json({
      teachers: all.filter((t) => t.role === "teacher"),
      pending: all.filter((t) => t.role === "pending_teacher"),
    });
  }

  // POST — promote a user to teacher by email
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Find auth user by email
    const { data: users } = await supabaseAdmin.schema("auth").from("users").select("id, email").eq("email", email.toLowerCase().trim());
    const user = users?.[0];
    if (!user) return res.status(404).json({ error: "No account found with this email. The user must sign up first." });

    // Upsert profile with role = teacher
    const { error } = await supabaseAdmin.from("profiles").upsert(
      { user_id: user.id, role: "teacher", updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true, user_id: user.id, email: user.email });
  }

  // DELETE — revoke teacher role (set back to student)
  if (req.method === "DELETE") {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id required" });

    // Revoke role
    await supabaseAdmin.from("profiles").update({ role: "student" }).eq("user_id", user_id);
    // Remove all course assignments
    await supabaseAdmin.from("teacher_courses").delete().eq("teacher_user_id", user_id);

    return res.status(200).json({ ok: true });
  }

  // PATCH — approve pending teacher OR assign/unassign from a course
  if (req.method === "PATCH") {
    const { teacher_user_id, course_id, action } = req.body; // action: "approve" | "assign" | "unassign"
    if (!teacher_user_id) return res.status(400).json({ error: "teacher_user_id required" });

    if (action === "approve") {
      const { error } = await supabaseAdmin.from("profiles")
        .update({ role: "teacher", updated_at: new Date().toISOString() })
        .eq("user_id", teacher_user_id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    if (!course_id) return res.status(400).json({ error: "course_id required" });

    if (action === "assign") {
      const { error } = await supabaseAdmin.from("teacher_courses")
        .upsert({ teacher_user_id, course_id }, { onConflict: "teacher_user_id,course_id" });
      if (error) return res.status(500).json({ error: error.message });
    } else {
      await supabaseAdmin.from("teacher_courses").delete().eq("teacher_user_id", teacher_user_id).eq("course_id", course_id);
    }

    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
