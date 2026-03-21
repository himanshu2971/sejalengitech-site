import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PageSection from "@/components/PageSection";
import { supabase } from "@/lib/supabase";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
};

function CourseCard({ course }) {
  const isFree = !course.price || course.price === 0;

  return (
    <motion.div variants={item}>
      <Link href={`/academy/courses/${course.slug}`} className="group block">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] overflow-hidden hover:border-cyan-400/40 transition">
          {/* Thumbnail */}
          <div className="relative h-44 bg-slate-800/60">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl text-slate-600">🎓</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />

            {/* Language badge */}
            {course.language && (
              <span className="absolute top-3 right-3 rounded-full border border-white/10 bg-slate-900/70 backdrop-blur-sm px-2.5 py-0.5 text-[10px] text-slate-300">
                {course.language}
              </span>
            )}

            {/* Price badge */}
            <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
              isFree
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
            }`}>
              {isFree ? "Free" : `₹${course.price}`}
            </span>
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-1.5">
            <h3 className="text-sm md:text-base font-semibold text-slate-100 group-hover:text-cyan-200 transition line-clamp-2">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
              {course.instructor && <span>👤 {course.instructor}</span>}
              {course.duration_hours && <span>⏱ {course.duration_hours}h</span>}
              {course.total_lessons > 0 && <span>📚 {course.total_lessons} lessons</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function AcademyIndex({ courses }) {
  return (
    <>
      <Head>
        <title>Academy | Sejal Engitech</title>
        <meta name="description" content="Learn IT skills from Sejal Engitech experts. Online courses, live sessions, and recorded lectures." />
      </Head>

      <PageSection>
        {/* Hero */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-8 mb-8">
          <span className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Sejal Academy
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
            Learn skills that<br className="hidden md:block" /> power real businesses.
          </h1>
          <p className="mt-3 text-slate-200/75 text-sm md:text-base max-w-2xl">
            Expert-led courses in IT, networking, cybersecurity, and more. Live sessions,
            recorded lectures, and subtitles in multiple languages.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              🌐 Global access
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              🎥 YouTube hosted videos
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              🔤 Auto subtitles (70+ languages)
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              📱 Installable on mobile
            </span>
          </div>
        </div>

        {/* Course catalog */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-semibold">All Courses</h2>
            <Link
              href="/academy/login"
              className="text-xs text-cyan-200/80 hover:text-cyan-200 transition"
            >
              Sign in →
            </Link>
          </div>

          {courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center"
            >
              <p className="text-3xl mb-3">🎓</p>
              <p className="text-slate-300 font-medium">Courses launching soon</p>
              <p className="text-slate-400 text-sm mt-1">
                Be the first to know — follow us on Instagram or WhatsApp.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          )}
        </div>
      </PageSection>
    </>
  );
}

export async function getServerSideProps() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, slug, description, thumbnail_url, price, currency, language, instructor, duration_hours, total_lessons")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return { props: { courses: courses ?? [] } };
}
