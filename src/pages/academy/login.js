import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function AcademyLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/academy/dashboard");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) router.replace("/academy/dashboard");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/academy/login` },
    });
    if (error) { setStatus("error"); setErrorMsg(error.message); }
    else setStatus("sent");
  }

  return (
    <>
      <Head><title>Sign In | Alambana EduTech</title></Head>

      <div className="min-h-screen bg-[#0B0720] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated background orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600 blur-[130px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600 blur-[110px] opacity-35 translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-rose-500 blur-[90px] opacity-20 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="w-full max-w-sm relative z-10">

          {/* Brand */}
          <Link href="/academy" className="flex flex-col items-center gap-3 mb-8 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 group-hover:shadow-violet-500/60 transition-shadow">
              <span className="text-white font-black text-2xl">A</span>
            </div>
            <div className="text-center">
              <p className="font-black text-white text-xl tracking-tight">Alambana EduTech</p>
              <p className="text-white/40 text-xs mt-0.5">A Sejal Engitech initiative</p>
            </div>
          </Link>

          {/* Card */}
          <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-7 shadow-2xl shadow-black/40">
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-emerald-500/30">
                  📬
                </div>
                <h2 className="text-xl font-black text-white">Check your email</h2>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Magic link sent to{" "}
                  <span className="text-violet-300 font-bold">{email}</span>.
                  Click it to sign in instantly.
                </p>
                <button onClick={() => setStatus("idle")}
                  className="mt-6 text-xs text-white/40 hover:text-violet-300 transition">
                  Try a different email
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-black text-white mb-1">Welcome back 👋</h1>
                <p className="text-sm text-white/50 mb-6">
                  Enter your email — magic link, no password needed.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">
                      Email address
                    </label>
                    <input id="email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400/60 focus:bg-white/15 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-300 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                      {errorMsg}
                    </p>
                  )}

                  <button type="submit" disabled={status === "loading"}
                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-black text-white transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5">
                    {status === "loading" ? "Sending…" : "Send magic link →"}
                  </button>
                </form>

                <p className="mt-5 text-[11px] text-white/30 text-center leading-relaxed">
                  By signing in you agree to our{" "}
                  <Link href="/termsOfService" className="text-violet-400 hover:text-violet-300 transition">Terms</Link>
                  {" "}&{" "}
                  <Link href="/privacyPolicy" className="text-violet-400 hover:text-violet-300 transition">Privacy Policy</Link>
                </p>
              </>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link href="/academy" className="text-xs text-white/30 hover:text-violet-300 transition">
              ← Back to courses
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

AcademyLogin.noLayout = true;
