import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TeacherLayout from "@/components/academy/TeacherLayout";

export default function TeacherDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/academy/teacher/login"); return; }

      const authRes = await fetch("/api/academy/teacher-auth", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!authRes.ok) { router.replace("/academy/teacher/login"); return; }

      const [coursesRes, sessionsRes, analyticsRes] = await Promise.all([
        fetch("/api/academy/teacher/courses", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch("/api/academy/teacher/sessions", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch("/api/academy/teacher/analytics", { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);

      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (sessionsRes.ok) {
        const all = await sessionsRes.json();
        setSessions(all.filter((s) => new Date(s.scheduled_at) >= Date.now() - 2 * 60 * 60 * 1000).slice(0, 5));
      }
      if (analyticsRes.ok) setStats(await analyticsRes.json());
      setReady(true);
    }
    init();
  }, [router]);

  if (!ready) {
    return (
      <TeacherLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
        </div>
      </TeacherLayout>
    );
  }

  const upcomingSessions = sessions.filter((s) => new Date(s.scheduled_at) >= new Date());

  return (
    <TeacherLayout title="Dashboard">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-slate-100">Teacher Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">Your courses, sessions and student overview</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: "Assigned Courses", value: courses.length, icon: "🎓" },
              { label: "Total Students", value: stats.totalEnrollments, icon: "👥" },
              { label: "Upcoming Sessions", value: upcomingSessions.length, icon: "📡" },
              { label: "Avg Quiz Score", value: stats.avgScore ? `${stats.avgScore}%` : "—", icon: "🏆" },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xl mb-1">{c.icon}</p>
                <p className="text-xl font-bold text-slate-100">{c.value}</p>
                <p className="text-xs text-slate-400">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {/* My Courses */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-100">My Courses</h2>
              <span className="text-xs text-slate-500">{courses.length} assigned</span>
            </div>
            {courses.length === 0 ? (
              <p className="text-xs text-slate-500">No courses assigned yet. Contact your admin.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {courses.map((c) => (
                  <Link
                    key={c.id}
                    href={`/academy/teacher/courses/${c.id}`}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2.5 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.title[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate group-hover:text-amber-200 transition">{c.title}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{c.category} · {c.difficulty}</p>
                    </div>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 border ${c.published ? "border-emerald-500/30 text-emerald-300" : "border-white/10 text-slate-500"}`}>
                      {c.published ? "Live" : "Draft"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-100">Upcoming Sessions</h2>
              <Link href="/academy/teacher/sessions" className="text-xs text-amber-400 hover:text-amber-200 transition">
                Manage →
              </Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <p className="text-xs text-slate-500">No upcoming sessions. <Link href="/academy/teacher/sessions" className="text-amber-400 hover:text-amber-200">Schedule one →</Link></p>
            ) : (
              <div className="flex flex-col gap-2">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                    <p className="text-sm text-slate-200 truncate">{s.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date(s.scheduled_at))}
                    </p>
                    {s.meet_url && (
                      <a href={s.meet_url} target="_blank" rel="noreferrer" className="text-[10px] text-amber-400 hover:text-amber-200 transition">
                        Join meeting →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: "/academy/teacher/sessions", icon: "📡", label: "Schedule Session" },
            { href: "/academy/teacher/students", icon: "👥", label: "View Students" },
            { href: "/academy/teacher/analytics", icon: "📈", label: "Analytics" },
            { href: "/academy", icon: "↗", label: "View Academy" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/10 bg-white/[0.03] hover:bg-amber-500/5 hover:border-amber-500/20 p-4 flex flex-col gap-2 transition group"
            >
              <span className="text-xl">{l.icon}</span>
              <span className="text-xs text-slate-400 group-hover:text-amber-200 transition font-medium">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}

TeacherDashboard.noLayout = true;
