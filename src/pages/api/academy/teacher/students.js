import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  // Get teacher's assigned courses
  const { data: assignments } = await supabaseAdmin
    .from("teacher_courses").select("course_id").eq("teacher_user_id", userId);
  const courseIds = (assignments ?? []).map((a) => a.course_id);

  if (courseIds.length === 0) return res.status(200).json([]);

  // Purchases for those courses
  const { data: purchases } = await supabaseAdmin
    .from("purchases")
    .select("user_id, course_id, status, created_at, courses(title, price)")
    .in("course_id", courseIds)
    .order("created_at", { ascending: false });

  if (!purchases?.length) return res.status(200).json([]);

  // Fetch auth user details
  const userIds = [...new Set(purchases.map((p) => p.user_id))];
  const { data: users } = await supabaseAdmin
    .schema("auth")
    .from("users")
    .select("id, email, created_at, last_sign_in_at")
    .in("id", userIds);

  const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

  // Group purchases by user
  const studentMap = {};
  purchases.forEach((p) => {
    if (!studentMap[p.user_id]) {
      studentMap[p.user_id] = {
        ...(userMap[p.user_id] ?? { id: p.user_id, email: "Unknown" }),
        courses: [],
      };
    }
    studentMap[p.user_id].courses.push(p);
  });

  return res.status(200).json(Object.values(studentMap));
}
