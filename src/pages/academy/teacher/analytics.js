import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import TeacherLayout from "@/components/academy/TeacherLayout";

function BarRow({ label, value, max, color = "bg-amber-500" }) {
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

export default function TeacherAnalytics() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/academy/teacher/login"); return; }
      const authRes = await fetch("/api/academy/teacher-auth", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!authRes.ok) { router.replace("/academy/teacher/login"); return; }
      const res = await fetch("/api/academy/teacher/analytics", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (res.ok) setStats(await res.json());
      setReady(true);
    }
    init();
  }, [router]);

  if (!ready || !stats) return <TeacherLayout title="Analytics"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" /></div></TeacherLayout>;

  const maxEnrollments = Math.max(...(stats.courseEnrollments.map((c) => c.count)), 1);

  return (
    <TeacherLayout title="Analytics">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-6">Analytics</h1>

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
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Enrollments by Course</h2>
            {stats.courseEnrollments.length === 0 ? (
              <p className="text-xs text-slate-500">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats.courseEnrollments.map((c) => <BarRow key={c.id} label={c.title} value={c.count} max={maxEnrollments} color="bg-amber-500" />)}
              </div>
            )}
          </div>

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
                      <div className={`h-full rounded-full transition-all ${q.pass_rate >= 70 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${q.pass_rate}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-600">{q.attempts} attempt{q.attempts !== 1 ? "s" : ""} · avg {q.avg_score}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

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

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold mb-4">Recent Enrollments</h2>
            {stats.recentPurchases.length === 0 ? (
              <p className="text-xs text-slate-500">No enrollments yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {stats.recentPurchases.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400 truncate">{p.student_email}</span>
                    <span className="text-slate-500 shrink-0">{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}

TeacherAnalytics.noLayout = true;
