import { useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Papa from "papaparse";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";

const CSV_TEMPLATE = `course_title,course_category,course_price,course_language,course_instructor,course_difficulty,course_description,module_name,module_order,lesson_title,lesson_youtube_url,lesson_duration_mins,lesson_is_free
"Web Dev Bootcamp",technology,0,English,"Jane Doe",beginner,"Learn web development from scratch","Module 1: Basics",1,"Intro to HTML","https://www.youtube.com/watch?v=dQw4w9WgXcQ",15,TRUE
"Web Dev Bootcamp",technology,0,English,"Jane Doe",beginner,"Learn web development from scratch","Module 1: Basics",1,"CSS Fundamentals","https://www.youtube.com/watch?v=dQw4w9WgXcQ",20,TRUE
"Web Dev Bootcamp",technology,0,English,"Jane Doe",beginner,"Learn web development from scratch","Module 2: Advanced",2,"JavaScript Basics","https://www.youtube.com/watch?v=dQw4w9WgXcQ",25,FALSE`;

const REQUIRED_COLS = ["course_title", "course_category", "module_name", "lesson_title", "lesson_youtube_url"];

export default function ImportPage() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [rows, setRows] = useState(null);
  const [errors, setErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "alambana_course_import_template.csv";
    a.click();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null); setErrors([]);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        // Check required columns
        const cols = parsed.meta.fields ?? [];
        const missing = REQUIRED_COLS.filter((c) => !cols.includes(c));
        if (missing.length) {
          setErrors([`Missing required columns: ${missing.join(", ")}`]);
          setRows(null);
          return;
        }
        setRows(parsed.data);
        setErrors([]);
      },
      error: (err) => setErrors([`CSV parse error: ${err.message}`]),
    });
  }

  async function handleImport() {
    if (!rows?.length) return;
    setImporting(true); setErrors([]); setResult(null);
    const res = await fetch("/api/academy/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErrors(data.errors ?? [data.error]);
      setImporting(false);
      return;
    }
    setResult(data);
    setRows(null);
    setImporting(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  // Group rows by course for preview
  const preview = rows
    ? rows.reduce((acc, r) => {
        const ct = r.course_title?.trim() || "(unnamed)";
        if (!acc[ct]) acc[ct] = { modules: {} };
        const mn = r.module_name?.trim() || "(unnamed module)";
        if (!acc[ct].modules[mn]) acc[ct].modules[mn] = [];
        acc[ct].modules[mn].push(r.lesson_title?.trim() || "(unnamed lesson)");
        return acc;
      }, {})
    : null;

  const totalLessons = rows?.length ?? 0;
  const totalCourses = preview ? Object.keys(preview).length : 0;

  return (
    <AdminLayout title="Import Courses">
      <Head><title>Import Courses | Alambana Admin</title></Head>
      <div className="p-4 md:p-8 max-w-4xl">

        <div className="mb-8">
          <h1 className="text-xl font-black text-slate-100">📥 Bulk Course Import</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload a CSV file to create multiple courses, modules, and lessons at once.
            All imported courses start as <span className="text-amber-300 font-semibold">unpublished</span> — review and publish manually.
          </p>
        </div>

        {/* Step 1: Download template */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
          <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3">Step 1 — Get the template</p>
          <p className="text-sm text-slate-300 mb-4">
            Download the CSV template, fill it in with your courses (one row = one lesson), then upload it below.
            You can fill it using Excel, Google Sheets, or any spreadsheet app.
          </p>
          <button onClick={downloadTemplate}
            className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 px-4 py-2.5 text-sm font-bold text-cyan-300 transition">
            ⬇ Download CSV Template
          </button>
          <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-3 overflow-x-auto">
            <p className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{CSV_TEMPLATE.split("\n")[0]}</p>
          </div>
        </div>

        {/* Step 2: Upload */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
          <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3">Step 2 — Upload your CSV</p>
          <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/10 hover:border-cyan-500/30 transition cursor-pointer p-8 text-center">
            <span className="text-3xl">📂</span>
            <span className="text-sm text-slate-400">Click to select your CSV file</span>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 mb-4">
            <p className="text-sm font-bold text-red-300 mb-2">⚠ Fix these issues before importing:</p>
            <ul className="space-y-1">
              {errors.map((e, i) => <li key={i} className="text-xs text-red-400">• {e}</li>)}
            </ul>
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
            <p className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-3">
              Step 3 — Preview ({totalCourses} course{totalCourses !== 1 ? "s" : ""}, {totalLessons} lesson{totalLessons !== 1 ? "s" : ""})
            </p>
            <div className="space-y-4">
              {Object.entries(preview).map(([course, { modules }]) => (
                <div key={course} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-bold text-slate-100 mb-2">🎓 {course}</p>
                  {Object.entries(modules).map(([mod, lessons]) => (
                    <div key={mod} className="ml-4 mb-2">
                      <p className="text-xs font-semibold text-slate-400 mb-1">📁 {mod}</p>
                      {lessons.map((l, i) => (
                        <p key={i} className="text-[11px] text-slate-500 ml-4">▸ {l}</p>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button
              onClick={handleImport}
              disabled={importing}
              className="mt-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 px-6 py-3 text-sm font-bold text-white transition shadow-lg shadow-cyan-500/20"
            >
              {importing ? "Importing…" : `Import ${totalLessons} lessons across ${totalCourses} courses`}
            </button>
          </div>
        )}

        {/* Success */}
        {result && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
            <p className="text-base font-bold text-emerald-300 mb-3">✅ Import successful!</p>
            <div className="flex gap-6 flex-wrap">
              {[["Courses created", result.courses_created], ["Modules created", result.modules_created], ["Lessons created", result.lessons_created]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-xs text-emerald-400">{l}</p>
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/academy/admin/courses")}
              className="mt-4 rounded-xl border border-cyan-500/30 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-500/10 transition">
              View Courses →
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

ImportPage.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  return { props: {} };
}
