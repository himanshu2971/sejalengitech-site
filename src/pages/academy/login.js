import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AcademyLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  // If already logged in, go to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/academy/dashboard");
    });

    // Handle magic link redirect (Supabase puts token in URL hash)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
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
      options: {
        emailRedirectTo: `${window.location.origin}/academy/login`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <>
      <Head>
        <title>Sign In | Sejal Academy</title>
      </Head>

      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url(/images/bg/aurora.png)" }}
          />
          <div className="absolute inset-0 bg-slate-950/50" />
        </div>

        <div className="w-full max-w-sm">
          {/* Logo / brand */}
          <div className="mb-8 text-center">
            <Link href="/academy" className="inline-flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-slate-100">Sejal Academy</span>
              <span className="text-xs text-slate-400">by Sejal Engitech</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
            {status === "sent" ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-3">📬</p>
                <h2 className="text-lg font-semibold text-slate-100">Check your email</h2>
                <p className="mt-2 text-sm text-slate-400">
                  We sent a magic link to <span className="text-cyan-200">{email}</span>.
                  Click it to sign in — no password needed.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs text-slate-400 hover:text-cyan-200 transition"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-lg font-semibold text-slate-100 mb-1">Sign in</h1>
                <p className="text-sm text-slate-400 mb-6">
                  Enter your email — we&apos;ll send you a magic link. No password needed.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs text-slate-300 mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-slate-950 transition"
                  >
                    {status === "loading" ? "Sending…" : "Send magic link"}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link href="/academy" className="text-xs text-slate-500 hover:text-cyan-200 transition">
              ← Back to Academy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Use no layout — standalone auth page
AcademyLogin.noLayout = true;
