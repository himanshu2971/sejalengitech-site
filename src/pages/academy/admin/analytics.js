import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function BarRow({ label, value, max, color = "bg-cyan-500" }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-32 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-300 w-8 text-right">{value}</span>
    </div>
  );
}

export default function AdminAnalytics({ stats }) {
  const maxEnrollments = Math.max(...(stats.courseEnrollments.map((c) => c.count)), 1);
  const maxScore = 100;

  return (
    <AdminLayout title="Analytics">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-6">Analytics</h1>

        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Enrollments", value: stats.totalEnrollments, icon: "🎓" },
            { label: "Lessons Completed", value: stats.lessonsCompleted, icon: "✅" },
            { label: "Quiz Attempts", value: stats.quizAttempts, icon: "📝" },
            { label: "Avg Quiz Score", value: stats.avgScore ? `${stats.avgScore}%` : "—", icon: "🏆" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xl mb-1">{c.icon}</p>
              <p className="text-xl font-bold text-slate-100">{c.value}</p>
              <p className="text-xs text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Enrollments by course */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Enrollments by Course</h2>
            {stats.courseEnrollments.length === 0 ? (
              <p className="text-xs text-slate-500">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.courseEnrollments.map((c) => (
                  <BarRow key={c.id} label={c.title} value={c.count} max={maxEnrollments} color="bg-cyan-500" />
                ))}
              </div>
            )}
          </div>

          {/* Quiz stats */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Quiz Pass Rates</h2>
            {stats.quizStats.length === 0 ? (
              <p className="text-xs text-slate-500">No quiz attempts yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.quizStats.map((q) => (
                  <div key={q.quiz_id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 truncate">{q.title ?? "Quiz"}</span>
                      <span className="text-xs text-slate-300">{q.pass_rate}% pass</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${q.pass_rate >= 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${q.pass_rate}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-600">{q.attempts} attempt{q.attempts !== 1 ? "s" : ""} · avg {q.avg_score}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress completion */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Lesson Completion</h2>
            {stats.lessonCompletion.length === 0 ? (
              <p className="text-xs text-slate-500">No progress data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.lessonCompletion.map((c) => (
                  <BarRow key={c.id} label={c.title} value={c.completed} max={Math.max(...stats.lessonCompletion.map((x) => x.completed), 1)} color="bg-violet-500" />
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Recent Enrollments</h2>
            {stats.recentPurchases.length === 0 ? (
              <p className="text-xs text-slate-500">No enrollments yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 truncate">{p.student_email}</span>
                    <span className="text-slate-500 shrink-0">{new Date(p.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

AdminAnalytics.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const [
    { data: purchases },
    { data: progress },
    { data: attempts },
    { data: courses },
  ] = await Promise.all([
    supabaseAdmin.from("purchases").select("id, user_id, course_id, created_at").order("created_at", { ascending: false }),
    supabaseAdmin.from("progress").select("lesson_id, lessons(module_id, modules(course_id))"),
    supabaseAdmin.from("quiz_attempts").select("quiz_id, score, passed, quizzes(title)"),
    supabaseAdmin.from("courses").select("id, title"),
  ]);

  // Enrollments per course
  const enrollMap = {};
  (purchases ?? []).forEach((p) => { enrollMap[p.course_id] = (enrollMap[p.course_id] ?? 0) + 1; });
  const courseEnrollments = (courses ?? [])
    .map((c) => ({ ...c, count: enrollMap[c.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Lesson completion per course
  const completionMap = {};
  (progress ?? []).forEach((p) => {
    const cid = p.lessons?.modules?.course_id;
    if (cid) completionMap[cid] = (completionMap[cid] ?? 0) + 1;
  });
  const lessonCompletion = (courses ?? [])
    .map((c) => ({ ...c, completed: completionMap[c.id] ?? 0 }))
    .filter((c) => c.completed > 0)
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 8);

  // Quiz stats
  const quizMap = {};
  (attempts ?? []).forEach((a) => {
    if (!quizMap[a.quiz_id]) quizMap[a.quiz_id] = { title: a.quizzes?.title, scores: [], passed: 0 };
    quizMap[a.quiz_id].scores.push(a.score ?? 0);
    if (a.passed) quizMap[a.quiz_id].passed++;
  });
  const quizStats = Object.entries(quizMap).map(([quiz_id, d]) => ({
    quiz_id,
    title: d.title,
    attempts: d.scores.length,
    avg_score: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length),
    pass_rate: Math.round((d.passed / d.scores.length) * 100),
  })).sort((a, b) => b.attempts - a.attempts).slice(0, 6);

  // Recent purchases with emails
  const recent = (purchases ?? []).slice(0, 10);
  const userIds = [...new Set(recent.map((p) => p.user_id))];
  let emailMap = {};
  if (userIds.length > 0) {
    const { data: users } = await supabaseAdmin.schema("auth").from("users").select("id, email").in("id", userIds);
    (users ?? []).forEach((u) => { emailMap[u.id] = u.email; });
  }
  const recentPurchases = recent.map((p) => ({ ...p, student_email: emailMap[p.user_id] ?? p.user_id }));

  const allScores = (attempts ?? []).map((a) => a.score ?? 0);

  return {
    props: {
      stats: {
        totalEnrollments: (purchases ?? []).length,
        lessonsCompleted: (progress ?? []).length,
        quizAttempts: (attempts ?? []).length,
        avgScore: allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : null,
        courseEnrollments,
        lessonCompletion,
        quizStats,
        recentPurchases,
      },
    },
  };
}
