import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import TeacherLayout from "@/components/academy/TeacherLayout";

const PAGE_SIZE = 20;

export default function TeacherStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/academy/teacher/login"); return; }
      const authRes = await fetch("/api/academy/teacher-auth", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!authRes.ok) { router.replace("/academy/teacher/login"); return; }
      const res = await fetch("/api/academy/teacher/students", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (res.ok) setStudents(await res.json());
      setReady(true);
    }
    init();
  }, [router]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? students.filter((s) => s.email?.toLowerCase().includes(q)) : students;
  }, [students, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (!ready) return <TeacherLayout title="My Students"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" /></div></TeacherLayout>;

  return (
    <TeacherLayout title="My Students">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold">My Students</h1>
            <p className="text-xs text-slate-400 mt-0.5">{students.length} enrolled in your courses</p>
          </div>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search by email…"
            className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition w-64"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total Students", value: students.length, icon: "👥" },
            { label: "Total Enrollments", value: students.reduce((a, s) => a + (s.courses?.length ?? 0), 0), icon: "🎓" },
            { label: "Active (30d)", value: students.filter((s) => { const d = new Date(s.last_sign_in_at); return !isNaN(d) && Date.now() - d < 30 * 24 * 60 * 60 * 1000; }).length, icon: "🟢" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xl mb-1">{c.icon}</p>
              <p className="text-xl font-bold">{c.value}</p>
              <p className="text-xs text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center text-slate-400 text-sm">
              {search ? "No students match your search." : "No students enrolled in your courses yet."}
            </div>
          )}
          {paginated.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/[0.02] transition"
              >
                <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300 shrink-0">
                  {(s.email ?? "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-100 truncate">{s.email}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Joined {new Date(s.created_at).toLocaleDateString()}
                    {s.last_sign_in_at && ` · Last active ${new Date(s.last_sign_in_at).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs border border-amber-500/20 bg-amber-500/10 text-amber-300 rounded-full px-2 py-0.5">
                    {s.courses?.length ?? 0} course{(s.courses?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                  <span className="text-slate-500 text-xs">{expanded === s.id ? "▲" : "▼"}</span>
                </div>
              </button>
              {expanded === s.id && (
                <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02]">
                  {s.courses?.length > 0 ? (
                    <div>
                      <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">Enrolled Courses</p>
                      <div className="flex flex-col gap-1.5">
                        {s.courses.map((c, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                            <p className="text-xs text-slate-200">{c.courses?.title ?? "Unknown"}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span>{c.courses?.price === 0 ? "Free" : `₹${c.courses?.price}`}</span>
                              <span className={`rounded-full px-2 py-0.5 border ${c.status === "completed" ? "border-emerald-500/30 text-emerald-300" : c.status === "refunded" ? "border-red-500/30 text-red-300" : "border-white/10 text-slate-400"}`}>{c.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No enrollments.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
            <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs disabled:opacity-30 hover:text-slate-100 transition">← Prev</button>
              <span>{page + 1} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs disabled:opacity-30 hover:text-slate-100 transition">Next →</button>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}

TeacherStudents.noLayout = true;
