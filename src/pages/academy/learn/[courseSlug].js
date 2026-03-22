import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuizPlayer from "@/components/academy/QuizPlayer";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return match ? match[1] : null;
}

export default function LearnPage() {
  const router = useRouter();
  const { courseSlug } = router.query;

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showLessons, setShowLessons] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!courseSlug) return;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/academy/login");
        return;
      }

      const sessionUser = data.session.user;
      setUser(sessionUser);

      const { data: courseData } = await supabase
        .from("courses")
        .select("id, title, slug, price")
        .eq("slug", courseSlug)
        .eq("published", true)
        .single();

      if (!courseData) { router.replace("/academy"); return; }

      const isFree = !courseData.price || courseData.price === 0;
      if (!isFree) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", sessionUser.id)
          .eq("course_id", courseData.id)
          .single();
        if (!purchase) { router.replace(`/academy/courses/${courseSlug}`); return; }
      }

      setCourse(courseData);

      const { data: modulesData } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", courseData.id)
        .order("order", { ascending: true });

      const sortedModules = (modulesData ?? []).map((m) => ({
        ...m,
        lessons: (m.lessons ?? []).sort((a, b) => a.order - b.order),
      }));

      setModules(sortedModules);
      const firstLesson = sortedModules[0]?.lessons?.[0];
      if (firstLesson) setActiveLesson(firstLesson);

      const { data: progressData } = await supabase
        .from("progress")
        .select("lesson_id")
        .eq("user_id", sessionUser.id);

      setCompleted(new Set((progressData ?? []).map((p) => p.lesson_id)));
      setLoading(false);
    });
  }, [courseSlug, router]);

  async function markComplete(lessonId) {
    if (completed.has(lessonId) || !user) return;
    await supabase.from("progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    });
    setCompleted((prev) => new Set([...prev, lessonId]));
  }

  function goToNextLesson() {
    const all = modules.flatMap((m) => m.lessons ?? []);
    const idx = all.findIndex((l) => l.id === activeLesson?.id);
    if (idx < all.length - 1) { setActiveLesson(all[idx + 1]); setShowQuiz(false); }
  }

  const allLessons = modules.flatMap((m) => m.lessons ?? []);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completed.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const videoId = getYouTubeId(activeLesson?.youtube_url);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Loading course…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{activeLesson?.title ?? course?.title} | Alambana EduTech</title>
      </Head>

      <div className="min-h-screen bg-[#0E0F14] text-slate-100 flex flex-col">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#16171E]/90 backdrop-blur-xl px-3 md:px-5 py-2.5 flex items-center gap-3">
          {/* Brand */}
          <Link href="/academy" className="shrink-0 flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">A</span>
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition hidden sm:block">
              Alambana
            </span>
          </Link>

          <span className="text-slate-700 shrink-0">/</span>
          <span className="text-xs text-slate-400 truncate min-w-0">{course?.title}</span>

          {/* Progress */}
          <div className="ml-auto flex items-center gap-2.5 shrink-0">
            <div className="w-20 md:w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">{progressPct}%</span>
          </div>

          {/* Mobile lesson toggle */}
          <button
            onClick={() => setShowLessons((v) => !v)}
            className="md:hidden shrink-0 text-xs border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-300 hover:bg-white/[0.05] transition"
          >
            Lessons
          </button>
        </header>

        <div className="flex flex-1">
          {/* ── Sidebar — desktop ── */}
          <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-white/[0.06] bg-[#13141A] overflow-y-auto">
            <div className="p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-4 px-1">
                Course content
              </p>
              {modules.map((mod) => (
                <div key={mod.id} className="mb-5">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2 px-1 uppercase tracking-wide">{mod.title}</p>
                  <div className="flex flex-col gap-0.5">
                    {(mod.lessons ?? []).map((lesson) => {
                      const isActive = lesson.id === activeLesson?.id;
                      const isDone = completed.has(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => { setActiveLesson(lesson); setShowQuiz(false); }}
                          className={`w-full text-left flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition ${
                            isActive
                              ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300"
                              : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0 text-[10px]">
                            {isDone ? "✅" : isActive ? "▶" : "○"}
                          </span>
                          <span className="leading-snug flex-1">{lesson.title}</span>
                          {lesson.duration_mins > 0 && (
                            <span className="ml-auto shrink-0 text-slate-600 text-[10px]">
                              {lesson.duration_mins}m
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {/* Mobile lesson list */}
            {showLessons && (
              <div className="md:hidden border-b border-white/[0.06] bg-[#13141A] max-h-64 overflow-y-auto">
                <div className="p-3 flex flex-col gap-1">
                  {allLessons.map((lesson) => {
                    const isActive = lesson.id === activeLesson?.id;
                    const isDone = completed.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => { setActiveLesson(lesson); setShowLessons(false); setShowQuiz(false); }}
                        className={`w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                          isActive
                            ? "bg-indigo-600/15 border border-indigo-500/30 text-indigo-300"
                            : "border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className="shrink-0">{isDone ? "✅" : isActive ? "▶" : "○"}</span>
                        <span className="truncate">{lesson.title}</span>
                        {lesson.duration_mins > 0 && (
                          <span className="ml-auto shrink-0 text-slate-600">{lesson.duration_mins}m</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeLesson ? (
              <div className="max-w-4xl mx-auto px-3 md:px-6 py-5 md:py-7 flex flex-col gap-5">
                {/* Video */}
                {videoId ? (
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/40">
                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&cc_load_policy=1`}
                        title={activeLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] h-48 flex items-center justify-center">
                    <p className="text-slate-500 text-sm">No video for this lesson</p>
                  </div>
                )}

                {/* Lesson info + controls */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-base md:text-xl font-bold text-white leading-snug">
                      {activeLesson.title}
                    </h1>
                    {activeLesson.duration_mins > 0 && (
                      <p className="text-xs text-slate-500 mt-1">⏱ {activeLesson.duration_mins} min</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                      onClick={() => markComplete(activeLesson.id)}
                      disabled={completed.has(activeLesson.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        completed.has(activeLesson.id)
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 cursor-default"
                          : "border border-white/10 bg-white/[0.05] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 hover:bg-emerald-500/5"
                      }`}
                    >
                      {completed.has(activeLesson.id) ? "✅ Done" : "Mark done"}
                    </button>

                    <button
                      onClick={() => setShowQuiz((v) => !v)}
                      className="rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 px-3 py-1.5 text-xs font-medium transition"
                    >
                      {showQuiz ? "Hide quiz" : "📝 Take quiz"}
                    </button>

                    <button
                      onClick={goToNextLesson}
                      className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 px-3 py-1.5 text-xs font-medium transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Quiz player */}
                {showQuiz && (
                  <QuizPlayer
                    lessonId={activeLesson.id}
                    userId={user?.id}
                    onPass={() => markComplete(activeLesson.id)}
                  />
                )}

                {/* Lesson Notes */}
                {activeLesson.notes_url && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-200">📄 Lesson Notes</p>
                      <a
                        href={activeLesson.notes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 px-3 py-1.5 text-xs font-medium transition shrink-0"
                      >
                        Download ↓
                      </a>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                      <iframe
                        src={activeLesson.notes_url}
                        title="Lesson Notes"
                        className="w-full"
                        style={{ height: "520px", border: "none" }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer nav */}
                <div className="border-t border-white/[0.06] pt-4 flex items-center justify-between">
                  <Link
                    href="/academy/dashboard"
                    className="text-xs text-slate-500 hover:text-indigo-400 transition"
                  >
                    ← Dashboard
                  </Link>
                  <Link
                    href="/academy"
                    className="text-xs text-slate-500 hover:text-indigo-400 transition"
                  >
                    Browse courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-24">
                <p className="text-slate-500 text-sm">Select a lesson to begin</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

LearnPage.noLayout = true;
