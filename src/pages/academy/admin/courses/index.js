import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const CATEGORIES = [
  { value: "tuition", label: "📚 Tuition", desc: "K-12 subjects for children" },
  { value: "coaching", label: "🏆 Coaching", desc: "JEE, NEET, UPSC etc." },
  { value: "technology", label: "💻 Technology", desc: "Coding, Web, Apps" },
  { value: "creative", label: "🎨 Creative", desc: "Art, Design, Music" },
  { value: "professional", label: "💼 Professional", desc: "Business, Marketing" },
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const GRADES = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","All Grades"];

const EMPTY = {
  title: "", slug: "", description: "", long_description: "", thumbnail_url: "",
  price: 0, currency: "INR", language: "English", instructor: "",
  duration_hours: "", total_lessons: 0, published: false,
  category: "professional", target_age: "all", difficulty: "beginner", grade_level: "",
};

export default function AdminCourses({ courses: initial }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  // Auto-generate slug from title
  const onTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm((f) => ({ ...f, title, slug }));
  };

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/academy/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setCourses((c) => [created, ...c]);
      setForm(EMPTY);
      setShowForm(false);
      router.push(`/academy/admin/courses/${created.id}`);
    }
    setSaving(false);
  }

  async function togglePublish(course) {
    const res = await fetch("/api/academy/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: course.id, published: !course.published }),
    });
    if (res.ok) {
      setCourses((cs) => cs.map((c) => c.id === course.id ? { ...c, published: !c.published } : c));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this course and all its content? This cannot be undone.")) return;
    await fetch(`/api/academy/courses?id=${id}`, { method: "DELETE" });
    setCourses((cs) => cs.filter((c) => c.id !== id));
  }

  const filtered = filter === "all" ? courses : courses.filter((c) => c.category === filter);

  return (
    <>
      <Head><title>Courses | Admin</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/academy/admin" className="text-xs text-slate-400 hover:text-cyan-200 transition">← Dashboard</Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold">Courses</span>
          </div>
          <button onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
            + New Course
          </button>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* New course form */}
          {showForm && (
            <form onSubmit={handleCreate} className="rounded-2xl border border-cyan-500/20 bg-white/[0.04] p-5 mb-6 flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-cyan-200">New Course</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                  <input name="title" required value={form.title} onChange={onTitleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Slug (auto)</label>
                  <input name="slug" value={form.slug} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Category *</label>
                  <select name="category" value={form.category} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none">
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                {form.category === "tuition" && (
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Grade Level</label>
                    <select name="grade_level" value={form.grade_level} onChange={onChange}
                      className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select grade</option>
                      {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Price (₹, 0 = Free)</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Instructor</label>
                  <input name="instructor" value={form.instructor} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Language</label>
                  <input name="language" value={form.language} onChange={onChange}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Short Description</label>
                <textarea name="description" rows={2} value={form.description} onChange={onChange}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition" />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-4 py-2 text-xs font-semibold text-slate-950 transition">
                  {saving ? "Creating…" : "Create & Add Content →"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="text-xs text-slate-400 hover:text-slate-200 transition">Cancel</button>
              </div>
            </form>
          )}

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 text-xs transition ${filter === "all" ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200" : "border border-white/10 text-slate-400 hover:text-slate-200"}`}>
              All ({courses.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = courses.filter((x) => x.category === c.value).length;
              return (
                <button key={c.value} onClick={() => setFilter(c.value)}
                  className={`rounded-full px-3 py-1 text-xs transition ${filter === c.value ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200" : "border border-white/10 text-slate-400 hover:text-slate-200"}`}>
                  {c.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Courses table */}
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-slate-400 text-sm">
                No courses yet. Click "+ New Course" to get started.
              </div>
            )}
            {filtered.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-100 truncate">{c.title}</p>
                    {c.grade_level && <span className="text-[10px] border border-amber-500/30 bg-amber-500/10 text-amber-200 rounded-full px-2 py-0.5">{c.grade_level}</span>}
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${c.published ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border border-white/10 text-slate-500"}`}>
                      {c.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">/{c.slug} • {c.category} • {c.price === 0 ? "Free" : `₹${c.price}`}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/academy/admin/courses/${c.id}`}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40 transition">
                    Edit
                  </Link>
                  <button onClick={() => togglePublish(c)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-emerald-200 transition">
                    {c.published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => handleDelete(c.id)}
                    className="text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-400 hover:text-red-300 hover:border-red-400/30 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

AdminCourses.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  const { data } = await supabaseAdmin.from("courses").select("*").order("created_at", { ascending: false });
  return { props: { courses: data ?? [] } };
}
