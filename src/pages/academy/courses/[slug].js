import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import PageSection from "@/components/PageSection";
import { supabase } from "@/lib/supabase";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return match ? match[1] : null;
}

export default function CourseDetail({ course, modules }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [openModule, setOpenModule] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      setUser(data.session.user);

      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", data.session.user.id)
        .eq("course_id", course.id)
        .single();

      setHasPurchased(!!purchase);
    });
  }, [course.id]);

  if (!course) return null;

  const isFree = !course.price || course.price === 0;
  const allLessons = modules.flatMap((m) => m.lessons ?? []);
  const freeLessons = allLessons.filter((l) => l.is_free);

  function handleEnroll() {
    if (!user) {
      router.push("/academy/login");
      return;
    }
    // TODO: integrate Razorpay/Stripe in Phase 2
    alert("Payment integration coming soon. Contact us to enroll.");
  }

  return (
    <>
      <Head>
        <title>{course.title} | Sejal Academy</title>
        <meta name="description" content={course.description} />
      </Head>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-white/10 bg-slate-950/90 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-base font-bold text-slate-100">
          {isFree ? "Free" : `₹${course.price}`}
        </p>
        {hasPurchased ? (
          <Link
            href={`/academy/learn/${course.slug}`}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition"
          >
            Continue →
          </Link>
        ) : (
          <button
            onClick={handleEnroll}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition"
          >
            {isFree ? "Enroll Free" : "Enroll Now"}
          </button>
        )}
      </div>

      {/* Extra bottom padding on mobile so content isn't hidden behind sticky bar */}
      <div className="pb-20 md:pb-0">
        <PageSection>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {/* LEFT: Course info */}
            <div className="md:col-span-2 flex flex-col gap-5">
              {/* Hero card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                {course.thumbnail_url && (
                  <div className="relative h-48 md:h-64">
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-slate-950/10" />
                  </div>
                )}
                <div className="p-4 md:p-6">
                  {course.language && (
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-slate-400 mb-2">
                      {course.language}
                    </span>
                  )}
                  <h1 className="text-xl md:text-3xl font-bold text-slate-100">{course.title}</h1>
                  {course.description && (
                    <p className="mt-2 text-slate-300 text-sm">{course.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                    {course.instructor && <span>👤 {course.instructor}</span>}
                    {course.duration_hours && <span>⏱ {course.duration_hours}h</span>}
                    {course.total_lessons > 0 && <span>📚 {course.total_lessons} lessons</span>}
                    <span>🔓 {freeLessons.length} free</span>
                  </div>
                </div>
              </div>

              {/* Preview player */}
              {previewLesson && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 overflow-hidden"
                >
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeId(previewLesson.youtube_url)}?rel=0&modestbranding=1`}
                      title={previewLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <p className="text-xs text-cyan-200 truncate">Preview: {previewLesson.title}</p>
                    <button
                      onClick={() => setPreviewLesson(null)}
                      className="shrink-0 text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      Close ✕
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Curriculum */}
              {modules.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold mb-3">Curriculum</h2>
                  <div className="flex flex-col gap-2">
                    {modules.map((mod, i) => (
                      <div
                        key={mod.id}
                        className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenModule(openModule === i ? -1 : i)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-200 hover:text-cyan-200 transition"
                        >
                          <span className="pr-2">{mod.title}</span>
                          <span className="shrink-0 text-slate-500 text-xs">
                            {mod.lessons?.length ?? 0} lessons {openModule === i ? "▲" : "▼"}
                          </span>
                        </button>

                        {openModule === i && (
                          <div className="border-t border-white/10">
                            {(mod.lessons ?? []).map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 last:border-b-0 gap-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-xs shrink-0">
                                    {lesson.is_free ? "🔓" : "🔒"}
                                  </span>
                                  <span className="text-xs text-slate-300 truncate">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {lesson.duration_mins > 0 && (
                                    <span className="text-[10px] text-slate-500">
                                      {lesson.duration_mins}m
                                    </span>
                                  )}
                                  {lesson.is_free && lesson.youtube_url && (
                                    <button
                                      onClick={() => setPreviewLesson(lesson)}
                                      className="text-[10px] text-cyan-300 hover:text-cyan-200 transition"
                                    >
                                      Preview
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long description */}
              {course.long_description && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                  <h2 className="text-base font-semibold mb-3">About this course</h2>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {course.long_description}
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT: Enroll card — desktop only (mobile uses sticky bar) */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5 flex flex-col gap-4">
                <div>
                  <p className="text-2xl font-bold text-slate-100">
                    {isFree ? "Free" : `₹${course.price}`}
                  </p>
                  {!isFree && (
                    <p className="text-xs text-slate-400 mt-0.5">One-time payment • Lifetime access</p>
                  )}
                </div>

                {hasPurchased ? (
                  <Link
                    href={`/academy/learn/${course.slug}`}
                    className="block text-center rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition"
                  >
                    Continue Learning →
                  </Link>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition"
                  >
                    {isFree ? "Enroll for Free" : "Enroll Now"}
                  </button>
                )}

                <ul className="flex flex-col gap-2 text-xs text-slate-400">
                  {course.duration_hours && <li>⏱ {course.duration_hours} hours of content</li>}
                  {course.total_lessons > 0 && <li>📚 {course.total_lessons} lessons</li>}
                  <li>🎥 YouTube-hosted videos</li>
                  <li>🔤 Auto subtitles (70+ languages)</li>
                  <li>📱 Watch on any device</li>
                  <li>♾️ Lifetime access</li>
                </ul>

                {!user && (
                  <p className="text-[11px] text-slate-500 text-center">
                    <Link href="/academy/login" className="text-cyan-300 hover:text-cyan-200 transition">
                      Sign in
                    </Link>{" "}
                    to enroll
                  </p>
                )}
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!course) return { notFound: true };

  const { data: modules } = await supabase
    .from("modules")
    .select("*, lessons(*)")
    .eq("course_id", course.id)
    .order("order", { ascending: true });

  const sortedModules = (modules ?? []).map((m) => ({
    ...m,
    lessons: (m.lessons ?? []).sort((a, b) => a.order - b.order),
  }));

  return { props: { course, modules: sortedModules } };
}
