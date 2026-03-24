import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function TeacherLogin() {
  const router = useRouter();
  const [tab, setTab] = useState("signin"); // "signin" | "signup"

  // Sign In state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siStatus, setSiStatus] = useState("idle"); // idle | loading | pending | error
  const [siError, setSiError] = useState("");

  // Sign Up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suStatus, setSuStatus] = useState("idle"); // idle | loading | done | error
  const [suError, setSuError] = useState("");

  async function handleSignIn(e) {
    e.preventDefault();
    setSiStatus("loading");
    setSiError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: siEmail.trim().toLowerCase(),
      password: siPassword,
    });

    if (error) {
      setSiStatus("error");
      setSiError(error.message);
      return;
    }

    // Check teacher role
    const res = await fetch("/api/academy/teacher-auth", {
      headers: { Authorization: `Bearer ${data.session.access_token}` },
    });

    if (res.ok) {
      router.replace("/academy/teacher/dashboard");
    } else {
      // Signed in but not yet a teacher — keep them signed in, show pending message
      setSiStatus("pending");
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setSuStatus("loading");
    setSuError("");

    const { data, error } = await supabase.auth.signUp({
      email: suEmail.trim().toLowerCase(),
      password: suPassword,
      options: {
        data: { display_name: suName.trim() },
      },
    });

    if (error) {
      setSuStatus("error");
      setSuError(error.message);
      return;
    }

    // Mark as pending_teacher (sets role = 'pending_teacher' in profiles)
    if (data.session?.access_token) {
      await fetch("/api/academy/teacher/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ display_name: suName.trim() }),
      }).catch(() => {});
    }

    setSuStatus("done");
  }

  return (
    <>
      <Head><title>Teacher Portal | Alambana EduTech</title></Head>

      <div className="min-h-screen bg-[#0B0720] flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-500 blur-[130px] opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-600 blur-[110px] opacity-25 translate-y-1/2 -translate-x-1/4 pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Brand */}
          <Link href="/academy" className="flex flex-col items-center gap-3 mb-8 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 group-hover:shadow-amber-500/60 transition-shadow">
              <span className="text-white font-black text-2xl">👨‍🏫</span>
            </div>
            <div className="text-center">
              <p className="font-black text-white text-xl tracking-tight">Teacher Portal</p>
              <p className="text-white/40 text-xs mt-0.5">Alambana EduTech</p>
            </div>
          </Link>

          <div className="bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 p-7 shadow-2xl shadow-black/40">

            {/* Tabs */}
            <div className="flex rounded-2xl bg-white/[0.06] p-1 mb-6 gap-1">
              {["signin", "signup"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 rounded-xl py-2 text-sm font-bold transition-all"
                  style={
                    tab === t
                      ? { background: "linear-gradient(to right, #f59e0b, #f97316)", color: "#fff" }
                      : { color: "rgba(255,255,255,0.45)" }
                  }
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* ── SIGN IN ── */}
            {tab === "signin" && (
              <>
                {siStatus === "pending" ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-3xl">
                      ⏳
                    </div>
                    <h2 className="text-lg font-black text-white">Access Pending</h2>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed">
                      You&apos;re signed in but your teacher access hasn&apos;t been activated yet.
                      Your admin needs to grant you teacher access — check back soon.
                    </p>
                    <button
                      onClick={() => { setSiStatus("idle"); setSiError(""); setSiEmail(""); setSiPassword(""); }}
                      className="mt-5 text-xs text-white/40 hover:text-amber-300 transition"
                    >
                      Try a different account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">Email</label>
                      <input
                        type="email"
                        required
                        value={siEmail}
                        onChange={(e) => setSiEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        required
                        value={siPassword}
                        onChange={(e) => setSiPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
                      />
                    </div>

                    {siStatus === "error" && (
                      <p className="text-xs text-red-300 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        {siError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={siStatus === "loading"}
                      className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 px-4 py-3 text-sm font-black text-white transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5"
                    >
                      {siStatus === "loading" ? "Signing in…" : "Sign In →"}
                    </button>

                    <p className="text-center text-xs text-white/25">
                      Don&apos;t have an account?{" "}
                      <button type="button" onClick={() => setTab("signup")} className="text-amber-400 hover:text-amber-300 transition">
                        Sign up
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}

            {/* ── SIGN UP ── */}
            {tab === "signup" && (
              <>
                {suStatus === "done" ? (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4 text-3xl">
                      ✅
                    </div>
                    <h2 className="text-lg font-black text-white">Account Created!</h2>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed">
                      Your account is ready. Your admin needs to grant you teacher access before you can use the portal.
                      Once they do, come back and sign in.
                    </p>
                    <button
                      onClick={() => { setSuStatus("idle"); setTab("signin"); setSuName(""); setSuEmail(""); setSuPassword(""); }}
                      className="mt-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-black text-white transition-all hover:-translate-y-0.5"
                    >
                      Go to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">Your Name</label>
                      <input
                        type="text"
                        required
                        value={suName}
                        onChange={(e) => setSuName(e.target.value)}
                        placeholder="Priya Sharma"
                        className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">Email</label>
                      <input
                        type="email"
                        required
                        value={suEmail}
                        onChange={(e) => setSuEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-1.5 uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
                      />
                    </div>

                    {suStatus === "error" && (
                      <p className="text-xs text-red-300 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                        {suError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={suStatus === "loading"}
                      className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 px-4 py-3 text-sm font-black text-white transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5"
                    >
                      {suStatus === "loading" ? "Creating account…" : "Create Account →"}
                    </button>

                    <p className="text-center text-xs text-white/25">
                      Already have an account?{" "}
                      <button type="button" onClick={() => setTab("signin")} className="text-amber-400 hover:text-amber-300 transition">
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="mt-5 text-center">
            <Link href="/academy" className="text-xs text-white/30 hover:text-amber-300 transition">
              ← Back to courses
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}

TeacherLogin.noLayout = true;
