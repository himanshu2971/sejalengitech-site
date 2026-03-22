import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AcademyHeader from "@/components/academy/AcademyHeader";

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
    alert("Payment integration coming soon. Contact us to enroll.");
  }

  return (
    <>
      <Head>
        <title>{course.title} | Alambana EduTech</title>
        <meta name="description" content={course.description} />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <AcademyHeader user={user} onSignOut={async () => { await supabase.auth.signOut(); router.push("/academy"); }} />

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-100 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {isFree ? "Free" : `₹${course.price}`}
            </p>
            {!isFree && <p className="text-[10px] text-slate-400">Lifetime access</p>}
          </div>
          {hasPurchased ? (
            <Link
              href={`/academy/learn/${course.slug}`}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition shadow-sm"
            >
              Continue Learning →
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition shadow-sm"
            >
              {isFree ? "Enroll Free" : "Enroll Now"}
            </button>
          )}
        </div>

        <div className="pb-24 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">

              {/* LEFT: Course info */}
              <div className="md:col-span-2 flex flex-col gap-5">

                {/* Hero card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {course.thumbnail_url && (
                    <div className="relative h-52 md:h-72">
                      <Image
                        src={course.thumbnail_url}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {course.language && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                          {course.language}
                        </span>
                      )}
                      {course.difficulty && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 capitalize">
                          {course.difficulty}
                        </span>
                      )}
                      {course.grade_level && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          {course.grade_level}
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl md:text-3xl font-bold text-slate-900 leading-snug">{course.title}</h1>
                    {course.description && (
                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">{course.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 pt-4 border-t border-slate-50">
                      {course.instructor && <span className="font-medium text-slate-700">👤 {course.instructor}</span>}
                      {course.duration_hours && <span>⏱ {course.duration_hours}h total</span>}
                      {course.total_lessons > 0 && <span>📚 {course.total_lessons} lessons</span>}
                      <span>🔓 {freeLessons.length} free preview</span>
                    </div>
                  </div>
                </div>

                {/* Preview player */}
                {previewLesson && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden"
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
                    <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-t border-slate-100">
                      <p className="text-xs text-indigo-600 font-medium truncate">Preview: {previewLesson.title}</p>
                      <button
                        onClick={() => setPreviewLesson(null)}
                        className="shrink-0 text-xs text-slate-400 hover:text-slate-700 transition"
                      >
                        Close ✕
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Curriculum */}
                {modules.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-50">
                      <h2 className="text-base font-bold text-slate-900">Course curriculum</h2>
                      <p className="text-xs text-slate-500 mt-0.5">{allLessons.length} lessons · {freeLessons.length} free previews</p>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {modules.map((mod, i) => (
                        <div key={mod.id}>
                          <button
                            onClick={() => setOpenModule(openModule === i ? -1 : i)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition"
                          >
                            <span className="text-sm font-semibold text-slate-800 pr-2">{mod.title}</span>
                            <span className="shrink-0 text-xs text-slate-400 flex items-center gap-1.5">
                              {mod.lessons?.length ?? 0} lessons
                              <span className="text-slate-300">{openModule === i ? "▲" : "▼"}</span>
                            </span>
                          </button>

                          {openModule === i && (
                            <div className="border-t border-slate-50 bg-slate-50/50">
                              {(mod.lessons ?? []).map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 last:border-b-0 gap-3"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-xs shrink-0 text-slate-400">
                                      {lesson.is_free ? "🔓" : "🔒"}
                                    </span>
                                    <span className="text-xs text-slate-700 truncate">{lesson.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {lesson.duration_mins > 0 && (
                                      <span className="text-[10px] text-slate-400">{lesson.duration_mins}m</span>
                                    )}
                                    {lesson.is_free && lesson.youtube_url && (
                                      <button
                                        onClick={() => setPreviewLesson(lesson)}
                                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition"
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
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
                    <h2 className="text-base font-bold text-slate-900 mb-3">About this course</h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {course.long_description}
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT: Enroll card — desktop only */}
              <div className="hidden md:block md:col-span-1">
                <div className="sticky top-20 bg-white rounded-2xl border border-slate-100 shadow-md p-5 flex flex-col gap-4">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      {isFree ? "Free" : `₹${course.price}`}
                    </p>
                    {!isFree && (
                      <p className="text-xs text-slate-500 mt-0.5">One-time · Lifetime access</p>
                    )}
                  </div>

                  {hasPurchased ? (
                    <Link
                      href={`/academy/learn/${course.slug}`}
                      className="block text-center rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm"
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm shadow-indigo-200"
                    >
                      {isFree ? "Enroll for Free" : "Enroll Now"}
                    </button>
                  )}

                  <ul className="flex flex-col gap-2 text-xs text-slate-500 border-t border-slate-50 pt-3">
                    {course.duration_hours && <li className="flex items-center gap-2"><span>⏱</span> {course.duration_hours} hours of content</li>}
                    {course.total_lessons > 0 && <li className="flex items-center gap-2"><span>📚</span> {course.total_lessons} lessons</li>}
                    <li className="flex items-center gap-2"><span>🎥</span> YouTube-hosted videos</li>
                    <li className="flex items-center gap-2"><span>🔤</span> Auto subtitles (70+ languages)</li>
                    <li className="flex items-center gap-2"><span>📱</span> Watch on any device</li>
                    <li className="flex items-center gap-2"><span>♾️</span> Lifetime access</li>
                  </ul>

                  {!user && (
                    <p className="text-[11px] text-slate-400 text-center border-t border-slate-50 pt-3">
                      <Link href="/academy/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition">
                        Sign in
                      </Link>{" "}
                      to enroll
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CourseDetail.noLayout = true;

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
