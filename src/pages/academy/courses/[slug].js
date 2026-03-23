import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AcademyHeader from "@/components/academy/AcademyHeader";
import { usePriceDisplay } from "@/lib/formatters";

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/);
  return match ? match[1] : null;
}

export default function CourseDetail({ course, modules }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [openModule, setOpenModule] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setAuthReady(true);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [course.id]);

  if (!course) return null;

  const isFree = !course.price || course.price === 0;
  const priceDisplay = usePriceDisplay(isFree ? 0 : course.price);
  const allLessons = modules.flatMap((m) => m.lessons ?? []);
  const freeLessons = allLessons.filter((l) => l.is_free);

  async function handleEnroll() {
    if (!user) {
      router.push(`/academy/login?next=/academy/courses/${course.slug}`);
      return;
    }
    if (isFree) {
      setEnrolling(true);
      try {
        const { error } = await supabase.from("purchases").insert({
          user_id: user.id,
          course_id: course.id,
          amount: 0,
          currency: "INR",
          status: "completed",
        });
        if (error && error.code !== "23505") throw error; // 23505 = duplicate, already enrolled
        setHasPurchased(true);
        router.push(`/academy/learn/${course.slug}`);
      } catch {
        setEnrolling(false);
      }
    } else {
      setShowPaidModal(true);
    }
  }

  const waLink = `https://wa.me/919001207105?text=${encodeURIComponent(`Hi, I want to enroll in "${course.title}"`)}`;
  const mailLink = `mailto:info.sejalengitech@gmail.com?subject=${encodeURIComponent(`Enroll in ${course.title}`)}`;

  return (
    <>
      <Head>
        <title>{course.title} | Alambana EduTech</title>
        <meta name="description" content={course.description} />
      </Head>

      {/* Paid enrollment modal */}
      {showPaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaidModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPaidModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition text-xl leading-none">✕</button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">🎓</div>
            <h3 className="text-lg font-black text-slate-900 text-center mb-1">Enroll in {course.title}</h3>
            <p className="text-sm text-slate-500 text-center mb-1">
              <span className="font-bold text-slate-800">{priceDisplay ?? `₹${course.price}`}</span> · One-time · Lifetime access
            </p>
            <p className="text-xs text-slate-400 text-center mb-5">Enrollment is managed manually. Reach us via WhatsApp or email to complete your registration.</p>
            <div className="flex flex-col gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 text-sm transition shadow-md shadow-emerald-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <a
                href={mailLink}
                className="flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-bold py-3 px-4 text-sm transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Send Email
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50">
        <AcademyHeader user={user} onSignOut={async () => { await supabase.auth.signOut(); router.push("/academy"); }} authReady={authReady} />

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-slate-100 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {priceDisplay ?? (isFree ? "Free" : `₹${course.price}`)}
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
              disabled={enrolling}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition shadow-sm flex items-center gap-2"
            >
              {enrolling && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
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
                      {priceDisplay ?? (isFree ? "Free" : `₹${course.price}`)}
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
                      disabled={enrolling}
                      className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {enrolling && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
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
