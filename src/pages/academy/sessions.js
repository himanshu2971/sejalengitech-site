import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AcademyHeader from "@/components/academy/AcademyHeader";

// Format ISO date in the user's local timezone (client-side only)
function useLocalTime(isoString) {
  const [formatted, setFormatted] = useState(null);
  useEffect(() => {
    if (!isoString) return;
    setFormatted(
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(isoString))
    );
  }, [isoString]);
  return formatted;
}

function SessionCard({ session, isUpcoming }) {
  const localTime = useLocalTime(session.scheduled_at);
  const [joining, setJoining] = useState(false);

  const now = Date.now();
  const start = new Date(session.scheduled_at).getTime();
  const minsUntil = (start - now) / 60000;
  const isLive = minsUntil <= 30 && minsUntil > -session.duration_mins;
  const hasEnded = minsUntil <= -session.duration_mins;

  return (
    <div className={`bg-white rounded-3xl border shadow-md overflow-hidden transition hover:shadow-lg hover:-translate-y-0.5 duration-200 ${
      isLive ? "border-emerald-200 shadow-emerald-100" : "border-slate-100"
    }`}>
      {/* Coloured top strip */}
      <div className={`h-1.5 ${isLive ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-violet-500 to-indigo-600"}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {isLive && (
                <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE NOW
                </span>
              )}
              {!isLive && !hasEnded && (
                <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2.5 py-0.5">
                  Upcoming
                </span>
              )}
              {hasEnded && session.is_recorded && (
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-full px-2.5 py-0.5">
                  ▶ Recording available
                </span>
              )}
              {hasEnded && !session.is_recorded && (
                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-0.5">
                  Ended
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">{session.title}</h3>
            {session.courses?.title && (
              <p className="text-xs text-indigo-600 font-semibold mt-0.5">{session.courses.title}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-gradient-to-br from-violet-50 to-indigo-100">
            {isLive ? "🟢" : hasEnded ? "📹" : "📡"}
          </div>
        </div>

        {session.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{session.description}</p>
        )}

        <div className="flex items-center gap-2 mb-4 flex-wrap text-xs text-slate-500">
          <span className="flex items-center gap-1">
            🕒 {localTime ?? new Date(session.scheduled_at).toLocaleString()}
          </span>
          {session.duration_mins && (
            <span className="flex items-center gap-1">⏱ {session.duration_mins} min</span>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Join button — shown if live or starting within 30 min */}
          {(isLive || (minsUntil <= 30 && minsUntil > 0)) && session.meet_url && (
            <a
              href={session.meet_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => setJoining(true)}
              className="flex-1 text-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold py-2.5 px-4 transition shadow-md shadow-emerald-300/40"
            >
              {joining ? "Opening…" : isLive ? "🎙 Join Now" : "🔔 Join (starting soon)"}
            </a>
          )}

          {/* Recording button */}
          {session.is_recorded && session.recording_url && (
            <a
              href={session.recording_url}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold py-2.5 px-4 transition shadow-md shadow-sky-300/40"
            >
              ▶ Watch Recording
            </a>
          )}

          {/* Course link */}
          {session.courses?.slug && (
            <Link
              href={`/academy/courses/${session.courses.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 px-4 transition"
            >
              View Course →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SessionsPage({ upcoming, past }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUser(data.session.user);
      setAuthReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/academy");
  }

  return (
    <>
      <Head>
        <title>Live Classes & Recordings | Alambana EduTech</title>
        <meta name="description" content="Join live Google Meet classes and watch recordings from Alambana EduTech. Interactive sessions with expert instructors." />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <AcademyHeader user={user} onSignOut={handleSignOut} authReady={authReady} />

        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0B0720] to-[#1a0c45] py-14 px-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-30 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                {upcoming.length > 0 ? `${upcoming.length} session${upcoming.length > 1 ? "s" : ""} scheduled` : "Live sessions platform"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Live Classes &amp; Recordings</h1>
            <p className="text-white/60 text-sm max-w-lg mx-auto">
              Interactive sessions on Google Meet with expert instructors. All sessions are recorded — never miss a class.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Upcoming sessions */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-black text-slate-900">Upcoming Sessions</h2>
              {upcoming.length > 0 && (
                <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-0.5 border border-violet-200">
                  {upcoming.length}
                </span>
              )}
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">📡</div>
                <p className="text-slate-900 font-black text-base mb-1">No upcoming sessions</p>
                <p className="text-slate-500 text-sm mb-5">New live classes are scheduled regularly. Check back soon or ask us about upcoming batches.</p>
                <a href="/academy#ask"
                  className="inline-flex rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-5 py-2.5 text-sm shadow-md hover:shadow-lg transition hover:-translate-y-0.5">
                  Ask about upcoming classes →
                </a>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map((s) => <SessionCard key={s.id} session={s} isUpcoming />)}
              </div>
            )}
          </section>

          {/* Recordings */}
          {past.filter((s) => s.is_recorded && s.recording_url).length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-black text-slate-900">Recorded Sessions</h2>
                <span className="rounded-full bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-0.5 border border-sky-200">
                  {past.filter((s) => s.is_recorded && s.recording_url).length}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.filter((s) => s.is_recorded && s.recording_url).map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            </section>
          )}

          {/* Past sessions without recordings */}
          {past.filter((s) => !s.is_recorded || !s.recording_url).length > 0 && (
            <section>
              <h2 className="text-base font-bold text-slate-500 mb-4">Past Sessions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-60">
                {past.filter((s) => !s.is_recorded || !s.recording_url).map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#0B0720] to-[#1a0c45] p-8 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500 rounded-full blur-[80px] opacity-30 pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex-1">
                  <p className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-1">Want personalised sessions?</p>
                  <p className="text-xl font-black text-white">Request a custom batch</p>
                  <p className="text-white/60 text-sm mt-1">Group classes, one-on-one tutoring, or corporate training — we do it all.</p>
                </div>
                <a href="/academy#ask"
                  className="shrink-0 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-bold px-6 py-3 text-sm shadow-lg transition hover:-translate-y-0.5">
                  Get in touch →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

SessionsPage.noLayout = true;

export async function getServerSideProps() {
  const now = new Date().toISOString();

  const [{ data: upcomingData }, { data: pastData }] = await Promise.all([
    supabaseAdmin
      .from("sessions")
      .select("id, title, description, meet_url, scheduled_at, duration_mins, is_recorded, recording_url, courses(title, slug)")
      .gte("scheduled_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()) // include sessions that started up to 2h ago (might still be live)
      .order("scheduled_at", { ascending: true }),
    supabaseAdmin
      .from("sessions")
      .select("id, title, description, meet_url, scheduled_at, duration_mins, is_recorded, recording_url, courses(title, slug)")
      .lt("scheduled_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .order("scheduled_at", { ascending: false })
      .limit(20),
  ]);

  return {
    props: {
      upcoming: upcomingData ?? [],
      past: pastData ?? [],
    },
  };
}
