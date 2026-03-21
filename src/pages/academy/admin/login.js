import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { isAdminAuthed } from "@/lib/adminAuth";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/academy/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/academy/admin");
    } else {
      setError("Wrong password.");
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Admin Login | Sejal Academy</title></Head>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-xs">
          <p className="text-center text-slate-400 text-xs mb-6 uppercase tracking-widest">Academy Admin</p>
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 flex flex-col gap-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-slate-950 transition"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
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
