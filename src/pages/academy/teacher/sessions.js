import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import TeacherLayout from "@/components/academy/TeacherLayout";

const EMPTY = { title: "", description: "", meet_url: "", scheduled_at: "", duration_mins: 60, course_id: "", is_recorded: false, recording_url: "" };

function formatDate(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso));
}

export default function TeacherSessions() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/academy/teacher/login"); return; }
      const authRes = await fetch("/api/academy/teacher-auth", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!authRes.ok) { router.replace("/academy/teacher/login"); return; }
      setToken(session.access_token);
      const [sRes, cRes] = await Promise.all([
        fetch("/api/academy/teacher/sessions", { headers: { Authorization: `Bearer ${session.access_token}` } }),
        fetch("/api/academy/teacher/courses", { headers: { Authorization: `Bearer ${session.access_token}` } }),
      ]);
      if (sRes.ok) setSessions(await sRes.json());
      if (cRes.ok) setCourses(await cRes.json());
      setReady(true);
    }
    init();
  }, [router]);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null, course_id: form.course_id || null };
    const method = editId ? "PUT" : "POST";
    if (editId) payload.id = editId;
    const res = await fetch("/api/academy/teacher/sessions", { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
    if (res.ok) {
      const saved = await res.json();
      if (editId) setSessions((ss) => ss.map((s) => s.id === editId ? saved : s));
      else setSessions((ss) => [saved, ...ss]);
      setShowForm(false); setEditId(null); setForm(EMPTY);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/academy/teacher/sessions?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSessions((ss) => ss.filter((s) => s.id !== id));
  }

  if (!ready) return <TeacherLayout title="Live Sessions"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" /></div></TeacherLayout>;

  const upcoming = sessions.filter((s) => new Date(s.scheduled_at) >= new Date());
  const past = sessions.filter((s) => new Date(s.scheduled_at) < new Date());

  return (
    <TeacherLayout title="Live Sessions">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">Live Sessions</h1>
          <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(true); }}
            className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
            + Schedule Session
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="rounded-2xl border border-amber-500/20 bg-white/[0.04] p-5 mb-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-amber-200">{editId ? "Edit Session" : "New Session"}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Session Title *</label>
                <input name="title" required value={form.title} onChange={onChange} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Date & Time *</label>
                <input name="scheduled_at" type="datetime-local" required value={form.scheduled_at} onChange={onChange} className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Duration (mins)</label>
                <input name="duration_mins" type="number" min="15" value={form.duration_mins} onChange={onChange} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Meet URL</label>
                <input name="meet_url" type="url" value={form.meet_url} onChange={onChange} placeholder="https://meet.google.com/..." className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Linked Course (optional)</label>
                <select name="course_id" value={form.course_id} onChange={onChange} className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none">
                  <option value="">— none —</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <textarea name="description" rows={2} value={form.description} onChange={onChange} className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none transition" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_recorded" name="is_recorded" checked={form.is_recorded} onChange={onChange} className="rounded border-white/20" />
                <label htmlFor="is_recorded" className="text-xs text-slate-400 cursor-pointer">Session has recording</label>
              </div>
              {form.is_recorded && (
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Recording URL (YouTube)</label>
                  <input name="recording_url" type="url" value={form.recording_url} onChange={onChange} placeholder="https://youtube.com/watch?v=..." className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none transition" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950 transition">{saving ? "Saving…" : editId ? "Save changes" : "Create session"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="text-xs text-slate-400 hover:text-slate-200 transition">Cancel</button>
            </div>
          </form>
        )}

        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Upcoming ({upcoming.length})</h2>
          <div className="flex flex-col gap-2">
            {upcoming.length === 0 && <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-slate-500 text-sm">No upcoming sessions.</div>}
            {upcoming.map((s) => (
              <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-100">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(s.scheduled_at)}{s.duration_mins ? ` · ${s.duration_mins}min` : ""}{s.courses?.title ? ` · ${s.courses.title}` : ""}</p>
                  {s.meet_url && <a href={s.meet_url} target="_blank" rel="noreferrer" className="text-[11px] text-amber-400 hover:text-amber-200 transition">{s.meet_url}</a>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setForm({ title: s.title ?? "", description: s.description ?? "", meet_url: s.meet_url ?? "", scheduled_at: s.scheduled_at ? s.scheduled_at.slice(0, 16) : "", duration_mins: s.duration_mins ?? 60, course_id: s.course_id ?? "", is_recorded: s.is_recorded ?? false, recording_url: s.recording_url ?? "" }); setEditId(s.id); setShowForm(true); }} className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-amber-200 hover:border-amber-400/40 transition">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Past & Recordings ({past.length})</h2>
            <div className="flex flex-col gap-2">
              {past.map((s) => (
                <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3 flex-wrap opacity-75">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-100">{s.title}</p>
                      {s.is_recorded && <span className="text-[10px] border border-sky-500/30 bg-sky-500/10 text-sky-200 rounded-full px-2 py-0.5">🎬 Recorded</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(s.scheduled_at)}{s.courses?.title ? ` · ${s.courses.title}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setForm({ title: s.title ?? "", description: s.description ?? "", meet_url: s.meet_url ?? "", scheduled_at: s.scheduled_at ? s.scheduled_at.slice(0, 16) : "", duration_mins: s.duration_mins ?? 60, course_id: s.course_id ?? "", is_recorded: s.is_recorded ?? false, recording_url: s.recording_url ?? "" }); setEditId(s.id); setShowForm(true); }} className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-amber-200 hover:border-amber-400/40 transition">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </TeacherLayout>
  );
}

TeacherSessions.noLayout = true;
