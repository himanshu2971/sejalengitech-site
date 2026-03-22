import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

      if (!courseData) {
        router.replace("/academy");
        return;
      }

      const isFree = !courseData.price || courseData.price === 0;

      if (!isFree) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", sessionUser.id)
          .eq("course_id", courseData.id)
          .single();

        if (!purchase) {
          router.replace(`/academy/courses/${courseSlug}`);
          return;
        }
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
    if (idx < all.length - 1) setActiveLesson(all[idx + 1]);
  }

  const allLessons = modules.flatMap((m) => m.lessons ?? []);
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completed.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const videoId = getYouTubeId(activeLesson?.youtube_url);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading course…</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{activeLesson?.title ?? course?.title} | Sejal Academy</title>
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-3 md:px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/academy"
            className="shrink-0 text-xs text-slate-400 hover:text-cyan-200 transition"
          >
            ← Academy
          </Link>
          <span className="text-slate-600 shrink-0">/</span>
          <span className="text-xs text-slate-300 truncate min-w-0">{course?.title}</span>

          {/* Progress bar */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="w-16 md:w-24 h-1.5 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">{progressPct}%</span>
          </div>

          {/* Mobile lesson toggle */}
          <button
            onClick={() => setShowLessons((v) => !v)}
            className="md:hidden shrink-0 text-xs border border-white/10 rounded-md px-2.5 py-1.5 text-slate-300 hover:text-cyan-200 transition"
          >
            Lessons
          </button>
        </header>

        {/* Desktop: sidebar + player split. Mobile: stacked */}
        <div className="flex flex-1">
          {/* Sidebar — desktop only */}
          <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 border-r border-white/10 bg-slate-950/60 overflow-y-auto">
            <div className="p-4">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3">
                Course content
              </p>
              {modules.map((mod) => (
                <div key={mod.id} className="mb-4">
                  <p className="text-xs font-semibold text-slate-300 mb-1.5 px-1">{mod.title}</p>
                  <div className="flex flex-col gap-0.5">
                    {(mod.lessons ?? []).map((lesson) => {
                      const isActive = lesson.id === activeLesson?.id;
                      const isDone = completed.has(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left flex items-start gap-2 rounded-lg px-2.5 py-2 text-xs transition ${
                            isActive
                              ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-200"
                              : "text-slate-300 hover:bg-white/[0.04] hover:text-slate-100"
                          }`}
                        >
                          <span className="mt-0.5 shrink-0 text-[10px]">
                            {isDone ? "✅" : isActive ? "▶" : "○"}
                          </span>
                          <span className="leading-snug">{lesson.title}</span>
                          {lesson.duration_mins > 0 && (
                            <span className="ml-auto shrink-0 text-slate-500 text-[10px]">
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

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {/* Mobile: collapsible lesson list */}
            {showLessons && (
              <div className="md:hidden border-b border-white/10 bg-slate-900/60 max-h-64 overflow-y-auto">
                <div className="p-3 flex flex-col gap-0.5">
                  {allLessons.map((lesson) => {
                    const isActive = lesson.id === activeLesson?.id;
                    const isDone = completed.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          setShowLessons(false);
                        }}
                        className={`w-full text-left flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                          isActive
                            ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-200"
                            : "border border-white/10 bg-white/[0.03] text-slate-300"
                        }`}
                      >
                        <span className="shrink-0">{isDone ? "✅" : isActive ? "▶" : "○"}</span>
                        <span className="truncate">{lesson.title}</span>
                        {lesson.duration_mins > 0 && (
                          <span className="ml-auto shrink-0 text-slate-500">{lesson.duration_mins}m</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeLesson ? (
              <div className="max-w-4xl mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-4">
                {/* Video player */}
                {videoId ? (
                  <div className="rounded-xl md:rounded-2xl overflow-hidden border border-white/10">
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
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] h-40 flex items-center justify-center">
                    <p className="text-slate-500 text-sm">No video for this lesson</p>
                  </div>
                )}

                {/* Lesson title + controls */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-base md:text-xl font-semibold text-slate-100 leading-snug">
                      {activeLesson.title}
                    </h1>
                    {activeLesson.duration_mins > 0 && (
                      <p className="text-xs text-slate-400 mt-1">⏱ {activeLesson.duration_mins} min</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => markComplete(activeLesson.id)}
                      disabled={completed.has(activeLesson.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        completed.has(activeLesson.id)
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 cursor-default"
                          : "border border-white/10 bg-white/[0.05] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-200"
                      }`}
                    >
                      {completed.has(activeLesson.id) ? "✅ Done" : "Mark done"}
                    </button>

                    <button
                      onClick={goToNextLesson}
                      className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200 hover:bg-cyan-500/20 transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                {/* Dashboard link */}
                <div className="border-t border-white/10 pt-4">
                  <Link
                    href="/academy/dashboard"
                    className="text-xs text-slate-500 hover:text-cyan-200 transition"
                  >
                    ← Back to dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
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
