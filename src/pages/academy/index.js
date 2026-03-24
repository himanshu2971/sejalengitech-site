import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useSpring, useTransform } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AcademyHeader from "@/components/academy/AcademyHeader";
import { usePriceDisplay } from "@/lib/formatters";

// ─── Category config ──────────────────────────────────────────────────────────
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

// ─── Hero cycling phrases ────────────────────────────────────────────────────
const HERO_PHRASES = [
  "Grow every day.",
  "Crack JEE 2025.",
  "Score 95% in boards.",
  "Master Web Dev.",
  "Build real skills.",
  "Learn from experts.",
];

// ─── Path selector cards ─────────────────────────────────────────────────────
const PATHS = [
  {
    icon: "📚", title: "School Student", sub: "Class 1–12",
    desc: "CBSE, ICSE & State Board prep with live doubt sessions",
    tab: "tuition",
    gradient: "from-amber-400 to-orange-500",
    ring: "ring-amber-400",
    bg: "hover:bg-amber-50",
    accent: "text-amber-700",
  },
  {
    icon: "🏆", title: "Exam Aspirant", sub: "JEE · NEET · UPSC",
    desc: "Structured coaching, mock tests & previous year analysis",
    tab: "coaching",
    gradient: "from-rose-500 to-red-500",
    ring: "ring-rose-400",
    bg: "hover:bg-rose-50",
    accent: "text-rose-700",
  },
  {
    icon: "🚀", title: "Skill Builder", sub: "Tech · Creative · Pro",
    desc: "Coding, design, marketing — job-ready skills from day one",
    tab: "technology",
    gradient: "from-sky-500 to-indigo-600",
    ring: "ring-sky-400",
    bg: "hover:bg-sky-50",
    accent: "text-sky-700",
  },
];

// ─── Social proof notifications ───────────────────────────────────────────────
const SOCIAL_PROOF = [
  { name: "Riya S.", course: "CBSE Board Prep", city: "Patna" },
  { name: "Arjun K.", course: "JEE Foundation 2025", city: "Muzaffarpur" },
  { name: "Priya M.", course: "Web Development", city: "Delhi" },
  { name: "Dev R.", course: "NEET Crash Course", city: "Ranchi" },
  { name: "Aarav T.", course: "Python Programming", city: "Patna" },
  { name: "Meera J.", course: "Digital Marketing", city: "Bhagalpur" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Anika Sharma", role: "Class 12 · CBSE", course: "Board Prep",
    quote: "Scored 94% in boards after just 3 months. The quizzes and live doubt sessions made all the difference!",
    initials: "AS", gradient: "from-amber-400 to-orange-500",
    stars: 5,
  },
  {
    name: "Rohan Verma", role: "JEE Aspirant 2025", course: "JEE Foundation",
    quote: "The structured mock tests and PYQ analysis helped me fix my weak areas. Physics rank improved by 40 percentile.",
    initials: "RV", gradient: "from-rose-400 to-red-500",
    stars: 5,
  },
  {
    name: "Sneha Patel", role: "Working Professional", course: "Web Dev",
    quote: "Learned full-stack development in evenings. Hindi subtitles + recorded lectures = perfect for working people!",
    initials: "SP", gradient: "from-sky-400 to-indigo-600",
    stars: 5,
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Are the courses free?",
    a: "Many courses are completely free. Paid courses are clearly marked with a price badge. You can enroll in any free course instantly after signing in — no payment details needed.",
  },
  {
    q: "How do live classes work?",
    a: "Live classes happen on Google Meet. You'll see the join link on your dashboard 30 minutes before the session starts. After class, recordings are uploaded within 24 hours so you never miss anything.",
  },
  {
    q: "Is there a mobile app?",
    a: "You can install Alambana EduTech directly from your browser on Android or iOS — no app store required. Look for the 'Add to Home Screen' prompt that appears after a few seconds.",
  },
  {
    q: "What languages are supported?",
    a: "All video lectures support 70+ subtitle languages including Hindi, English, Bengali, Tamil, Telugu, and more. Simply click CC on any video to choose your language.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes! You receive a certificate of completion for every course you finish. Certificates include your name, course title, and completion date.",
  },
];

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const spring = useSpring(0, { stiffness: 60, damping: 20, mass: 0.5 });
  const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) spring.set(to);
  }, [inView]); // eslint-disable-line

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── Course card ──────────────────────────────────────────────────────────────
function CourseCard({ course, index }) {
  const isFree = !course.price || course.price === 0;
  const cat = CAT_MAP[course.category] ?? CAT_MAP.all;
  const isPopular = index < 3;
  const priceDisplay = usePriceDisplay(isFree ? 0 : course.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.35) }}
      className="group"
    >
      <Link href={`/academy/courses/${course.slug}`} className="block h-full">
        <div className={`h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${cat.glow}`}>

          {/* Thumbnail */}
          <div className="relative h-44 shrink-0 overflow-hidden">
            {course.thumbnail_url ? (
              <Image src={course.thumbnail_url} alt={course.title} fill
                className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                <span className="text-6xl opacity-80 drop-shadow-lg">{cat.emoji}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Popular badge */}
            {isPopular && (
              <span className="absolute top-3 right-3 text-[10px] font-black rounded-full bg-amber-400 text-amber-950 px-2.5 py-1 shadow-sm">
                🔥 Popular
              </span>
            )}

            {/* Category badge */}
            <span className={`absolute top-3 left-3 text-[10px] font-bold rounded-full px-2.5 py-1 bg-gradient-to-r ${cat.gradient} text-white shadow-sm`}>
              {cat.emoji} {cat.label}
            </span>

            {/* Price */}
            <span className={`absolute bottom-3 right-3 rounded-full px-3 py-1 text-xs font-bold shadow-md ${
              isFree ? "bg-emerald-500 text-white" : "bg-white text-slate-800"
            }`}>
              {priceDisplay ?? (isFree ? "Free" : `₹${course.price}`)}
            </span>

            {course.grade_level && (
              <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                {course.grade_level}
              </span>
            )}
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-2 flex-1">
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

// ─── Category sub-banner ──────────────────────────────────────────────────────
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

// ─── Social proof bubble ──────────────────────────────────────────────────────
function SocialProofBubble() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % SOCIAL_PROOF.length);
        setVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(id);
  }, [visible]);

  const item = SOCIAL_PROOF[index];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-24 left-4 z-30 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 max-w-[270px] pointer-events-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
            {item.name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800">{item.name} <span className="text-slate-400 font-normal">from {item.city}</span></p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">just enrolled in <span className="text-indigo-600 font-semibold">{item.course}</span></p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-indigo-700 transition-colors"
      >
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0 text-xs"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-slate-600 pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AcademyIndex({ courses = [], banners = [] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [eq, setEq] = useState({ name: "", email: "", subject: "", message: "" });
  const [eqStatus, setEqStatus] = useState("");
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [studentType, setStudentType] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        const res = await fetch("/api/academy/profile", {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
        });
        if (res.ok) {
          const pd = await res.json();
          setStudentType(pd.profile?.student_type ?? null);
        }
      }
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session) setStudentType(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Cycle hero phrases
  useEffect(() => {
    const id = setInterval(() => setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Smart catalog: hide irrelevant categories based on student type
  const hiddenCategories = new Set(
    studentType === "school"       ? ["professional"] :
    studentType === "college"      ? ["tuition"] :
    studentType === "professional" ? ["tuition"] :
    []
  );
  const visibleCategories = CATEGORIES.filter((c) => !hiddenCategories.has(c.value));
  const visibleCourses = courses.filter((c) => !hiddenCategories.has(c.category));

  // If active tab is now hidden, treat as "all"
  const safeTab = hiddenCategories.has(activeTab) ? "all" : activeTab;
  const activeCat = CAT_MAP[safeTab] ?? CAT_MAP.all;

  const filtered = safeTab === "all"
    ? visibleCourses
    : courses.filter((c) => c.category === safeTab);

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

  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>Alambana EduTech — Learn anything, grow every day</title>
        <meta name="description"
          content="Alambana EduTech — Online tuition for CBSE/JEE/NEET, tech & creative courses. Live Google Meet classes, quizzes, recordings. Join students from India, Australia & US." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }) }} />
      </Head>

      <div className="min-h-screen bg-white">
        <SocialProofBubble />
        <AcademyHeader user={user} onSignOut={handleSignOut} authReady={authReady} />

        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-[#0B0720]">
          {/* Color orbs */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-violet-600 blur-[140px] opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-600 blur-[120px] opacity-40 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-rose-500 blur-[100px] opacity-20 pointer-events-none" />

          {/* Hero BG image */}
          <Image
            src="/images/academy/hero.webp"
            alt=""
            fill
            className="object-cover object-center opacity-20 mix-blend-luminosity"
            priority
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:gap-16">

              {/* ── Left: text ── */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                {/* Live badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Live Classes Available</span>
                </div>

                {/* Headline with cycling phrase */}
                <h1 className="text-4xl md:text-[3.5rem] font-black text-white leading-[1.1] tracking-tight mb-5">
                  Learn anything.
                  <br />
                  <span className="inline-block min-h-[1.2em]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={phraseIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="inline-block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent"
                      >
                        {HERO_PHRASES[phraseIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </h1>

                <p className="text-white/70 text-base md:text-lg max-w-lg leading-relaxed mb-8">
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
                  <button
                    onClick={scrollToCourses}
                    className="rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold px-7 py-3 text-sm transition-all backdrop-blur-sm">
                    Browse courses
                  </button>
                </div>
              </motion.div>

              {/* ── Right: floating dashboard preview (desktop) ── */}
              <motion.div
                className="hidden md:flex md:items-center md:justify-center shrink-0 mt-10 md:mt-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Main card */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-5 w-[300px] border border-white/10"
                  >
                    {/* Live badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-red-600">Live Now</span>
                      </div>
                      <span className="text-xs text-slate-400">👥 47 online</span>
                    </div>

                    {/* Course info */}
                    <div className="flex gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center text-2xl shrink-0">🏆</div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-snug">JEE Foundation 2025</p>
                        <p className="text-xs text-slate-500 mt-0.5">Thermodynamics · Ch. 4</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-indigo-600">74% complete</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "74%" }}
                          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Quiz score */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2.5 flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Last quiz: 18/20</p>
                        <p className="text-[11px] text-emerald-600">Laws of Motion — Passed!</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute -top-4 -right-5 bg-amber-400 rounded-2xl px-3 py-2 shadow-lg"
                  >
                    <p className="text-xs font-black text-amber-950">🏆 Top 10%</p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-5 bg-white rounded-2xl px-3 py-2 shadow-lg border border-slate-100"
                  >
                    <p className="text-xs font-black text-slate-800">📜 Certificate ready</p>
                  </motion.div>
                </div>
              </motion.div>

            </div>{/* end flex row */}

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 flex flex-wrap gap-8"
            >
              {[
                { to: 500, suffix: "+", l: "Students enrolled" },
                { to: 20,  suffix: "+",  l: "Expert instructors" },
                { to: 70,  suffix: "+",  l: "Subtitle languages" },
                { to: 100, suffix: "%",  l: "Live classes" },
              ].map(({ to, suffix, l }) => (
                <div key={l} className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white">
                    <Counter to={to} suffix={suffix} />
                  </span>
                  <span className="text-xs text-white/50 leading-tight max-w-[80px]">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── Trust strip ────────────────────────────────────────────────── */}
        <div className="border-y border-slate-100 bg-slate-50 py-4 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-6 px-6 min-w-max mx-auto">
            {[
              { icon: "📋", text: "CBSE / ICSE Official Syllabus" },
              { icon: "📡", text: "Live Google Meet Classes" },
              { icon: "🏆", text: "Expert Certified Instructors" },
              { icon: "🌐", text: "70+ Subtitle Languages" },
              { icon: "📜", text: "Certificate on Completion" },
              { icon: "📱", text: "Installable Mobile App" },
              { icon: "💬", text: "24h Doubt Support" },
              { icon: "🔄", text: "Recorded Lectures — Watch Anytime" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-semibold text-slate-600 whitespace-nowrap">
                <span className="text-base">{icon}</span>
                {text}
                <span className="text-slate-200 ml-4">|</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Path selector ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5 text-center">Find your path</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-2">
              Who are you learning for?
            </h2>
            <p className="text-slate-500 text-sm text-center mb-8">Pick your goal — we&apos;ll show you the right courses.</p>

            <div className="grid sm:grid-cols-3 gap-4">
              {PATHS.map((path) => {
                const isSelected = safeTab === path.tab;
                return (
                  <button
                    key={path.tab}
                    onClick={() => {
                      setActiveTab(path.tab);
                      setTimeout(scrollToCourses, 100);
                    }}
                    className={`rounded-3xl border-2 p-6 text-left transition-all duration-200 group ${
                      isSelected
                        ? `border-transparent shadow-xl ${path.bg.replace("hover:", "")}`
                        : `border-slate-100 bg-white hover:border-slate-200 ${path.bg} hover:shadow-md`
                    }`}
                    style={isSelected ? {
                      background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                      borderColor: "transparent",
                      boxShadow: "0 0 0 2px #7c3aed, 0 20px 40px rgba(124,58,237,0.15)",
                    } : {}}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                      {path.icon}
                    </div>
                    <p className="text-base font-black text-slate-900 mb-0.5">{path.title}</p>
                    <p className="text-xs font-bold text-slate-500 mb-2">{path.sub}</p>
                    <p className="text-sm text-slate-600 leading-snug">{path.desc}</p>

                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-violet-600">
                        <span>Showing {path.tab} courses</span>
                        <span>↓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ─── Main content area ──────────────────────────────────────────── */}
        <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Promotional banners */}
          {banners.length > 0 && (
            <div className="flex gap-4 overflow-x-auto pb-2 mb-10 scrollbar-hide snap-x -mx-1 px-1">
              {banners.map((b) => {
                const s = BANNER_STYLES[b.accent] ?? BANNER_STYLES.cyan;
                return (
                  <div key={b.id}
                    className={`shrink-0 snap-start w-[300px] sm:w-[360px] rounded-3xl bg-gradient-to-br ${s.bg} p-5 flex flex-col gap-2 shadow-lg relative overflow-hidden`}>
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

          {/* Section heading */}
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Browse{" "}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Courses
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">{visibleCourses.length} courses{hiddenCategories.size > 0 ? " for you" : " across 5 categories"}</p>
            </div>
            {safeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="text-xs text-slate-500 hover:text-indigo-600 transition font-semibold shrink-0"
              >
                View all ×
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide snap-x">
            {visibleCategories.map((cat) => {
              const isActive = safeTab === cat.value;
              const count = cat.value === "all" ? visibleCourses.length : courses.filter((c) => c.category === cat.value).length;

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

          {/* Category sub-banner */}
          <AnimatePresence mode="wait">
            <CategoryBanner key={safeTab} cat={activeCat} />
          </AnimatePresence>

          {/* Course grid */}
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
            </div>
          )}
        </div>

        {/* ─── Testimonials ───────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-slate-50 to-white border-t border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Student stories</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Real results from{" "}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  real students
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col gap-4"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <span key={s} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-50">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-black shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role} · {t.course}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Features / Why Us ──────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Why Alambana</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Built different.{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Built for you.
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "📡", title: "Live Google Meet Classes", desc: "Join real-time sessions with your instructor. Ask questions, get instant answers — like a real classroom.", gradient: "from-sky-400 to-indigo-600" },
              { icon: "🔄", title: "Recorded — Always Available", desc: "Missed a class? Every session is recorded and available within 24 hours. Watch at 2× speed.", gradient: "from-violet-400 to-fuchsia-600" },
              { icon: "🌐", title: "70+ Language Subtitles", desc: "Learn in Hindi, English, Bengali, Tamil or any of 70+ languages. Just click CC on any video.", gradient: "from-emerald-400 to-teal-600" },
              { icon: "📝", title: "Quizzes After Every Lesson", desc: "Reinforce what you learn with MCQ quizzes. Track your score, see explanations, retry anytime.", gradient: "from-amber-400 to-orange-500" },
              { icon: "📜", title: "Certificate of Completion", desc: "Earn a shareable certificate for every course you complete. Add it to your resume or LinkedIn.", gradient: "from-rose-400 to-red-500" },
              { icon: "📱", title: "App — No App Store Needed", desc: "Install directly from your browser. Works offline, opens instantly. Available on Android & iOS.", gradient: "from-indigo-400 to-violet-600" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl shrink-0 shadow-md`}>
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{f.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── Custom programs CTA ────────────────────────────────────────── */}
        {courses.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            <div className="rounded-3xl overflow-hidden relative">
              <div className="bg-gradient-to-br from-[#0B0720] via-[#1a0c45] to-[#0f2080] p-8 md:p-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500 rounded-full blur-[80px] opacity-30 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500 rounded-full blur-[60px] opacity-20 pointer-events-none" />

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
          </div>
        )}

        {/* ─── FAQ ────────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 text-center">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 text-center mb-8">
              Questions? Answered.
            </h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
              {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </motion.div>
        </div>

        {/* ─── Ask a question form ────────────────────────────────────────── */}
        <div id="ask" className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm p-7 md:p-10">
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
        </div>

        {/* ─── Footer ─────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
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

export async function getStaticProps() {
  const [{ data: courses }, { data: banners }] = await Promise.all([
    supabaseAdmin
      .from("courses")
      .select("id, title, slug, description, thumbnail_url, price, currency, language, instructor, duration_hours, total_lessons, category, difficulty, grade_level")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("banners")
      .select("id, title, subtitle, cta_text, cta_url, badge, accent")
      .eq("active", true)
      .order("order", { ascending: true }),
  ]);

  return {
    props: { courses: courses ?? [], banners: banners ?? [] },
    revalidate: 60,
  };
}
