import { useState } from "react";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default function AdminTeachers({ teachers: initialTeachers, pending: initialPending, allCourses }) {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [pending, setPending] = useState(initialPending);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [assigning, setAssigning] = useState({});
  const [approving, setApproving] = useState({});

  async function handleApprove(p) {
    setApproving((a) => ({ ...a, [p.user_id]: true }));
    await fetch("/api/academy/admin/teachers", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacher_user_id: p.user_id, action: "approve" }),
    });
    setPending((ps) => ps.filter((x) => x.user_id !== p.user_id));
    setTeachers((ts) => [...ts, { ...p, role: "teacher", courses: [] }]);
    setApproving((a) => ({ ...a, [p.user_id]: false }));
  }

  async function handleDecline(userId) {
    if (!confirm("Decline this teacher request? Their account stays as a regular student.")) return;
    await fetch(`/api/academy/admin/teachers?user_id=${userId}`, { method: "DELETE" });
    setPending((ps) => ps.filter((x) => x.user_id !== userId));
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true); setAddError("");
    const res = await fetch("/api/academy/admin/teachers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    if (!res.ok) { setAddError(data.error ?? "Failed to add teacher"); }
    else {
      setTeachers((ts) => [...ts, { user_id: data.user_id, email: data.email, courses: [], display_name: null }]);
      setEmail("");
    }
    setAdding(false);
  }

  async function handleRevoke(userId) {
    if (!confirm("Revoke teacher access? They will lose access to all assigned courses.")) return;
    await fetch(`/api/academy/admin/teachers?user_id=${userId}`, { method: "DELETE" });
    setTeachers((ts) => ts.filter((t) => t.user_id !== userId));
  }

  async function toggleCourse(teacherId, courseId, isAssigned) {
    const key = `${teacherId}-${courseId}`;
    setAssigning((a) => ({ ...a, [key]: true }));
    await fetch("/api/academy/admin/teachers", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacher_user_id: teacherId, course_id: courseId, action: isAssigned ? "unassign" : "assign" }),
    });
    setTeachers((ts) => ts.map((t) => {
      if (t.user_id !== teacherId) return t;
      const courses = isAssigned
        ? t.courses.filter((c) => c.course_id !== courseId)
        : [...t.courses, { course_id: courseId, title: allCourses.find((c) => c.id === courseId)?.title }];
      return { ...t, courses };
    }));
    setAssigning((a) => ({ ...a, [key]: false }));
  }

  return (
    <AdminLayout title="Teachers">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold">Teachers</h1>
            <p className="text-xs text-slate-400 mt-0.5">{teachers.length} active · {pending.length} pending approval</p>
          </div>
        </div>

        {/* ── Pending Approval ── */}
        {pending.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-amber-300">Pending Approval</h2>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5">{pending.length}</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              These people signed up at <span className="text-slate-400 font-mono">/academy/teacher/login</span> and are waiting for access. Review and approve or decline.
            </p>
            <div className="flex flex-col gap-2">
              {pending.map((p) => (
                <div key={p.user_id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/40 to-orange-600/40 border border-amber-500/30 flex items-center justify-center text-amber-200 text-sm font-black shrink-0">
                    {(p.display_name ?? p.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-100 truncate">{p.display_name || p.email}</p>
                    {p.display_name && <p className="text-xs text-slate-500 truncate">{p.email}</p>}
                    <p className="text-[10px] text-amber-600 mt-0.5">Requested access · waiting for approval</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(p)}
                      disabled={approving[p.user_id]}
                      className="text-xs rounded-md bg-amber-500 hover:bg-amber-400 disabled:opacity-60 px-3 py-1.5 text-slate-950 font-semibold transition"
                    >
                      {approving[p.user_id] ? "Approving…" : "✓ Approve"}
                    </button>
                    <button
                      onClick={() => handleDecline(p.user_id)}
                      className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Add teacher manually ── */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-1">➕ Add Teacher Manually</h2>
          <p className="text-xs text-slate-500 mb-4">
            Enter the email of anyone who already has an Alambana account to grant them teacher access directly — without waiting for them to request it.
          </p>
          <form onSubmit={handleAdd} className="flex gap-2 flex-wrap">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="flex-1 min-w-48 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition"
            />
            <button
              type="submit"
              disabled={adding}
              className="rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950 transition"
            >
              {adding ? "Adding…" : "Grant Access"}
            </button>
          </form>
          {addError && <p className="text-xs text-red-300 mt-2">{addError}</p>}
        </div>

        {/* ── Active teacher list ── */}
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Teachers ({teachers.length})</h2>
        {teachers.length === 0 ? (
          <div className="rounded-xl border border-white/10 p-10 text-center text-slate-400 text-sm">
            No teachers yet. Approve a pending request or add one manually above.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {teachers.map((t) => (
              <div key={t.user_id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-black shrink-0">
                    {(t.email ?? t.user_id)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-100 truncate">{t.display_name || t.email}</p>
                    {t.display_name && <p className="text-xs text-slate-500 truncate">{t.email}</p>}
                    <p className="text-[10px] text-slate-600 mt-0.5">{t.courses.length} course{t.courses.length !== 1 ? "s" : ""} assigned</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExpanded(expanded === t.user_id ? null : t.user_id)}
                      className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-amber-200 hover:border-amber-400/40 transition"
                    >
                      {expanded === t.user_id ? "Close" : "Assign Courses"}
                    </button>
                    <button
                      onClick={() => handleRevoke(t.user_id)}
                      className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition"
                    >
                      Revoke
                    </button>
                  </div>
                </div>

                {expanded === t.user_id && (
                  <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02]">
                    <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">
                      Assign / Unassign Courses
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {allCourses.map((c) => {
                        const isAssigned = t.courses.some((tc) => tc.course_id === c.id);
                        const key = `${t.user_id}-${c.id}`;
                        const busy = assigning[key];
                        return (
                          <button
                            key={c.id}
                            onClick={() => toggleCourse(t.user_id, c.id, isAssigned)}
                            disabled={busy}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-left transition disabled:opacity-50 ${
                              isAssigned
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
                            }`}
                          >
                            <span>{isAssigned ? "✓" : "○"}</span>
                            <span className="truncate flex-1">{c.title}</span>
                            {busy && <span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

AdminTeachers.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("user_id, display_name, role")
    .in("role", ["teacher", "pending_teacher"]);

  const userIds = (profiles ?? []).map((p) => p.user_id);
  let teachers = [], pending = [];

  if (userIds.length > 0) {
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
    const all = (profiles ?? []).map((p) => ({
      user_id: p.user_id,
      display_name: p.display_name ?? null,
      role: p.role,
      ...(userMap[p.user_id] ?? { email: "Unknown" }),
      courses: assignMap[p.user_id] ?? [],
    }));
    teachers = all.filter((p) => p.role === "teacher");
    pending = all.filter((p) => p.role === "pending_teacher");
  }

  const { data: allCourses } = await supabaseAdmin.from("courses").select("id, title, category").order("title");

  return { props: { teachers, pending, allCourses: allCourses ?? [] } };
}
