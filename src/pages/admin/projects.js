import { useState, useEffect } from "react";
import Head from "next/head";
import SiteAdminLayout from "@/components/SiteAdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";

const EMPTY = { title: "", description: "", tech: "", imageUrl: "", liveUrl: "", githubUrl: "", featured: false };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  }

  function startNew() { setForm(EMPTY); setEditingId(null); setShowForm(true); }
  function startEdit(p) { setForm({ title: p.title, description: p.description, tech: Array.isArray(p.tech) ? p.tech.join(", ") : p.tech, imageUrl: p.imageUrl ?? "", liveUrl: p.liveUrl ?? "", githubUrl: p.githubUrl ?? "", featured: !!p.featured }); setEditingId(p._id); setShowForm(true); }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean) };
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...payload, id: editingId } : payload;
    await fetch("/api/projects", { method, headers: { "Content-Type": "application/json", "x-api-key": "" }, body: JSON.stringify(body) });
    setSaving(false); setShowForm(false); loadProjects();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE", headers: { "x-api-key": "" } });
    loadProjects();
  }

  return (
    <SiteAdminLayout title="Projects">
      <Head><title>Projects | Sejal Admin</title></Head>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-slate-100">🗂 Projects</h1>
          <button onClick={startNew} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 transition">+ New Project</button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-6 grid sm:grid-cols-2 gap-4">
            {[["Title *", "title"], ["Description", "description"], ["Tech (comma-sep)", "tech"], ["Image URL", "imageUrl"], ["Live URL", "liveUrl"], ["GitHub URL", "githubUrl"]].map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                <input type="text" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500/40 transition" />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-300 col-span-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-amber-500" />
              Featured project
            </label>
            <div className="flex gap-3 col-span-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 px-5 py-2 text-sm font-bold text-slate-900 transition">{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-5 py-2 text-sm text-slate-400 hover:text-slate-200 transition">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-slate-100 text-sm">{p.title}</p>
                  {p.featured && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">Featured</span>}
                </div>
                <p className="text-xs text-slate-500 truncate">{p.description}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{Array.isArray(p.tech) ? p.tech.join(" · ") : p.tech}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="text-xs rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:text-slate-100 transition">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-xs rounded-lg border border-red-500/20 px-3 py-1.5 text-red-400 hover:bg-red-500/10 transition">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteAdminLayout>
  );
}

AdminProjects.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  return { props: {} };
}
