import { useState, useEffect } from "react";
import Head from "next/head";
import SiteAdminLayout from "@/components/SiteAdminLayout";
import { isAdminAuthed, getAdminEmail } from "@/lib/adminAuth";

const EMPTY = { title: "", excerpt: "", content: "", cover_image: "", tags: "", author: "", published: false };

export default function AdminBlog({ adminEmail }) {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null = list, {} = new/edit form
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    const res = await fetch("/api/blog");
    if (res.ok) setPosts(await res.json());
  }

  function startNew() { setForm({ ...EMPTY, author: adminEmail }); setEditing("new"); }
  function startEdit(post) {
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, cover_image: post.cover_image ?? "", tags: (post.tags ?? []).join(", "), author: post.author ?? adminEmail, published: post.published });
    setEditing(post._id);
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true);
    const method = editing === "new" ? "POST" : "PUT";
    const body = editing === "new" ? form : { ...form, id: editing };
    const res = await fetch("/api/blog", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) { setEditing(null); loadPosts(); }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
    setDeleting(null);
    loadPosts();
  }

  async function togglePublish(post) {
    await fetch("/api/blog", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post._id, ...post, published: !post.published }) });
    loadPosts();
  }

  if (editing !== null) {
    return (
      <SiteAdminLayout title={editing === "new" ? "New Post" : "Edit Post"}>
        <div className="p-4 md:p-8 max-w-3xl">
          <button onClick={() => setEditing(null)} className="text-sm text-slate-400 hover:text-slate-200 mb-6 flex items-center gap-2">← Back to posts</button>
          <h1 className="text-xl font-black text-slate-100 mb-6">{editing === "new" ? "New Blog Post" : "Edit Post"}</h1>
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            {[["Title *", "title", "text"], ["Author", "author", "text"], ["Excerpt (1–2 sentences)", "excerpt", "text"], ["Cover Image URL", "cover_image", "url"], ["Tags (comma-separated)", "tags", "text"]].map(([label, key, type]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
                <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 transition" />
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Content (Markdown)</label>
              <textarea rows={16} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your blog post in markdown..."
                className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none focus:border-amber-500/40 transition resize-y" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-amber-500 w-4 h-4" />
              <span className="text-sm text-slate-300">Publish immediately (visible to public)</span>
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 px-6 py-3 text-sm font-bold text-white transition">
                {saving ? "Saving…" : "Save Post"}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-400 hover:text-slate-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      </SiteAdminLayout>
    );
  }

  return (
    <SiteAdminLayout title="Blog Posts">
      <Head><title>Blog | Sejal Admin</title></Head>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-black text-slate-100">✍ Blog Posts</h1>
          <button onClick={startNew} className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 transition">+ New Post</button>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-3">✍</p>
            <p className="font-semibold">No blog posts yet</p>
            <p className="text-sm">Click "New Post" to write your first article.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${p.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {(p.tags ?? []).map((t) => <span key={t} className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2 py-0.5">{t}</span>)}
                  </div>
                  <p className="font-bold text-slate-100 text-sm truncate">{p.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.excerpt}</p>
                  <p className="text-[10px] text-slate-600 mt-1">By {p.author || "—"} · {p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN") : "Not published"}</p>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  <button onClick={() => togglePublish(p)} className={`text-xs rounded-lg border px-3 py-1.5 font-semibold transition ${p.published ? "border-slate-500/30 text-slate-400 hover:text-amber-300 hover:border-amber-500/30" : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"}`}>
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => startEdit(p)} className="text-xs rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:text-slate-100 transition">Edit</button>
                  <button onClick={() => handleDelete(p._id)} disabled={deleting === p._id} className="text-xs rounded-lg border border-red-500/20 px-3 py-1.5 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50">
                    {deleting === p._id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteAdminLayout>
  );
}

AdminBlog.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  return { props: { adminEmail: getAdminEmail(req) } };
}
