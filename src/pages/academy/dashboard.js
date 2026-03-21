import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import PageSection from "@/components/PageSection";
import { supabase } from "@/lib/supabase";

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
};
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/academy/login");
        return;
      }

      setUser(data.session.user);

      // Fetch enrolled courses
      const { data: purchaseData } = await supabase
        .from("purchases")
        .select("*, courses(id, title, slug, description, thumbnail_url, total_lessons, instructor)")
        .eq("user_id", data.session.user.id)
        .order("purchased_at", { ascending: false });

      setPurchases(purchaseData ?? []);

      // Fetch upcoming live sessions for enrolled courses
      if (purchaseData?.length > 0) {
        const courseIds = purchaseData.map((p) => p.course_id);
        const { data: sessionData } = await supabase
          .from("live_sessions")
          .select("*, courses(title, slug)")
          .in("course_id", courseIds)
          .gte("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(5);

        setLiveSessions(sessionData ?? []);
      }

      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/academy");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Dashboard | Sejal Academy</title>
      </Head>

      <PageSection>
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/academy"
              className="text-xs text-slate-400 hover:text-cyan-200 transition"
            >
              ← Browse courses
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:border-red-400/40 hover:text-red-300 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Upcoming live sessions */}
        {liveSessions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              Upcoming Live Sessions
            </h2>
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-3">
              {liveSessions.map((session) => (
                <motion.div
                  key={session.id}
                  variants={item}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-100">{session.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.courses?.title} •{" "}
                      {new Date(session.scheduled_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <a
                    href={session.meet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 transition"
                  >
                    Join Live ↗
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Enrolled courses */}
        <div>
          <h2 className="text-base font-semibold mb-4">My Courses</h2>

          {purchases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center"
            >
              <p className="text-3xl mb-3">📚</p>
              <p className="text-slate-300 font-medium">No courses yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-5">
                Browse and enroll in a course to get started.
              </p>
              <Link
                href="/academy"
                className="inline-flex rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20 transition"
              >
                Browse Courses
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {purchases.map((p) => {
                const course = p.courses;
                return (
                  <motion.div key={p.id} variants={item}>
                    <Link
                      href={`/academy/learn/${course.slug}`}
                      className="group block rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 hover:border-cyan-400/40 transition"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl border border-white/10 bg-slate-800/60 flex items-center justify-center text-xl shrink-0">
                          🎓
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-200 transition truncate">
                            {course.title}
                          </h3>
                          {course.instructor && (
                            <p className="text-xs text-slate-400 mt-0.5">{course.instructor}</p>
                          )}
                          <p className="text-xs text-slate-500 mt-1">
                            {course.total_lessons} lessons
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Enrolled {new Date(p.purchased_at).toLocaleDateString("en-IN")}
                        </span>
                        <span className="text-xs text-cyan-200 font-medium">
                          Continue →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </PageSection>
    </>
  );
}
