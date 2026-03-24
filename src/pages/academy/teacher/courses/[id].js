import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import TeacherLayout from "@/components/academy/TeacherLayout";

// ─── Inline field ────────────────────────────────────────────
function Field({ label, value, onChange, name, type = "text", as = "input", rows = 2 }) {
  const cls = "w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-amber-500/60 transition text-slate-100";
  return (
    <div>
      <label className="text-[11px] text-slate-400 mb-1 block">{label}</label>
      {as === "textarea" ? (
        <textarea name={name} rows={rows} value={value} onChange={onChange} className={cls} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} className={cls} />
      )}
    </div>
  );
}

// ─── Quiz editor ─────────────────────────────────────────────
function QuizEditor({ lessonId, token }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/academy/teacher/quizzes?lesson_id=${lessonId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d) {
          const questions = (d.questions ?? []).map((q) => ({
            question: q.question, options: [q.option_a, q.option_b, q.option_c, q.option_d],
            correct_index: q.correct_index, explanation: q.explanation ?? "",
          }));
          setQuiz({ ...d, questions });
        } else {
          setQuiz({ title: "Lesson Quiz", passing_score: 60, questions: [] });
        }
        setLoading(false);
      });
  }, [lessonId, token]);

  function addQuestion() {
    setQuiz((q) => ({ ...q, questions: [...q.questions, { question: "", options: ["", "", "", ""], correct_index: 0, explanation: "" }] }));
  }

  function removeQuestion(i) {
    setQuiz((q) => ({ ...q, questions: q.questions.filter((_, idx) => idx !== i) }));
  }

  function updateQuestion(i, field, val) {
    setQuiz((q) => { const questions = [...q.questions]; questions[i] = { ...questions[i], [field]: val }; return { ...q, questions }; });
  }

  function updateOption(qi, oi, val) {
    setQuiz((q) => { const questions = [...q.questions]; const options = [...questions[qi].options]; options[oi] = val; questions[qi] = { ...questions[qi], options }; return { ...q, questions }; });
  }

  async function save() {
    setSaving(true);
    const method = quiz.id ? "PUT" : "POST";
    const res = await fetch("/api/academy/teacher/quizzes", {
      method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...quiz, lesson_id: lessonId }),
    });
    if (res.ok && method === "POST") { const d = await res.json(); setQuiz((q) => ({ ...q, id: d.id })); }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="text-xs text-slate-500 py-3">Loading quiz…</div>;

  return (
    <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-violet-300">📝 Quiz</p>
        <button onClick={save} disabled={saving}
          className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 px-3 py-1 text-[11px] font-semibold text-white transition">
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Quiz"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">Quiz Title</label>
          <input value={quiz.title} onChange={(e) => setQuiz((q) => ({ ...q, title: e.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs focus:outline-none focus:border-violet-400/60 transition" />
        </div>
        <div>
          <label className="text-[11px] text-slate-400 mb-1 block">Passing Score (%)</label>
          <input type="number" min="0" max="100" value={quiz.passing_score}
            onChange={(e) => setQuiz((q) => ({ ...q, passing_score: Number(e.target.value) }))}
            className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs focus:outline-none focus:border-violet-400/60 transition" />
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-3">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-[10px] text-slate-500 pt-1 shrink-0">Q{qi + 1}</span>
              <input value={q.question} onChange={(e) => updateQuestion(qi, "question", e.target.value)} placeholder="Question text…"
                className="flex-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs focus:outline-none focus:border-violet-400/60 transition" />
              <button onClick={() => removeQuestion(qi)} className="text-slate-600 hover:text-red-300 transition text-xs shrink-0">✕</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-1.5 mb-2">
              {["A", "B", "C", "D"].map((letter, oi) => (
                <div key={oi} className="flex items-center gap-1.5">
                  <input type="radio" name={`correct-${qi}`} checked={q.correct_index === oi} onChange={() => updateQuestion(qi, "correct_index", oi)} className="accent-violet-500 shrink-0" />
                  <input value={q.options[oi] ?? ""} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${letter}`}
                    className={`flex-1 rounded-md border px-2 py-1 text-xs focus:outline-none transition ${q.correct_index === oi ? "border-violet-500/40 bg-violet-500/10" : "border-white/10 bg-white/[0.03]"}`} />
                </div>
              ))}
            </div>
            <input value={q.explanation} onChange={(e) => updateQuestion(qi, "explanation", e.target.value)} placeholder="Explanation (optional)"
              className="w-full rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] focus:outline-none focus:border-violet-400/60 transition text-slate-400" />
          </div>
        ))}
      </div>
      <button onClick={addQuestion} className="text-xs text-violet-400 hover:text-violet-200 transition">+ Add question</button>
    </div>
  );
}

// ─── Lesson row ───────────────────────────────────────────────
function LessonRow({ lesson, moduleId, courseId, token, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [form, setForm] = useState({ title: lesson.title ?? "", youtube_url: lesson.youtube_url ?? "", duration_mins: lesson.duration_mins ?? "", is_free: lesson.is_free ?? false });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  };

  async function save() {
    setSaving(true);
    const res = await fetch("/api/academy/teacher/lessons", {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: lesson.id, module_id: moduleId, ...form, duration_mins: form.duration_mins ? Number(form.duration_mins) : null }),
    });
    if (res.ok) { onUpdate(await res.json()); setEditing(false); }
    setSaving(false);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-slate-600 text-xs shrink-0">▶</span>
        <span className="flex-1 text-xs text-slate-300 truncate">{lesson.title}</span>
        {lesson.is_free && <span className="text-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 rounded-full px-1.5 py-0.5">Free</span>}
        <button onClick={() => setEditing(!editing)} className="text-[11px] text-slate-400 hover:text-amber-300 transition px-1">{editing ? "Close" : "Edit"}</button>
        <button onClick={() => setShowQuiz(!showQuiz)} className="text-[11px] text-slate-400 hover:text-violet-300 transition px-1">Quiz</button>
        <button onClick={onDelete} className="text-[11px] text-slate-600 hover:text-red-300 transition px-1">✕</button>
      </div>

      {editing && (
        <div className="border-t border-white/10 px-3 py-3 grid sm:grid-cols-2 gap-2">
          <div className="sm:col-span-2"><Field label="Title" name="title" value={form.title} onChange={onChange} /></div>
          <div className="sm:col-span-2"><Field label="YouTube URL" name="youtube_url" type="url" value={form.youtube_url} onChange={onChange} /></div>
          <Field label="Duration (mins)" name="duration_mins" type="number" value={form.duration_mins} onChange={onChange} />
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id={`free-${lesson.id}`} name="is_free" checked={form.is_free} onChange={onChange} className="accent-emerald-500" />
            <label htmlFor={`free-${lesson.id}`} className="text-xs text-slate-400 cursor-pointer">Free preview</label>
          </div>
          <div className="sm:col-span-2 flex gap-2 mt-1">
            <button onClick={save} disabled={saving} className="rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 px-3 py-1.5 text-xs font-semibold text-slate-950 transition">{saving ? "Saving…" : "Save"}</button>
            <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-slate-200 transition">Cancel</button>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="border-t border-white/10 px-3 pb-3">
          <QuizEditor lessonId={lesson.id} token={token} />
        </div>
      )}
    </div>
  );
}

// ─── Module ───────────────────────────────────────────────────
function ModuleBlock({ mod, courseId, token, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [lessons, setLessons] = useState(mod.lessons ?? []);
  const [newTitle, setNewTitle] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);

  async function addLesson() {
    if (!newTitle.trim()) return;
    setAddingLesson(true);
    const res = await fetch("/api/academy/teacher/lessons", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ module_id: mod.id, title: newTitle.trim(), order: lessons.length }),
    });
    if (res.ok) { const created = await res.json(); setLessons((ls) => [...ls, created]); setNewTitle(""); }
    setAddingLesson(false);
  }

  async function deleteLesson(id) {
    if (!confirm("Delete lesson? This also deletes its quiz.")) return;
    await fetch(`/api/academy/teacher/lessons?id=${id}&module_id=${mod.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setLessons((ls) => ls.filter((l) => l.id !== id));
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition" onClick={() => setExpanded(!expanded)}>
        <span className="text-slate-500 text-xs">{expanded ? "▼" : "▶"}</span>
        <span className="flex-1 text-sm font-medium text-slate-200">{mod.title}</span>
        <span className="text-xs text-slate-500">{lessons.length} lessons</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-[11px] text-slate-600 hover:text-red-300 transition ml-2 px-1"
        >
          Delete module
        </button>
      </div>

      {expanded && (
        <div className="border-t border-white/10 px-4 py-3 flex flex-col gap-2">
          {lessons.map((l) => (
            <LessonRow
              key={l.id}
              lesson={l}
              moduleId={mod.id}
              courseId={courseId}
              token={token}
              onUpdate={(updated) => setLessons((ls) => ls.map((x) => x.id === updated.id ? updated : x))}
              onDelete={() => deleteLesson(l.id)}
            />
          ))}

          <div className="flex items-center gap-2 mt-2">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLesson()}
              placeholder="New lesson title…"
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500/60 transition"
            />
            <button
              onClick={addLesson}
              disabled={addingLesson || !newTitle.trim()}
              className="rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-40 border border-amber-500/30 px-3 py-1.5 text-xs text-amber-300 font-medium transition"
            >
              + Lesson
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function TeacherCourseEditor() {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [ready, setReady] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/academy/teacher/login"); return; }
      const authRes = await fetch("/api/academy/teacher-auth", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!authRes.ok) { router.replace("/academy/teacher/login"); return; }

      setToken(session.access_token);

      // Verify this course is assigned to this teacher
      const coursesRes = await fetch("/api/academy/teacher/courses", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const allCourses = coursesRes.ok ? await coursesRes.json() : [];
      const found = allCourses.find((c) => c.id === id);
      if (!found) { setUnauthorized(true); setReady(true); return; }
      setCourse(found);

      // Fetch full course content (modules + lessons)
      const modRes = await fetch(`/api/academy/teacher/course-content?course_id=${id}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (modRes.ok) {
        const data = await modRes.json();
        setModules(data.modules ?? []);
      }
      setReady(true);
    }
    init();
  }, [id, router]);

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);
    const res = await fetch("/api/academy/teacher/modules", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ course_id: id, title: newModuleTitle.trim(), order: modules.length }),
    });
    if (res.ok) { const created = await res.json(); setModules((ms) => [...ms, { ...created, lessons: [] }]); setNewModuleTitle(""); }
    setAddingModule(false);
  }

  async function deleteModule(moduleId) {
    if (!confirm("Delete module and all its lessons?")) return;
    await fetch(`/api/academy/teacher/modules?id=${moduleId}&course_id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setModules((ms) => ms.filter((m) => m.id !== moduleId));
  }

  if (!ready) return <TeacherLayout title="Course Editor"><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" /></div></TeacherLayout>;

  if (unauthorized) return (
    <TeacherLayout title="Unauthorized">
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🚫</p>
        <p className="text-lg font-semibold text-slate-100 mb-2">Not assigned to this course</p>
        <p className="text-sm text-slate-400 mb-6">Contact your admin if you think this is a mistake.</p>
        <Link href="/academy/teacher/dashboard" className="text-amber-400 hover:text-amber-200 transition text-sm">← Back to Dashboard</Link>
      </div>
    </TeacherLayout>
  );

  return (
    <TeacherLayout title={course?.title ?? "Course Editor"}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link href="/academy/teacher/dashboard" className="text-xs text-slate-400 hover:text-amber-200 transition">← Dashboard</Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm font-semibold text-slate-100 truncate">{course?.title}</span>
          <span className={`text-[10px] rounded-full px-2 py-0.5 border ml-1 ${course?.published ? "border-emerald-500/30 text-emerald-300" : "border-white/10 text-slate-500"}`}>
            {course?.published ? "Published" : "Draft"}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          You can manage content (modules, lessons, quizzes) for this course.
          To publish, change title or price — contact your admin.
        </p>

        {/* Modules */}
        <div className="flex flex-col gap-3 mb-5">
          {modules.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-slate-500 text-sm">
              No modules yet. Add the first one below.
            </div>
          )}
          {modules.map((mod) => (
            <ModuleBlock
              key={mod.id}
              mod={mod}
              courseId={id}
              token={token}
              onUpdate={(updated) => setModules((ms) => ms.map((m) => m.id === updated.id ? { ...m, ...updated } : m))}
              onDelete={() => deleteModule(mod.id)}
            />
          ))}
        </div>

        {/* Add module */}
        <div className="flex items-center gap-2">
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addModule()}
            placeholder="New module title…"
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/60 transition"
          />
          <button
            onClick={addModule}
            disabled={addingModule || !newModuleTitle.trim()}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 px-4 py-2.5 text-sm font-semibold text-slate-950 transition"
          >
            {addingModule ? "Adding…" : "+ Add Module"}
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
}

TeacherCourseEditor.noLayout = true;
