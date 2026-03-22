import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AcademyHeader from "@/components/academy/AcademyHeader";

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

function isStartingSoon(scheduledAt) {
  const diff = new Date(scheduledAt) - new Date();
  return diff > 0 && diff <= 30 * 60 * 1000;
}
function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

const CAT_COLORS = {
  tuition:      { g: "from-amber-500 to-orange-500",   text: "#f59e0b" },
  coaching:     { g: "from-rose-500 to-red-500",       text: "#f43f5e" },
  technology:   { g: "from-sky-500 to-indigo-600",     text: "#0ea5e9" },
  creative:     { g: "from-violet-500 to-fuchsia-600", text: "#8b5cf6" },
  professional: { g: "from-emerald-500 to-teal-600",   text: "#10b981" },
};

const ANN_STYLE = {
  success: { bar: "#10b981", bg: "#f0fdf4", border: "#a7f3d0", icon: "✅", titleC: "#064e3b", msgC: "#065f46" },
  warning: { bar: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "⚠️", titleC: "#78350f", msgC: "#92400e" },
  info:    { bar: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", icon: "📢", titleC: "#1e1b4b", msgC: "#3730a3" },
};

/* Image with gradient fallback — shows gradient if image is missing */
function ImgWithFallback({ src, alt, gradient, className, children }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`relative w-full h-full overflow-hidden ${gradient}`}>
      {!err && (
        <Image src={src} alt={alt} fill
          className={`object-cover ${className ?? ""}`}
          onError={() => setErr(true)} />
      )}
      {children}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace("/academy/login"); return; }
      setUser(data.session.user);

      const [{ data: purchaseData }, { data: allSessions }, annRes] = await Promise.all([
        supabase.from("purchases")
          .select("*, courses(id,title,slug,description,thumbnail_url,total_lessons,instructor,category)")
          .eq("user_id", data.session.user.id)
          .order("created_at", { ascending: false }),
        supabase.from("sessions")
          .select("*, courses(title,slug)")
          .order("scheduled_at", { ascending: true }),
        fetch("/api/academy/announcements"),
      ]);

      setPurchases(purchaseData ?? []);
      const now = new Date().toISOString();
      setUpcomingSessions((allSessions ?? []).filter(s => s.scheduled_at >= now));
      setRecordings((allSessions ?? []).filter(s => s.is_recorded && s.recording_url));
      if (annRes.ok) setAnnouncements(await annRes.json());
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/academy");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse shadow-2xl shadow-violet-300/50" />
          <p className="text-slate-500 text-sm font-semibold tracking-wide">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const firstName = user?.email?.split("@")[0]?.replace(/[._]/g, " ") ?? "Student";

  return (
    <>
      <Head><title>My Dashboard | Alambana EduTech</title></Head>

      <div className="min-h-screen bg-[#f5f6fa]">
        <AcademyHeader user={user} onSignOut={handleSignOut} />

        {/* ══ HERO ══ */}
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-violet-800 via-indigo-800 to-blue-800"
          style={{ height: "clamp(220px, 30vw, 320px)" }}>
          {/* Real photo behind gradient */}
          <Image src="/images/academy/dashboard-hero.webp" alt="" fill
            className="object-cover object-center opacity-40" priority />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          {/* Right-side fade to hide image edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/70 via-indigo-900/50 to-indigo-800/30" />

          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Greeting */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <p className="text-violet-300 text-[11px] font-bold uppercase tracking-[0.25em] mb-2">My Learning Hub</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Hey, <span className="text-amber-300 capitalize">{firstName}!</span> 👋
                </h1>
                <p className="text-white/55 text-sm mt-1.5">Ready to learn something awesome today?</p>
              </motion.div>

              {/* Stat pills */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                className="flex items-center gap-3 flex-wrap">
                {[
                  { n: purchases.length,       l: "Enrolled",   emoji: "🎓", c: "rgba(251,191,36,0.25)",  bc: "rgba(251,191,36,0.5)",  tc: "#fbbf24" },
                  { n: upcomingSessions.length, l: "Live Soon",  emoji: "📹", c: "rgba(52,211,153,0.25)",  bc: "rgba(52,211,153,0.5)",  tc: "#34d399" },
                  { n: recordings.length,      l: "Recordings", emoji: "🎬", c: "rgba(167,139,250,0.25)", bc: "rgba(167,139,250,0.5)", tc: "#a78bfa" },
                ].map(({ n, l, emoji, c, bc, tc }) => (
                  <div key={l} className="flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-md"
                    style={{ background: c, border: `1px solid ${bc}` }}>
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <p className="text-xl font-black leading-none" style={{ color: tc }}>{n}</p>
                      <p className="text-white/65 text-[11px] font-semibold mt-0.5">{l}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ══ CONTENT ══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-10 space-y-12">

          {/* ── Announcements ── */}
          {announcements.length > 0 && (
            <section className="space-y-3">
              {announcements.map((a) => {
                const s = ANN_STYLE[a.type] ?? ANN_STYLE.info;
                return (
                  <div key={a.id} className="rounded-2xl flex overflow-hidden shadow-sm"
                    style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                    <div className="w-1.5 shrink-0" style={{ background: s.bar }} />
                    <div className="flex items-start gap-3 px-4 py-3.5">
                      <span className="text-xl shrink-0">{s.icon}</span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: s.titleC }}>{a.title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: s.msgC }}>{a.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* ── Upcoming Live Sessions ── */}
          {upcomingSessions.length > 0 && (
            <section>
              <Heading emoji="🔴" title="Upcoming Live Sessions"
                sub={`${upcomingSessions.length} session${upcomingSessions.length > 1 ? "s" : ""} scheduled`} />
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingSessions.map((session) => {
                  const soon = isStartingSoon(session.scheduled_at);
                  return (
                    <motion.div key={session.id} variants={fadeUp}
                      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 ${soon ? "ring-2 ring-red-400 ring-offset-2" : ""}`}>
                      {/* Image strip with gradient fallback */}
                      <div className="relative h-32 w-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700">
                        <Image src="/images/academy/session-live.webp" alt="Live class"
                          fill className="object-cover" onError={() => {}} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Badge */}
                        {soon ? (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full animate-pulse shadow-lg">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />Starting Soon
                          </span>
                        ) : (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
                            📹 Live Class
                          </span>
                        )}
                        <p className="absolute bottom-2.5 left-3 right-3 text-white font-bold text-sm leading-tight line-clamp-1 drop-shadow">
                          {session.title}
                        </p>
                      </div>
                      {/* Body */}
                      <div className="p-4 space-y-3">
                        {session.courses?.title && (
                          <p className="text-xs font-bold text-indigo-600 truncate">{session.courses.title}</p>
                        )}
                        <div className="text-xs text-slate-500 space-y-0.5">
                          <p className="font-semibold text-slate-700">{formatDate(session.scheduled_at)}</p>
                          {session.duration_mins && <p>{session.duration_mins} min session</p>}
                          {session.description && <p className="line-clamp-2 text-slate-400">{session.description}</p>}
                        </div>
                        {session.meet_url ? (
                          <a href={session.meet_url} target="_blank" rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}>
                            📹 Join Live Class ↗
                          </a>
                        ) : (
                          <div className="w-full text-center rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs text-slate-400">
                            Meet link coming soon
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          )}

          {/* ── Recordings ── */}
          {recordings.length > 0 && (
            <section>
              <Heading emoji="🎬" title="Class Recordings" sub="Watch anytime, anywhere" />
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recordings.map((session) => (
                  <motion.div key={session.id} variants={fadeUp}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group">
                    <div className="relative h-36 w-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700">
                      <Image src="/images/academy/session-recording.webp" alt="Recording"
                        fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => {}} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                          <div className="w-0 h-0 border-t-[9px] border-t-transparent border-l-[16px] border-l-white border-b-[9px] border-b-transparent ml-1.5" />
                        </div>
                      </div>
                      <p className="absolute bottom-2.5 left-3 right-3 text-white font-bold text-sm line-clamp-1 drop-shadow">{session.title}</p>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 truncate flex-1">
                        {session.courses?.title ?? formatDate(session.scheduled_at)}
                      </p>
                      <a href={session.recording_url} target="_blank" rel="noreferrer"
                        className="shrink-0 rounded-xl px-4 py-2 text-xs font-bold text-white hover:-translate-y-0.5 transition-all"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}>
                        ▶ Watch
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}

          {/* ── My Courses ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <Heading emoji="🎓" title="My Courses" sub={`${purchases.length} enrolled`} noBottom />
              <Link href="/academy" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Browse all →
              </Link>
            </div>

            {purchases.length === 0 ? (
              /* Empty state with image */
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md">
                <div className="relative h-52 w-full bg-gradient-to-br from-violet-100 via-indigo-50 to-blue-100">
                  <Image src="/images/academy/empty-courses.webp" alt="Start learning" fill
                    className="object-cover" onError={() => {}} />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                </div>
                <div className="px-6 pb-10 -mt-8 relative text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-violet-300/40">📚</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No courses enrolled yet</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                    Pick from tuition, coaching, tech, creative, and professional skill tracks.
                  </p>
                  <Link href="/academy"
                    className="inline-flex items-center gap-2 rounded-2xl text-white font-bold px-8 py-3.5 text-sm transition-all hover:-translate-y-0.5 shadow-xl"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}>
                    Browse Courses →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {purchases.map((p) => {
                  const course = p.courses;
                  const cat   = CAT_COLORS[course?.category] ?? CAT_COLORS.professional;
                  return (
                    <motion.div key={p.id} variants={fadeUp}>
                      <Link href={`/academy/learn/${course.slug}`}
                        className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
                        {/* Thumbnail — uses real image or gradient fallback */}
                        <div className={`relative h-44 w-full bg-gradient-to-br ${cat.g}`}>
                          {course.thumbnail_url ? (
                            <Image src={course.thumbnail_url} alt={course.title} fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform">🎓</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {/* Continue pill */}
                          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-black px-3 py-1 shadow-md transition-all group-hover:bg-indigo-600 group-hover:text-white"
                            style={{ color: "#4f46e5" }}>
                            Continue →
                          </span>
                        </div>
                        {/* Info */}
                        <div className="p-4 flex flex-col gap-1 flex-1">
                          <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-2 leading-snug">
                            {course.title}
                          </h3>
                          {course.instructor && (
                            <p className="text-xs text-slate-500">By {course.instructor}</p>
                          )}
                          <div className="mt-auto pt-3 border-t border-slate-50 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                            <span>📚 {course.total_lessons ?? 0} lessons</span>
                            <span className="ml-auto">
                              {new Date(p.created_at).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>

          {/* ── CTA Banner ── */}
          <section className="relative rounded-3xl overflow-hidden shadow-xl">
            <div className="relative w-full overflow-hidden bg-gradient-to-r from-violet-800 via-indigo-800 to-blue-800"
              style={{ height: "clamp(180px, 22vw, 240px)" }}>
              <Image src="/images/academy/dashboard-cta.webp" alt="Explore courses" fill
                className="object-cover object-center opacity-50" onError={() => {}} />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-900/85 via-indigo-900/70 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center px-6 md:px-10">
              <div>
                <p className="text-violet-300 text-[11px] font-bold uppercase tracking-widest mb-2">Grow Further</p>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                  Discover 100+ more<br className="hidden md:block" /> courses waiting for you
                </h3>
                <Link href="/academy"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white font-black px-6 py-3 text-sm hover:bg-indigo-50 transition-all hover:-translate-y-0.5 shadow-lg"
                  style={{ color: "#4f46e5" }}>
                  Browse Catalog →
                </Link>
              </div>
            </div>
          </section>

          {/* ── Quick Actions ── */}
          <section>
            <Heading emoji="⚡" title="Quick Actions" sub="Everything you need" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { emoji: "💬", label: "Ask a Question", sub: "Instructor support",   href: "/academy#ask", grad: "from-sky-400 to-blue-600" },
                { emoji: "📖", label: "Browse Courses", sub: "All 5 categories",     href: "/academy",     grad: "from-violet-500 to-indigo-600" },
                { emoji: "🏆", label: "Leaderboard",    sub: "Top learners",         href: "/academy",     grad: "from-amber-400 to-orange-500" },
                { emoji: "📞", label: "Contact Us",     sub: "Get help",             href: "/contact",     grad: "from-emerald-400 to-teal-600" },
              ].map(({ emoji, label, sub, href, grad }) => (
                <Link key={label} href={href}
                  className="group flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {emoji}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
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

function Heading({ emoji, title, sub, noBottom }) {
  return (
    <div className={`flex items-center gap-3 ${noBottom ? "" : "mb-6"}`}>
      <div className="w-10 h-10 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-xl shrink-0">{emoji}</div>
      <div>
        <h2 className="text-lg font-black text-slate-900 leading-tight">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

Dashboard.noLayout = true;
