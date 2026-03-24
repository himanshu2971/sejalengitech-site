import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Server-side only. Validates the Bearer token from Authorization header
 * and confirms the user has role = 'teacher' in the profiles table.
 *
 * Returns { isTeacher, userId, email }
 */
export async function getTeacherSession(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return { isTeacher: false, userId: null, email: null };

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return { isTeacher: false, userId: null, email: null };

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return {
    isTeacher: profile?.role === "teacher",
    userId: user.id,
    email: user.email,
  };
}
