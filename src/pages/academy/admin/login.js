import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { isAdminAuthed } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/academy/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/admin");
    } else {
      setError(data.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Admin Login | Alambana EduTech</title></Head>

      <div className="min-h-screen bg-[#0B0C14] flex items-center justify-center px-4">

        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-sm">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-xl shadow-violet-500/30 mb-4">
              <span className="text-white font-black text-2xl">A</span>
            </div>
            <p className="text-white font-black text-lg tracking-tight">Alambana EduTech</p>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Admin Portal</p>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 pr-12 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-lg transition"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400 flex items-center gap-2">
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 px-4 py-3 text-sm font-bold text-white transition shadow-lg shadow-violet-500/30 mt-1"
            >
              {loading ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            Access restricted to authorised admins only.
          </p>
        </div>
      </div>
    </>
  );
}

AdminLogin.noLayout = true;

export async function getServerSideProps({ req }) {
  if (isAdminAuthed(req)) return { redirect: { destination: "/academy/admin", permanent: false } };
  return { props: {} };
}
