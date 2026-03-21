import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const CATEGORIES = ["tuition","coaching","technology","creative","professional"];
const DIFFICULTIES = ["beginner","intermediate","advanced"];
const GRADES = ["Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12","All Grades"];

// ─── Inline field ────────────────────────────────────────────
function Field({ label, value, onChange, name, type = "text", as = "input", options = [], rows = 3 }) {
  const cls = "w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition text-slate-100";
  return (
    <div>
      <label className="text-[11px] text-slate-400 mb-1 block">{label}</label>
      {as === "textarea" ? (
        <textarea name={name} rows={rows} value={value} onChange={onChange} className={cls} />
      ) : as === "select" ? (
        <select name={name} value={value} onChange={onChange} className={`${cls} bg-slate-900`}>
          {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} className={cls} />
      )}
    </div>
  );
}

// ─── Quiz editor ─────────────────────────────────────────────
function QuizEditor({ lessonId, initialQuiz, onSaved }) {
  const empty = { title: "Lesson Quiz", passing_score: 60, questions: [] };
  const [quiz, setQuiz] = useState(initialQuiz ?? empty);
  const [saving, setSaving] = useState(false);

  function addQuestion() {
    setQuiz((q) => ({
      ...q,
      questions: [...q.questions, { question: "", options: ["", "", "", ""], correct_index: 0, explanation: "" }],
    }));
  }

  function updateQuestion(i, field, val) {
    setQuiz((q) => {
      const questions = [...q.questions];
      questions[i] = { ...questions[i], [field]: val };
      return { ...q, questions };
    });
  }

  function updateOption(qi, oi, val) {
    setQuiz((q) => {
      const questions = [...q.questions];
      const options = [...questions[qi].options];
      options[oi] = val;
      questions[qi] = { ...questions[qi], options };
      return { ...q, questions };
    });
  }

  function removeQuestion(i) {
    setQuiz((q) => ({ ...q, questions: q.questions.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    setSaving(true);
    const method = quiz.id ? "PUT" : "POST";
    const body = { ...quiz, lesson_id: lessonId };
    await fetch("/api/academy/quizzes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    onSaved?.();
  }

  return (
    <div className="mt-3 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-4">
      <p className="text-xs font-semibold text-fuchsia-200 mb-3">📝 Quiz / Assessment</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <Field label="Quiz Title" name="title" value={quiz.title}
          onChange={(e) => setQuiz((q) => ({ ...q, title: e.target.value }))} />
        <Field label="Passing Score %" name="passing_score" type="number" value={quiz.passing_score}
          onChange={(e) => setQuiz((q) => ({ ...q, passing_score: Number(e.target.value) }))} />
      </div>

      {quiz.questions.map((q, qi) => (
        <div key={qi} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400">Q{qi + 1}</p>
            <button onClick={() => removeQuestion(qi)} className="text-[10px] text-red-400 hover:text-red-300">Remove</button>
          </div>
          <textarea
            rows={2}
            placeholder="Question text"
            value={q.question}
            onChange={(e) => updateQuestion(qi, "question", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-xs mb-2 focus:outline-none focus:border-cyan-500/40 text-slate-100"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-1.5">
                <input type="radio" name={`correct-${qi}`} checked={q.correct_index === oi}
                  onChange={() => updateQuestion(qi, "correct_index", oi)}
                  className="accent-emerald-400 shrink-0" />
                <input
                  value={opt}
                  placeholder={`Option ${oi + 1}`}
                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                  className="flex-1 rounded-md border border-white/10 bg-slate-950/40 px-2 py-1 text-xs focus:outline-none focus:border-cyan-500/40 text-slate-100"
                />
              </div>
            ))}
          </div>
          <input
            value={q.explanation ?? ""}
            placeholder="Explanation (shown after answer)"
            onChange={(e) => updateQuestion(qi, "explanation", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500/40 text-slate-100"
          />
        </div>
      ))}

      <div className="flex items-center gap-3 mt-2">
        <button onClick={addQuestion} className="text-xs border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 rounded-md px-3 py-1.5 hover:bg-fuchsia-500/20 transition">
          + Add Question
        </button>
        <button onClick={save} disabled={saving} className="text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 rounded-md px-3 py-1.5 hover:bg-emerald-500/20 transition disabled:opacity-50">
          {saving ? "Saving…" : "Save Quiz"}
        </button>
      </div>
    </div>
  );
}

// ─── Lesson row ───────────────────────────────────────────────
function LessonRow({ lesson, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [form, setForm] = useState(lesson);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  async function save() {
    setSaving(true);
    const res = await fetch("/api/academy/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { const updated = await res.json(); onUpdate(updated); }
    setSaving(false);
    setOpen(false);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-500">{lesson.is_free ? "🔓" : "🔒"}</span>
        <p className="text-xs text-slate-300 flex-1 truncate">{form.title || "Untitled lesson"}</p>
        {form.duration_mins > 0 && <span className="text-[10px] text-slate-500">{form.duration_mins}m</span>}
        <button onClick={() => setOpen((v) => !v)} className="text-[10px] border border-white/10 rounded px-2 py-1 text-slate-400 hover:text-cyan-200 transition">
          {open ? "Close" : "Edit"}
        </button>
        <button onClick={onDelete} className="text-[10px] text-slate-500 hover:text-red-400 transition">✕</button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Lesson Title" name="title" value={form.title} onChange={onChange} />
            <Field label="YouTube URL" name="youtube_url" value={form.youtube_url ?? ""} onChange={onChange} />
            <Field label="Duration (mins)" name="duration_mins" type="number" value={form.duration_mins} onChange={onChange} />
            <Field label="Order" name="order" type="number" value={form.order} onChange={onChange} />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" name="is_free" checked={form.is_free} onChange={onChange} className="accent-cyan-400" />
            Free preview (visible without purchase)
          </label>
          <div className="flex items-center gap-3">
            <button onClick={save} disabled={saving} className="rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
              {saving ? "Saving…" : "Save Lesson"}
            </button>
            <button onClick={() => setShowQuiz((v) => !v)} className="text-xs border border-fuchsia-500/30 text-fuchsia-300 rounded-md px-3 py-1.5 hover:bg-fuchsia-500/10 transition">
              {showQuiz ? "Hide Quiz" : "📝 Quiz"}
            </button>
          </div>
          {showQuiz && <QuizEditor lessonId={lesson.id} initialQuiz={lesson.quiz ?? null} />}
        </div>
      )}
    </div>
  );
}

// ─── Module section ───────────────────────────────────────────
function ModuleSection({ mod, onUpdate, onDelete }) {
  const [lessons, setLessons] = useState(mod.lessons ?? []);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", youtube_url: "", duration_mins: 0, is_free: false, order: lessons.length });
  const [adding, setAdding] = useState(false);

  async function addLesson(e) {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/academy/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newLesson, module_id: mod.id }),
    });
    if (res.ok) {
      const created = await res.json();
      setLessons((l) => [...l, created]);
      setNewLesson({ title: "", youtube_url: "", duration_mins: 0, is_free: false, order: lessons.length + 1 });
      setShowLessonForm(false);
    }
    setAdding(false);
  }

  async function deleteLesson(id) {
    if (!confirm("Delete this lesson?")) return;
    await fetch(`/api/academy/lessons?id=${id}`, { method: "DELETE" });
    setLessons((l) => l.filter((x) => x.id !== id));
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-3">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-sm font-medium text-slate-200">{mod.title}</p>
        <div className="flex gap-2">
          <button onClick={() => setShowLessonForm((v) => !v)}
            className="text-[10px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 rounded-md px-2.5 py-1 hover:bg-cyan-500/20 transition">
            + Lesson
          </button>
          <button onClick={onDelete} className="text-[10px] text-slate-500 hover:text-red-400 transition">Delete module</button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {lessons.length === 0 && <p className="text-xs text-slate-500">No lessons yet.</p>}
        {lessons.map((l) => (
          <LessonRow key={l.id} lesson={l}
            onUpdate={(updated) => setLessons((ls) => ls.map((x) => x.id === updated.id ? updated : x))}
            onDelete={() => deleteLesson(l.id)} />
        ))}
      </div>

      {showLessonForm && (
        <form onSubmit={addLesson} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 flex flex-col gap-3">
          <p className="text-xs text-slate-400 font-medium">New Lesson</p>
          <div className="grid sm:grid-cols-2 gap-2">
            <Field label="Title" name="title" value={newLesson.title}
              onChange={(e) => setNewLesson((f) => ({ ...f, title: e.target.value }))} />
            <Field label="YouTube URL" name="youtube_url" value={newLesson.youtube_url}
              onChange={(e) => setNewLesson((f) => ({ ...f, youtube_url: e.target.value }))} />
            <Field label="Duration (mins)" name="duration_mins" type="number" value={newLesson.duration_mins}
              onChange={(e) => setNewLesson((f) => ({ ...f, duration_mins: Number(e.target.value) }))} />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input type="checkbox" checked={newLesson.is_free}
              onChange={(e) => setNewLesson((f) => ({ ...f, is_free: e.target.checked }))} className="accent-cyan-400" />
            Free preview
          </label>
          <button type="submit" disabled={adding}
            className="self-start rounded-md bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
            {adding ? "Adding…" : "Add Lesson"}
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function CourseEditor({ course: initial, modules: initialModules }) {
  const [course, setCourse] = useState(initial);
  const [modules, setModules] = useState(initialModules);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newModTitle, setNewModTitle] = useState("");
  const [addingMod, setAddingMod] = useState(false);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setCourse((c) => ({ ...c, [e.target.name]: val }));
  };

  async function saveCourse(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/academy/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function addModule(e) {
    e.preventDefault();
    if (!newModTitle.trim()) return;
    setAddingMod(true);
    const res = await fetch("/api/academy/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: course.id, title: newModTitle, order: modules.length }),
    });
    if (res.ok) {
      const mod = await res.json();
      setModules((m) => [...m, { ...mod, lessons: [] }]);
      setNewModTitle("");
    }
    setAddingMod(false);
  }

  async function deleteModule(id) {
    if (!confirm("Delete this module and all its lessons?")) return;
    await fetch(`/api/academy/modules?id=${id}`, { method: "DELETE" });
    setModules((m) => m.filter((x) => x.id !== id));
  }

  return (
    <>
      <Head><title>{course.title} | Admin Editor</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/academy/admin/courses" className="shrink-0 text-xs text-slate-400 hover:text-cyan-200 transition">← Courses</Link>
            <span className="text-slate-600 shrink-0">/</span>
            <span className="text-sm font-semibold truncate">{course.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {saved && <span className="text-xs text-emerald-300">✅ Saved</span>}
            <button form="course-form" type="submit" disabled={saving}
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">
              {saving ? "Saving…" : "Save Course"}
            </button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Course details form */}
          <form id="course-form" onSubmit={saveCourse} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Title" name="title" value={course.title} onChange={onChange} />
              <Field label="Slug" name="slug" value={course.slug} onChange={onChange} />
              <Field label="Category" name="category" value={course.category} onChange={onChange} as="select"
                options={CATEGORIES.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} />
              <Field label="Difficulty" name="difficulty" value={course.difficulty} onChange={onChange} as="select"
                options={DIFFICULTIES.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) }))} />
              {course.category === "tuition" && (
                <Field label="Grade Level" name="grade_level" value={course.grade_level ?? ""} onChange={onChange} as="select"
                  options={[{ value: "", label: "Select grade" }, ...GRADES.map((g) => ({ value: g, label: g }))]} />
              )}
              <Field label="Language" name="language" value={course.language} onChange={onChange} />
              <Field label="Instructor" name="instructor" value={course.instructor ?? ""} onChange={onChange} />
              <Field label="Price (₹)" name="price" type="number" value={course.price} onChange={onChange} />
              <Field label="Duration (hours)" name="duration_hours" type="number" value={course.duration_hours ?? ""} onChange={onChange} />
              <Field label="Thumbnail URL" name="thumbnail_url" value={course.thumbnail_url ?? ""} onChange={onChange} />
            </div>
            <Field label="Short Description" name="description" value={course.description ?? ""} onChange={onChange} as="textarea" rows={2} />
            <Field label="Long Description (About this course)" name="long_description" value={course.long_description ?? ""} onChange={onChange} as="textarea" rows={4} />
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" name="published" checked={course.published} onChange={onChange} className="accent-cyan-400" />
              Published (visible to students)
            </label>
          </form>

          {/* Thumbnail placeholder info */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200">
            <p className="font-semibold mb-1">📸 Thumbnail Image</p>
            <p className="text-amber-200/70">Save image to <code>/public/images/academy/courses/[slug].jpg</code> and paste the path above.</p>
            <p className="mt-1 text-amber-200/50">AI Prompt suggestion: &quot;{course.category === "tuition" ? "Bright educational illustration for children, subject books and learning materials, warm colors, flat design style, 16:9" : "Professional modern course thumbnail, clean design, dark gradient, subject-relevant imagery, 16:9"}&quot;</p>
          </div>

          {/* Modules + Lessons */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Modules & Lessons</h2>
            {modules.map((mod) => (
              <ModuleSection key={mod.id} mod={mod}
                onUpdate={(updated) => setModules((ms) => ms.map((m) => m.id === updated.id ? { ...m, ...updated } : m))}
                onDelete={() => deleteModule(mod.id)} />
            ))}
            <form onSubmit={addModule} className="flex gap-2 mt-2">
              <input
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                placeholder="New module title..."
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition text-slate-100"
              />
              <button type="submit" disabled={addingMod}
                className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 px-4 py-2 text-xs font-semibold transition disabled:opacity-60">
                {addingMod ? "Adding…" : "+ Module"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

CourseEditor.noLayout = true;

export async function getServerSideProps({ req, params }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const { data: course } = await supabaseAdmin.from("courses").select("*").eq("id", params.id).single();
  if (!course) return { notFound: true };

  const { data: modules } = await supabaseAdmin
    .from("modules")
    .select("*, lessons(*, quizzes(*, questions(*)))")
    .eq("course_id", params.id)
    .order("order", { ascending: true });

  const sorted = (modules ?? []).map((m) => ({
    ...m,
    lessons: (m.lessons ?? []).sort((a, b) => a.order - b.order).map((l) => ({
      ...l,
      quiz: l.quizzes?.[0] ?? null,
    })),
  }));

  return { props: { course, modules: sorted } };
}
