import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const EMPTY = {
  title: "",
  description: "",
  meet_url: "",
  scheduled_at: "",
  duration_mins: 60,
  course_id: "",
  is_recorded: false,
  recording_url: "",
};

export default function AdminSessions({ sessions: initial, courses }) {
  const [sessions, setSessions] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const val =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.type === "number"
        ? Number(e.target.value)
        : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  function openCreate() {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(session) {
    setForm({
      title: session.title ?? "",
      description: session.description ?? "",
      meet_url: session.meet_url ?? "",
      scheduled_at: session.scheduled_at ? session.scheduled_at.slice(0, 16) : "",
      duration_mins: session.duration_mins ?? 60,
      course_id: session.course_id ?? "",
      is_recorded: session.is_recorded ?? false,
      recording_url: session.recording_url ?? "",
    });
    setEditId(session.id);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      course_id: form.course_id || null,
    };

    const method = editId ? "PUT" : "POST";
    if (editId) payload.id = editId;

    const res = await fetch("/api/academy/sessions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const saved = await res.json();
      if (editId) {
        setSessions((ss) => ss.map((s) => (s.id === editId ? saved : s)));
      } else {
        setSessions((ss) => [saved, ...ss]);
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/academy/sessions?id=${id}`, { method: "DELETE" });
    setSessions((ss) => ss.filter((s) => s.id !== id));
  }

  function formatDate(iso) {
    if (!iso) return "—";
    return new Intl.DateTimeFormat(undefined, {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZoneName: "short",
    }).format(new Date(iso));
  }

  const upcoming = sessions.filter((s) => new Date(s.scheduled_at) >= new Date());
  const past = sessions.filter((s) => new Date(s.scheduled_at) < new Date());

  return (
    <>
      <Head><title>Live Sessions | Admin</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/academy/admin" className="text-xs text-slate-400 hover:text-cyan-200 transition">← Dashboard</Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold">Live Sessions</span>
          </div>
          <button
            onClick={openCreate}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition"
          >
            + Schedule Session
          </button>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Form */}
          {showForm && (
            <form
              onSubmit={handleSave}
              className="rounded-2xl border border-cyan-500/20 bg-white/[0.04] p-5 mb-6 flex flex-col gap-4"
            >
              <h2 className="text-sm font-semibold text-cyan-200">
                {editId ? "Edit Session" : "New Session"}
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Session Title *</label>
                  <input
                    name="title"
                    required
                    value={form.title}
                    onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Date & Time *</label>
                  <input
                    name="scheduled_at"
                    type="datetime-local"
                    required
                    value={form.scheduled_at}
                    onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Duration (mins)</label>
                  <input
                    name="duration_mins"
                    type="number"
                    min="15"
                    value={form.duration_mins}
                    onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Meet / Zoom URL</label>
                  <input
                    name="meet_url"
                    type="url"
                    value={form.meet_url}
                    onChange={onChange}
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Linked Course (optional)</label>
                  <select
                    name="course_id"
                    value={form.course_id}
                    onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="">— none —</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    value={form.description}
                    onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_recorded"
                    name="is_recorded"
                    checked={form.is_recorded}
                    onChange={onChange}
                    className="rounded border-white/20"
                  />
                  <label htmlFor="is_recorded" className="text-xs text-slate-400 cursor-pointer">
                    Session has recording
                  </label>
                </div>

                {form.is_recorded && (
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Recording URL (YouTube)</label>
                    <input
                      name="recording_url"
                      type="url"
                      value={form.recording_url}
                      onChange={onChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950 transition"
                >
                  {saving ? "Saving…" : editId ? "Save changes" : "Create session"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Upcoming */}
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Upcoming ({upcoming.length})
            </h2>
            <div className="flex flex-col gap-2">
              {upcoming.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-slate-500 text-sm">
                  No upcoming sessions scheduled.
                </div>
              )}
              {upcoming.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  courses={courses}
                  onEdit={() => openEdit(s)}
                  onDelete={() => handleDelete(s.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </section>

          {/* Past / Recorded */}
          {past.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Past & Recordings ({past.length})
              </h2>
              <div className="flex flex-col gap-2">
                {past.map((s) => (
                  <SessionRow
                    key={s.id}
                    session={s}
                    courses={courses}
                    onEdit={() => openEdit(s)}
                    onDelete={() => handleDelete(s.id)}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function SessionRow({ session, courses, onEdit, onDelete, formatDate }) {
  const linked = courses.find((c) => c.id === session.course_id);
  const isPast = session.scheduled_at && new Date(session.scheduled_at) < new Date();

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-slate-100 truncate">{session.title}</p>
          {session.is_recorded && (
            <span className="text-[10px] border border-sky-500/30 bg-sky-500/10 text-sky-200 rounded-full px-2 py-0.5">
              🎬 Recorded
            </span>
          )}
          {!isPast && session.meet_url && (
            <span className="text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 rounded-full px-2 py-0.5">
              📡 Live
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatDate(session.scheduled_at)}
          {session.duration_mins ? ` · ${session.duration_mins}min` : ""}
          {linked ? ` · ${linked.title}` : ""}
        </p>
        {session.meet_url && (
          <a
            href={session.meet_url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-200 transition truncate block mt-0.5"
          >
            {session.meet_url}
          </a>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

AdminSessions.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const [{ data: sessions }, { data: courses }] = await Promise.all([
    supabaseAdmin.from("sessions").select("*").order("scheduled_at", { ascending: true }),
    supabaseAdmin.from("courses").select("id, title").order("title"),
  ]);

  return {
    props: {
      sessions: sessions ?? [],
      courses: courses ?? [],
    },
  };
}
