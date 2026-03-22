import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AcademyHeader from "@/components/academy/AcademyHeader";

// ─── Category config ─────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    value: "all", label: "All", emoji: "✨",
    gradient: "from-violet-600 to-indigo-600",
    glow: "shadow-indigo-300/40",
    hero: { from: "from-violet-50", accent: "text-violet-700", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  },
  {
    value: "tuition", label: "Tuition", emoji: "📚",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-300/40",
    tagline: "Class 1–12 · CBSE · ICSE · State Board",
    features: ["All Boards", "Class 1–12", "Doubt Clearing", "Live Classes"],
    hero: { from: "from-amber-50", accent: "text-amber-700", badge: "bg-amber-100 text-amber-700 border-amber-200" },
  },
  {
    value: "coaching", label: "Coaching", emoji: "🏆",
    gradient: "from-rose-500 to-red-500",
    glow: "shadow-rose-300/40",
    tagline: "JEE · NEET · UPSC · CAT — India's top exams",
    features: ["JEE / NEET", "UPSC / CAT", "Mock Tests", "PYQ Analysis"],
    hero: { from: "from-rose-50", accent: "text-rose-700", badge: "bg-rose-100 text-rose-700 border-rose-200" },
  },
  {
    value: "technology", label: "Technology", emoji: "💻",
    gradient: "from-sky-500 to-indigo-600",
    glow: "shadow-sky-300/40",
    tagline: "Coding, web dev, cybersecurity & networking",
    features: ["Web & App Dev", "Cybersecurity", "Networking", "AI & Cloud"],
    hero: { from: "from-sky-50", accent: "text-sky-700", badge: "bg-sky-100 text-sky-700 border-sky-200" },
  },
  {
    value: "creative", label: "Creative", emoji: "🎨",
    gradient: "from-violet-500 to-fuchsia-600",
    glow: "shadow-violet-300/40",
    tagline: "Art, music, dance, design & photography",
    features: ["Visual Art", "Music & Dance", "Photography", "Digital Design"],
    hero: { from: "from-violet-50", accent: "text-violet-700", badge: "bg-violet-100 text-violet-700 border-violet-200" },
  },
  {
    value: "professional", label: "Professional", emoji: "💼",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-300/40",
    tagline: "Business, marketing, communication & leadership",
    features: ["Business Strategy", "Digital Marketing", "Leadership", "Communication"],
    hero: { from: "from-emerald-50", accent: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

const BANNER_STYLES = {
  cyan:    { bg: "from-indigo-500 to-violet-600",   text: "text-indigo-50",  btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
  violet:  { bg: "from-violet-500 to-fuchsia-600",  text: "text-violet-50",  btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
  emerald: { bg: "from-emerald-500 to-teal-600",    text: "text-emerald-50", btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
  amber:   { bg: "from-amber-500 to-orange-500",    text: "text-amber-50",   btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
  rose:    { bg: "from-rose-500 to-red-500",         text: "text-rose-50",    btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
  sky:     { bg: "from-sky-500 to-indigo-500",       text: "text-sky-50",     btn: "bg-white/20 hover:bg-white/30 text-white border border-white/30" },
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

// ─── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course }) {
  const isFree = !course.price || course.price === 0;
  const cat = CAT_MAP[course.category] ?? CAT_MAP.all;

  return (
    <motion.div variants={fadeUp} className="group">
      <Link href={`/academy/courses/${course.slug}`} className="block h-full">
        <div className={`h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md ${cat.glow} hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}>

          {/* Thumbnail */}
          <div className="relative h-44 shrink-0 overflow-hidden">
            {course.thumbnail_url ? (
              <Image src={course.thumbnail_url} alt={course.title} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              // Save course thumbnail to: public/images/academy/courses/[slug].webp (600×360px)
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                <span className="text-6xl opacity-80 drop-shadow-lg">{cat.emoji}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Category badge */}
            <span className={`absolute top-3 left-3 text-[10px] font-bold rounded-full px-2.5 py-1 bg-gradient-to-r ${cat.gradient} text-white shadow-sm`}>
              {cat.emoji} {cat.label}
            </span>

            {/* Price */}
            <span className={`absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
              isFree ? "bg-emerald-500 text-white" : "bg-white text-slate-800"
            }`}>
              {isFree ? "Free" : `₹${course.price}`}
            </span>

            {course.grade_level && (
              <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                {course.grade_level}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            {/* Accent line */}
            <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${cat.gradient} mb-1`} />

            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2 leading-snug">
              {course.title}
            </h3>
            {course.description && (
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
            )}

            <div className="mt-auto pt-3 border-t border-slate-50 flex flex-wrap gap-3 text-[11px] text-slate-400">
              {course.instructor && <span className="font-semibold text-slate-600">👤 {course.instructor}</span>}
              {course.duration_hours && <span>⏱ {course.duration_hours}h</span>}
              {course.total_lessons > 0 && <span>📚 {course.total_lessons} lessons</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Category sub-banner ─────────────────────────────────────────────────────
function CategoryBanner({ cat }) {
  if (!cat || cat.value === "all" || !cat.features) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl bg-gradient-to-br ${cat.hero.from} to-white border border-current/10 p-5 mb-7`}
    >
      <div className="flex items-start gap-4 flex-wrap">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${cat.gradient} shadow-md shrink-0`}>
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className={`text-base font-black ${cat.hero.accent}`}>{cat.label}</h2>
          <p className="text-slate-600 text-sm mt-0.5">{cat.tagline}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {cat.features.map((f) => (
              <span key={f} className={`text-xs font-semibold rounded-full border px-2.5 py-0.5 ${cat.hero.badge}`}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AcademyIndex({ courses = [], banners = [] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [eq, setEq] = useState({ name: "", email: "", subject: "", message: "" });
  const [eqStatus, setEqStatus] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const activeCat = CAT_MAP[activeTab] ?? CAT_MAP.all;
  const filtered = activeTab === "all" ? courses : courses.filter((c) => c.category === activeTab);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/academy");
  }

  async function handleEnquiry(e) {
    e.preventDefault();
    setEqStatus("sending");
    const res = await fetch("/api/academy/enquiries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eq),
    });
    setEqStatus(res.ok ? "sent" : "error");
  }

  return (
    <>
      <Head>
        <title>Alambana EduTech — Learn anything, grow every day</title>
        <meta name="description"
          content="Alambana EduTech — Tuition, competitive coaching, tech, creative & professional courses. Live sessions, quizzes, 70+ subtitle languages." />
      </Head>

      <div className="min-h-screen bg-white">
        <AcademyHeader user={user} onSignOut={handleSignOut} />

        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0B0720]">
          {/* Animated color orbs */}
          <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-violet-600 blur-[140px] opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-600 blur-[120px] opacity-40 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-rose-500 blur-[100px] opacity-25 pointer-events-none" />
          <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-500 blur-[90px] opacity-20 pointer-events-none" />

            {/* Hero background image — full bleed */}
          <Image
            src="/images/academy/hero.webp"
            alt=""
            fill
            className="object-cover object-center opacity-20 mix-blend-luminosity"
            priority
          />

          {/* Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Live Classes Available</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                Learn anything.<br />
                <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
                  Grow every day.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg max-w-xl leading-relaxed mb-8">
                School tuition · Competitive coaching · Tech · Creative arts · Professional skills.
                Live sessions, recorded lectures, quizzes, 70+ subtitle languages.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-10">
                {[
                  { e: "📚", t: "Class 1–12" },
                  { e: "🏆", t: "JEE / NEET" },
                  { e: "💻", t: "Tech & AI" },
                  { e: "🌐", t: "70+ languages" },
                  { e: "🎓", t: "Certificates" },
                  { e: "📱", t: "Mobile app" },
                ].map(({ e, t }) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    {e} {t}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/academy/login"
                  className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-bold px-7 py-3 text-sm transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
                  Start learning free →
                </Link>
                <a href="#ask"
                  className="rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-7 py-3 text-sm transition-all backdrop-blur-sm">
                  Ask a question
                </a>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 flex flex-wrap gap-6">
              {[
                { n: "500+", l: "Students enrolled" },
                { n: "20+",  l: "Expert instructors" },
                { n: "70+",  l: "Subtitle languages" },
                { n: "Live", l: "Google Meet classes" },
              ].map(({ n, l }) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white">{n}</span>
                  <span className="text-xs text-white/50 leading-tight max-w-[80px]">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Main content area ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* ── Promotional banners (from admin) ── */}
          {banners.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 mb-10 scrollbar-hide snap-x -mx-1 px-1">
              {banners.map((b) => {
                const s = BANNER_STYLES[b.accent] ?? BANNER_STYLES.cyan;
                return (
                  <div key={b.id}
                    className={`shrink-0 snap-start w-[300px] sm:w-[360px] rounded-3xl bg-gradient-to-br ${s.bg} p-5 flex flex-col gap-2 shadow-lg relative overflow-hidden`}>
                    {/* Inner glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    {b.badge && (
                      <span className="self-start text-[10px] font-black rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-white uppercase tracking-wide">
                        {b.badge}
                      </span>
                    )}
                    <p className={`text-sm font-black leading-snug ${s.text}`}>{b.title}</p>
                    {b.subtitle && <p className="text-xs text-white/70">{b.subtitle}</p>}
                    <Link href={b.cta_url || "/academy"}
                      className={`mt-2 self-start rounded-full px-4 py-1.5 text-xs font-bold transition-all ${s.btn}`}>
                      {b.cta_text || "Learn More"} →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Section heading ── */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Browse{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">{courses.length} courses across 5 categories</p>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide snap-x">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.value;
              const count = cat.value === "all" ? courses.length : courses.filter((c) => c.category === cat.value).length;

              return (
                <button key={cat.value} onClick={() => setActiveTab(cat.value)}
                  className={`shrink-0 snap-start rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-md ${cat.glow}`
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}>
                  {cat.emoji} {cat.label}
                  <span className={`ml-1.5 text-[10px] font-semibold ${isActive ? "text-white/70" : "text-slate-400"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Category sub-banner ── */}
          <AnimatePresence mode="wait">
            <CategoryBanner key={activeTab} cat={activeCat} />
          </AnimatePresence>

          {/* ── Course grid ── */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-100 bg-white p-14 text-center shadow-sm">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${activeCat.gradient} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                {activeCat.emoji}
              </div>
              <p className="text-slate-900 font-black text-lg">Coming soon</p>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                {activeCat.value === "all" ? "Courses are being prepared." : `${activeCat.label} courses are launching soon.`}
              </p>
              <a href="#ask"
                className="inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-6 py-2.5 text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                Request a course →
              </a>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((course) => <CourseCard key={course.id} course={course} />)}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Custom programs CTA ── */}
          {courses.length > 0 && (
            <div className="mt-16 rounded-3xl overflow-hidden relative">
              <div className="bg-gradient-to-br from-[#0B0720] via-[#1a0c45] to-[#0f2080] p-8 md:p-10">
                {/* Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500 rounded-full blur-[80px] opacity-30 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500 rounded-full blur-[60px] opacity-20 pointer-events-none" />

                {/* Save CTA image to: public/images/academy/cta-banner.webp (1200×400px) */}

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-2">Custom Programs</p>
                    <p className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                      Can&apos;t find what<br className="hidden md:block" />
                      you&apos;re looking for?
                    </p>
                    <p className="text-white/60 text-sm">
                      We build custom programs for schools, coaching institutes & corporate teams.
                    </p>
                  </div>
                  <a href="#ask"
                    className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-bold px-7 py-3.5 text-sm shadow-xl shadow-violet-500/30 transition-all hover:-translate-y-0.5">
                    Get in touch →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── Ask a question form ── */}
          <div id="ask" className="mt-16 rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm p-7 md:p-10">
            <div className="max-w-xl">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Support</p>
              <h2 className="text-2xl font-black text-slate-900 mb-1">Have a question?</h2>
              <p className="text-slate-500 text-sm mb-7">Ask about any course, schedule, or batch — we reply within 24 hours.</p>

              {eqStatus === "sent" ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-5 flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">Message received!</p>
                    <p className="text-emerald-600 text-xs mt-0.5">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="grid sm:grid-cols-2 gap-3">
                  {[
                    { key: "name", placeholder: "Your name", required: true, type: "text" },
                    { key: "email", placeholder: "Email address", required: true, type: "email" },
                  ].map(({ key, placeholder, required, type }) => (
                    <input key={key} required={required} type={type} placeholder={placeholder}
                      value={eq[key]}
                      onChange={(e) => setEq((f) => ({ ...f, [key]: e.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  ))}
                  <input placeholder="Subject (e.g. JEE batch timings)"
                    value={eq.subject}
                    onChange={(e) => setEq((f) => ({ ...f, subject: e.target.value }))}
                    className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  <textarea required rows={3} placeholder="Your question or message…"
                    value={eq.message}
                    onChange={(e) => setEq((f) => ({ ...f, message: e.target.value }))}
                    className="sm:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                  <div className="sm:col-span-2 flex items-center gap-4">
                    <button type="submit" disabled={eqStatus === "sending"}
                      className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-60 px-6 py-3 text-sm font-bold text-white transition-all shadow-md shadow-indigo-200/60">
                      {eqStatus === "sending" ? "Sending…" : "Send message →"}
                    </button>
                    {eqStatus === "error" && (
                      <p className="text-xs text-red-500 font-medium">Something went wrong. Please try again.</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-black text-[8px]">A</span>
              </div>
              <span>© {new Date().getFullYear()} Alambana EduTech · A Sejal Engitech initiative</span>
            </div>
            <div className="flex gap-4">
              <Link href="/privacyPolicy" className="hover:text-slate-700 transition">Privacy</Link>
              <Link href="/termsOfService" className="hover:text-slate-700 transition">Terms</Link>
              <Link href="/contact" className="hover:text-slate-700 transition">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AcademyIndex.noLayout = true;

export async function getServerSideProps() {
  const [{ data: courses }, { data: banners }] = await Promise.all([
    supabase
      .from("courses")
      .select("id, title, slug, description, thumbnail_url, price, currency, language, instructor, duration_hours, total_lessons, category, difficulty, grade_level")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("banners")
      .select("id, title, subtitle, cta_text, cta_url, badge, accent")
      .eq("active", true)
      .order("order", { ascending: true }),
  ]);

  return { props: { courses: courses ?? [], banners: banners ?? [] } };
}
