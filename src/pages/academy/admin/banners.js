import { useState } from "react";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ACCENTS = ["cyan", "violet", "emerald", "amber", "rose", "sky"];
const EMPTY = { title: "", subtitle: "", cta_text: "Learn More", cta_url: "/academy", badge: "", accent: "cyan", active: true, order: 0 };

export default function AdminBanners({ banners: initial }) {
  const [banners, setBanners] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  function openCreate() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(b) {
    setForm({ title: b.title, subtitle: b.subtitle ?? "", cta_text: b.cta_text ?? "Learn More", cta_url: b.cta_url ?? "", badge: b.badge ?? "", accent: b.accent ?? "cyan", active: b.active, order: b.order ?? 0 });
    setEditId(b.id);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/academy/banners", {
      method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    if (res.ok) {
      if (editId) {
        setBanners((bs) => bs.map((b) => b.id === editId ? { ...b, ...form } : b));
      } else {
        const created = await res.json();
        setBanners((bs) => [...bs, created].sort((a, b) => a.order - b.order));
      }
      setShowForm(false); setEditId(null);
    }
    setSaving(false);
  }

  async function toggleActive(b) {
    await fetch("/api/academy/banners", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, ...b, active: !b.active }),
    });
    setBanners((bs) => bs.map((x) => x.id === b.id ? { ...x, active: !x.active } : x));
  }

  async function handleDelete(id) {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/academy/banners?id=${id}`, { method: "DELETE" });
    setBanners((bs) => bs.filter((b) => b.id !== id));
  }

  const ACCENT_PREVIEW = {
    cyan:    "from-cyan-900/40 border-cyan-500/30 text-cyan-200",
    violet:  "from-violet-900/40 border-violet-500/30 text-violet-200",
    emerald: "from-emerald-900/40 border-emerald-500/30 text-emerald-200",
    amber:   "from-amber-900/40 border-amber-500/30 text-amber-200",
    rose:    "from-rose-900/40 border-rose-500/30 text-rose-200",
    sky:     "from-sky-900/40 border-sky-500/30 text-sky-200",
  };

  return (
    <AdminLayout title="Banners / Ads">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold">Banners & Advertisements</h1>
            <p className="text-xs text-slate-400 mt-0.5">Promotional banners shown on the Academy catalog page</p>
          </div>
          <button onClick={openCreate}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
            + New Banner
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-6">Use "order" field to control sequence. Lower number = shown first.</p>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSave} className="rounded-2xl border border-cyan-500/20 bg-white/[0.04] p-5 mb-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-cyan-200">{editId ? "Edit" : "New"} Banner</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Headline *</label>
                <input name="title" required value={form.title} onChange={onChange}
                  placeholder="🚀 New Batch Starting January!"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Subtitle</label>
                <input name="subtitle" value={form.subtitle} onChange={onChange}
                  placeholder="Limited seats available — enroll now"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Badge text</label>
                <input name="badge" value={form.badge} onChange={onChange}
                  placeholder="🔥 Limited offer"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Button text</label>
                <input name="cta_text" value={form.cta_text} onChange={onChange}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Button URL</label>
                <input name="cta_url" value={form.cta_url} onChange={onChange}
                  placeholder="/academy/courses/my-course"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Display order</label>
                <input name="order" type="number" value={form.order} onChange={onChange}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-2 block">Accent colour</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENTS.map((ac) => (
                    <button key={ac} type="button" onClick={() => setForm((f) => ({ ...f, accent: ac }))}
                      className={`rounded-full px-3 py-1 text-xs capitalize border transition ${ACCENT_PREVIEW[ac]} ${form.accent === ac ? "ring-2 ring-white/30" : "opacity-60"}`}>
                      {ac}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" name="active" checked={form.active} onChange={onChange} className="rounded" />
                <label htmlFor="active" className="text-xs text-slate-400 cursor-pointer">Active (visible to students)</label>
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

        {/* Banner list */}
        <div className="flex flex-col gap-3">
          {banners.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center text-slate-400 text-sm">
              No banners yet. Create one to promote your courses.
            </div>
          )}
          {banners.map((b) => {
            const ac = ACCENT_PREVIEW[b.accent] ?? ACCENT_PREVIEW.cyan;
            return (
              <div key={b.id} className={`rounded-xl border bg-gradient-to-r ${ac.split(" ")[0]} to-slate-900 p-4 flex flex-col sm:flex-row gap-3 sm:items-center ${!b.active ? "opacity-50" : ""}`}>
                <div className="flex-1 min-w-0">
                  {b.badge && <span className={`text-[10px] rounded-full border px-2 py-0.5 ${ac.split(" ").slice(1).join(" ")} mb-1 inline-block`}>{b.badge}</span>}
                  <p className="text-sm font-semibold text-slate-100">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-slate-400 mt-0.5">{b.subtitle}</p>}
                  <p className="text-[10px] text-slate-600 mt-1">→ {b.cta_url} · Order {b.order} · {b.active ? "Active" : "Hidden"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(b)}
                    className={`text-xs border rounded-md px-2.5 py-1.5 transition ${b.active ? "border-white/10 text-slate-400 hover:text-amber-300" : "border-emerald-500/30 text-emerald-300"}`}>
                    {b.active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => openEdit(b)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-cyan-200 transition">Edit</button>
                  <button onClick={() => handleDelete(b.id)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 transition">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}

AdminBanners.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  const { data } = await supabaseAdmin.from("banners").select("*").order("order", { ascending: true });
  return { props: { banners: data ?? [] } };
}
