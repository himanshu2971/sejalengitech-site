import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PageSection from "@/components/PageSection";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────
// Category config
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    value: "all",
    label: "All",
    emoji: "✨",
    color: "cyan",
    tagline: "Every course we offer",
  },
  {
    value: "tuition",
    label: "Tuition",
    emoji: "📚",
    color: "amber",
    tagline: "Class 1 – 12 subjects, board exam prep, concept clarity",
    desc: "Personalised classes for school students",
    audience: "kids",
  },
  {
    value: "coaching",
    label: "Coaching",
    emoji: "🏆",
    color: "rose",
    tagline: "JEE · NEET · UPSC · CAT — India's toughest exams",
    desc: "Crack competitive exams with structured prep",
    audience: "competitive",
  },
  {
    value: "technology",
    label: "Technology",
    emoji: "💻",
    color: "sky",
    tagline: "Coding, web dev, cybersecurity, networking & more",
    desc: "Future-proof your career with tech skills",
    audience: "tech",
  },
  {
    value: "creative",
    label: "Creative",
    emoji: "🎨",
    color: "violet",
    tagline: "Art, music, dance, design — express yourself",
    desc: "Unlock your creative potential",
    audience: "creative",
  },
  {
    value: "professional",
    label: "Professional",
    emoji: "💼",
    color: "emerald",
    tagline: "Business, marketing, communication, leadership",
    desc: "Grow your career and business",
    audience: "professional",
  },
];

const COLOR_MAP = {
  cyan:     { tab: "border-cyan-500/50 bg-cyan-500/10 text-cyan-200",    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200" },
  amber:    { tab: "border-amber-500/50 bg-amber-500/10 text-amber-200",  badge: "border-amber-500/30 bg-amber-500/10 text-amber-200" },
  rose:     { tab: "border-rose-500/50 bg-rose-500/10 text-rose-200",     badge: "border-rose-500/30 bg-rose-500/10 text-rose-200" },
  sky:      { tab: "border-sky-500/50 bg-sky-500/10 text-sky-200",        badge: "border-sky-500/30 bg-sky-500/10 text-sky-200" },
  violet:   { tab: "border-violet-500/50 bg-violet-500/10 text-violet-200", badge: "border-violet-500/30 bg-violet-500/10 text-violet-200" },
  emerald:  { tab: "border-emerald-500/50 bg-emerald-500/10 text-emerald-200", badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
};

// ─────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3, ease: "easeOut" } },
};

// ─────────────────────────────────────────────
// Course card
// ─────────────────────────────────────────────
function CourseCard({ course }) {
  const isFree = !course.price || course.price === 0;
  const cat = CATEGORIES.find((c) => c.value === course.category);
  const color = cat ? COLOR_MAP[cat.color] : COLOR_MAP.cyan;

  return (
    <motion.div variants={cardItem}>
      <Link href={`/academy/courses/${course.slug}`} className="group block h-full">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] overflow-hidden hover:border-white/20 transition h-full flex flex-col">
          {/* Thumbnail */}
          <div className="relative h-44 bg-slate-800/60 shrink-0">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition"
              />
            ) : (
              // Placeholder gradient — replace with actual image at:
              // public/images/academy/courses/{course.slug}.jpg
              // AI prompt: "vibrant educational illustration, {course.title},
              //   modern flat design, dark background, glowing neon accent colors"
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center gap-2
                  bg-gradient-to-br
                  ${course.category === "tuition" ? "from-amber-900/40 to-slate-900" : ""}
                  ${course.category === "coaching" ? "from-rose-900/40 to-slate-900" : ""}
                  ${course.category === "technology" ? "from-sky-900/40 to-slate-900" : ""}
                  ${course.category === "creative" ? "from-violet-900/40 to-slate-900" : ""}
                  ${course.category === "professional" ? "from-emerald-900/40 to-slate-900" : ""}
                  ${!course.category ? "from-cyan-900/40 to-slate-900" : ""}
                `}
              >
                <span className="text-4xl">{cat?.emoji ?? "🎓"}</span>
                <span className="text-xs text-slate-500">{cat?.label}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-1.5">
              {course.language && (
                <span className="rounded-full border border-white/10 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 text-[10px] text-slate-300">
                  {course.language}
                </span>
              )}
              {course.grade_level && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">
                  {course.grade_level}
                </span>
              )}
            </div>

            {/* Price */}
            <span className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold ${
              isFree
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
            }`}>
              {isFree ? "Free" : `₹${course.price}`}
            </span>

            {/* Difficulty */}
            {course.difficulty && (
              <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-400 capitalize">
                {course.difficulty}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4 flex flex-col gap-1.5 flex-1">
            <h3 className="text-sm md:text-base font-semibold text-slate-100 group-hover:text-cyan-200 transition line-clamp-2">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
            )}
            <div className="mt-auto pt-3 flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
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

// ─────────────────────────────────────────────
// Hero banners per category
// ─────────────────────────────────────────────
function CategoryHero({ cat }) {
  if (cat.value === "all") return null;

  const banners = {
    tuition: {
      bg: "from-amber-900/30 via-slate-900 to-slate-950",
      accent: "text-amber-300",
      sub: "border-amber-500/30 bg-amber-500/10 text-amber-200",
      icon: "📚",
      // AI prompt for banner image:
      // "cheerful Indian school children studying together, colorful books and stationery,
      //  warm golden light, flat modern illustration style, dark overlay suitable"
      // Save to: public/images/academy/banners/tuition.jpg
      features: ["CBSE / ICSE / State Board", "Class 1 – 12", "Doubt clearing", "Live + recorded"],
    },
    coaching: {
      bg: "from-rose-900/30 via-slate-900 to-slate-950",
      accent: "text-rose-300",
      sub: "border-rose-500/30 bg-rose-500/10 text-rose-200",
      icon: "🏆",
      // AI prompt:
      // "determined young Indian student studying intensely, exam books JEE NEET,
      //  focused dramatic lighting, modern illustration, dark background"
      // Save to: public/images/academy/banners/coaching.jpg
      features: ["JEE / NEET / UPSC", "Mock tests", "PYQ analysis", "Expert faculty"],
    },
    technology: {
      bg: "from-sky-900/30 via-slate-900 to-slate-950",
      accent: "text-sky-300",
      sub: "border-sky-500/30 bg-sky-500/10 text-sky-200",
      icon: "💻",
      // AI prompt:
      // "futuristic coding workspace glowing monitors dark environment, floating code snippets,
      //  neon blue accent, ultra-modern tech vibe, cinematic illustration"
      // Save to: public/images/academy/banners/technology.jpg
      features: ["Web & App Dev", "Cybersecurity", "Networking", "AI & Cloud"],
    },
    creative: {
      bg: "from-violet-900/30 via-slate-900 to-slate-950",
      accent: "text-violet-300",
      sub: "border-violet-500/30 bg-violet-500/10 text-violet-200",
      icon: "🎨",
      // AI prompt:
      // "vibrant creative workspace with art supplies, music instruments and design tools,
      //  colorful splashes on dark background, playful joyful energy, mixed media illustration"
      // Save to: public/images/academy/banners/creative.jpg
      features: ["Visual Art & Design", "Music & Dance", "Photography", "Digital Art"],
    },
    professional: {
      bg: "from-emerald-900/30 via-slate-900 to-slate-950",
      accent: "text-emerald-300",
      sub: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
      icon: "💼",
      // AI prompt:
      // "confident professional in modern office, business charts digital overlay,
      //  sleek dark aesthetic, green accent lighting, corporate yet approachable illustration"
      // Save to: public/images/academy/banners/professional.jpg
      features: ["Business Strategy", "Digital Marketing", "Leadership", "Communication"],
    },
  };

  const b = banners[cat.value];
  if (!b) return null;

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${b.bg} border border-white/10 p-5 md:p-7 mb-6 relative overflow-hidden`}>
      {/* Decorative blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-current" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <span className="text-3xl">{b.icon}</span>
          <h2 className={`text-xl md:text-2xl font-bold mt-2 ${b.accent}`}>{cat.label}</h2>
          <p className="text-sm text-slate-300/80 mt-1">{cat.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {b.features.map((f) => (
              <span key={f} className={`text-[11px] rounded-full border px-2.5 py-0.5 ${b.sub}`}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function AcademyIndex({ courses }) {
  const [activeTab, setActiveTab] = useState("all");

  const activeCat = CATEGORIES.find((c) => c.value === activeTab) ?? CATEGORIES[0];
  const filtered = activeTab === "all" ? courses : courses.filter((c) => c.category === activeTab);

  return (
    <>
      <Head>
        <title>Academy | Sejal Engitech</title>
        <meta
          name="description"
          content="Sejal Academy — Tuition for Class 1-12, competitive exam coaching, tech courses, creative arts and professional development. Live classes + recorded lectures."
        />
      </Head>

      <PageSection>
        {/* ── Hero ── */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 md:p-8 mb-8 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Hero image placeholder */}
            {/* AI prompt: "diverse group of happy Indian students of all ages learning together,
            kids and adults, books + laptop + art tools visible, vibrant colorful scene,
            dark background with neon glow accents, inspirational educational mood"
            Save to: public/images/academy/hero.jpg (1200×480px)
            To use: wrap hero content in relative and add <Image src="/images/academy/hero.jpg" fill className="object-cover opacity-10" /> */}

            <span className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Sejal Academy
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
              Learn anything.<br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-400">
                Grow every day.
              </span>
            </h1>
            <p className="mt-3 text-slate-200/75 text-sm md:text-base max-w-2xl">
              School tuition for kids · Competitive exam coaching · Tech courses · Creative arts ·
              Professional development. Live sessions, recorded lectures, quizzes, and subtitles in 70+ languages.
            </p>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300">
              {[
                { icon: "📚", text: "Class 1–12 Tuition" },
                { icon: "🏆", text: "JEE / NEET / UPSC" },
                { icon: "💻", text: "Tech & Coding" },
                { icon: "🌐", text: "70+ language subtitles" },
                { icon: "📱", text: "Mobile app (PWA)" },
                { icon: "📝", text: "Quizzes & Certificates" },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5"
                >
                  {icon} {text}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/academy/login"
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition"
              >
                Start learning →
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.08] px-5 py-2.5 text-sm text-slate-300 transition"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide snap-x">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.value;
            const color = COLOR_MAP[cat.color] ?? COLOR_MAP.cyan;
            const count = cat.value === "all" ? courses.length : courses.filter((c) => c.category === cat.value).length;

            return (
              <button
                key={cat.value}
                onClick={() => setActiveTab(cat.value)}
                className={`shrink-0 snap-start rounded-full border px-4 py-2 text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? color.tab
                    : "border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}
              >
                {cat.emoji} {cat.label}
                <span className={`ml-1.5 opacity-60 text-[10px]`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* ── Category hero banner ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + "-hero"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryHero cat={activeCat} />
          </motion.div>
        </AnimatePresence>

        {/* ── Course grid ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center"
          >
            <p className="text-3xl mb-3">{activeCat.emoji ?? "🎓"}</p>
            <p className="text-slate-300 font-medium">
              {activeCat.value === "all" ? "Courses launching soon" : `${activeCat.label} courses coming soon`}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Follow us on Instagram or WhatsApp to be notified first.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-300 hover:text-slate-100 transition"
            >
              Request a course →
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Bottom CTA strip ── */}
        {courses.length > 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
            {/* AI prompt for this section image:
            "teacher mentoring a student on laptop, warm welcoming atmosphere,
             modern minimal illustration, dark background glowing elements"
            Save to: public/images/academy/cta-banner.jpg */}
            <div className="flex-1">
              <p className="text-lg md:text-xl font-semibold text-slate-100">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <p className="text-sm text-slate-400 mt-1">
                We create custom programs for schools, coaching institutes, and corporate teams.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-xl bg-white/[0.07] border border-white/10 hover:bg-white/[0.12] px-5 py-2.5 text-sm text-slate-200 transition"
            >
              Get in touch →
            </Link>
          </div>
        )}
      </PageSection>
    </>
  );
}

export async function getServerSideProps() {
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, description, thumbnail_url, price, currency, language, instructor, duration_hours, total_lessons, category, difficulty, grade_level")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return { props: { courses: courses ?? [] } };
}
