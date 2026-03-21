import { useState } from "react";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const TYPES = [
  { value: "info",    label: "ℹ️ Info",    cls: "border-sky-500/30 bg-sky-500/10 text-sky-200" },
  { value: "success", label: "✅ Success", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
  { value: "warning", label: "⚠️ Warning", cls: "border-amber-500/30 bg-amber-500/10 text-amber-200" },
];

const EMPTY = { title: "", message: "", type: "info" };

export default function AdminAnnouncements({ announcements: initial }) {
  const [announcements, setAnnouncements] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function openCreate() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(a) {
    setForm({ title: a.title, message: a.message, type: a.type });
    setEditId(a.id);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/academy/announcements", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      if (editId) {
        setAnnouncements((as) => as.map((a) => a.id === editId ? { ...a, ...form } : a));
      } else {
        const created = await res.json();
        setAnnouncements((as) => [created, ...as]);
      }
      setShowForm(false);
      setEditId(null);
    }
    setSaving(false);
  }

  async function toggleActive(a) {
    await fetch("/api/academy/announcements", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, active: !a.active, title: a.title, message: a.message, type: a.type }),
    });
    setAnnouncements((as) => as.map((x) => x.id === a.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(id) {
    if (!confirm("Delete announcement?")) return;
    await fetch(`/api/academy/announcements?id=${id}`, { method: "DELETE" });
    setAnnouncements((as) => as.filter((a) => a.id !== id));
  }

  return (
    <AdminLayout title="Announcements">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold">Announcements</h1>
            <p className="text-xs text-slate-400 mt-0.5">Shown on student dashboard when active</p>
          </div>
          <button
            onClick={openCreate}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition"
          >
            + New Announcement
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSave} className="rounded-2xl border border-cyan-500/20 bg-white/[0.04] p-5 mb-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-cyan-200">{editId ? "Edit" : "New"} Announcement</h2>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Title *</label>
              <input name="title" required value={form.title} onChange={onChange}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Message *</label>
              <textarea name="message" rows={3} required value={form.message} onChange={onChange}
                className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition resize-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Type</label>
              <div className="flex gap-2 flex-wrap">
                {TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={`rounded-full border px-3 py-1 text-xs transition ${form.type === t.value ? t.cls : "border-white/10 text-slate-400"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950 transition">
                {saving ? "Saving…" : editId ? "Save" : "Create"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition">Cancel</button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="flex flex-col gap-2">
          {announcements.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center text-slate-400 text-sm">
              No announcements yet.
            </div>
          )}
          {announcements.map((a) => {
            const t = TYPES.find((x) => x.value === a.type) ?? TYPES[0];
            return (
              <div key={a.id} className={`rounded-xl border p-4 flex gap-3 items-start transition ${a.active ? "border-white/10 bg-white/[0.03]" : "border-white/[0.05] bg-white/[0.01] opacity-60"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium text-slate-100">{a.title}</p>
                    <span className={`text-[10px] rounded-full border px-2 py-0.5 ${t.cls}`}>{t.label}</span>
                    {!a.active && <span className="text-[10px] text-slate-600 border border-white/10 rounded-full px-2 py-0.5">Hidden</span>}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{a.message}</p>
                  <p className="text-[10px] text-slate-600 mt-1">{new Date(a.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(a)}
                    className={`text-xs border rounded-md px-2.5 py-1.5 transition ${a.active ? "border-white/10 text-slate-400 hover:text-amber-300" : "border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"}`}>
                    {a.active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => openEdit(a)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-cyan-200 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 transition">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

AdminAnnouncements.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  const { data } = await supabaseAdmin.from("announcements").select("*").order("created_at", { ascending: false });
  return { props: { announcements: data ?? [] } };
}
