import { getTeacherSession } from "@/lib/teacherAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { isTeacher, userId } = await getTeacherSession(req);
  if (!isTeacher) return res.status(401).json({ error: "Unauthorized" });

  const { data: assignments } = await supabaseAdmin
    .from("teacher_courses").select("course_id").eq("teacher_user_id", userId);
  const courseIds = (assignments ?? []).map((a) => a.course_id);

  if (courseIds.length === 0) {
    return res.status(200).json({
      totalEnrollments: 0, lessonsCompleted: 0, quizAttempts: 0, avgScore: null,
      courseEnrollments: [], lessonCompletion: [], quizStats: [], recentPurchases: [],
    });
  }

  const [{ data: purchases }, { data: courses }, { data: progress }, { data: attempts }] = await Promise.all([
    supabaseAdmin.from("purchases").select("id, user_id, course_id, created_at").in("course_id", courseIds).order("created_at", { ascending: false }),
    supabaseAdmin.from("courses").select("id, title").in("id", courseIds),
    supabaseAdmin.from("progress").select("lesson_id, lessons(module_id, modules(course_id))"),
    supabaseAdmin.from("quiz_attempts").select("quiz_id, score, passed, quizzes(title, lesson_id, lessons(module_id, modules(course_id)))"),
  ]);

  // Enrollments per course
  const enrollMap = {};
  (purchases ?? []).forEach((p) => { enrollMap[p.course_id] = (enrollMap[p.course_id] ?? 0) + 1; });
  const courseEnrollments = (courses ?? []).map((c) => ({ ...c, count: enrollMap[c.id] ?? 0 })).sort((a, b) => b.count - a.count);

  // Lesson completion (scoped to teacher's courses)
  const completionMap = {};
  (progress ?? []).forEach((p) => {
    const cid = p.lessons?.modules?.course_id;
    if (cid && courseIds.includes(cid)) completionMap[cid] = (completionMap[cid] ?? 0) + 1;
  });
  const lessonCompletion = (courses ?? []).map((c) => ({ ...c, completed: completionMap[c.id] ?? 0 })).filter((c) => c.completed > 0).sort((a, b) => b.completed - a.completed);

  // Quiz stats (scoped to teacher's courses)
  const quizMap = {};
  (attempts ?? []).forEach((a) => {
    const cid = a.quizzes?.lessons?.modules?.course_id;
    if (!cid || !courseIds.includes(cid)) return;
    if (!quizMap[a.quiz_id]) quizMap[a.quiz_id] = { title: a.quizzes?.title, scores: [], passed: 0 };
    quizMap[a.quiz_id].scores.push(a.score ?? 0);
    if (a.passed) quizMap[a.quiz_id].passed++;
  });
  const quizStats = Object.entries(quizMap).map(([quiz_id, d]) => ({
    quiz_id, title: d.title, attempts: d.scores.length,
    avg_score: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
    pass_rate: Math.round((d.passed / d.scores.length) * 100),
  })).sort((a, b) => b.attempts - a.attempts).slice(0, 8);

  // Recent purchases (last 10)
  const recent = (purchases ?? []).slice(0, 10);
  const userIds = [...new Set(recent.map((p) => p.user_id))];
  let emailMap = {};
  if (userIds.length > 0) {
    const { data: users } = await supabaseAdmin.schema("auth").from("users").select("id, email").in("id", userIds);
    (users ?? []).forEach((u) => { emailMap[u.id] = u.email; });
  }
  const recentPurchases = recent.map((p) => ({ ...p, student_email: emailMap[p.user_id] ?? p.user_id }));

  const allScores = (attempts ?? []).map((a) => a.score ?? 0);

  return res.status(200).json({
    totalEnrollments: (purchases ?? []).length,
    lessonsCompleted: Object.values(completionMap).reduce((a, b) => a + b, 0),
    quizAttempts: Object.values(quizMap).reduce((acc, d) => acc + d.scores.length, 0),
    avgScore: allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null,
    courseEnrollments, lessonCompletion, quizStats, recentPurchases,
  });
}
