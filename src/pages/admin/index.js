import Head from "next/head";
import Link from "next/link";
import { isAdminAuthed, getAdminEmail } from "@/lib/adminAuth";

export default function AdminHub({ adminEmail }) {
  const initial = adminEmail?.[0]?.toUpperCase() ?? "A";

  return (
    <>
      <Head><title>Admin Hub | Alambana + Sejal</title></Head>
      <div className="min-h-screen bg-[#080910] flex flex-col items-center justify-center px-4 py-12">

        {/* Background glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-violet-900/20 blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">{initial}</div>
              <span className="text-xs text-slate-400 font-medium">{adminEmail}</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Hub</h1>
            <p className="text-slate-500 text-sm">Choose which area you want to manage</p>
          </div>

          {/* Two zone cards */}
          <div className="grid sm:grid-cols-2 gap-5">

            {/* Sejal Engitech */}
            <Link href="/admin/projects"
              className="group rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-orange-500/[0.04] hover:from-amber-500/[0.12] hover:to-orange-500/[0.08] hover:border-amber-500/40 transition-all p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
                🏢
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight">Sejal Engitech</p>
                <p className="text-amber-400/70 text-xs font-semibold uppercase tracking-wider mt-0.5">Main Website</p>
              </div>
              <ul className="space-y-1.5">
                {["🗂 Projects portfolio", "✍ Blog posts", "📬 Contact enquiries"].map((item) => (
                  <li key={item} className="text-xs text-slate-400 flex items-center gap-2">{item}</li>
                ))}
              </ul>
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition">
                Open <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>

            {/* Alambana EduTech */}
            <Link href="/academy/admin"
              className="group rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.07] to-indigo-500/[0.04] hover:from-violet-500/[0.12] hover:to-indigo-500/[0.08] hover:border-violet-500/40 transition-all p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow">
                🎓
              </div>
              <div>
                <p className="font-black text-white text-lg leading-tight">Alambana EduTech</p>
                <p className="text-violet-400/70 text-xs font-semibold uppercase tracking-wider mt-0.5">Learning Platform</p>
              </div>
              <ul className="space-y-1.5">
                {["🎓 Courses & lessons", "👥 Students & enrollments", "💰 Finances & analytics", "📢 Announcements & more"].map((item) => (
                  <li key={item} className="text-xs text-slate-400 flex items-center gap-2">{item}</li>
                ))}
              </ul>
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-bold text-violet-400 group-hover:text-violet-300 transition">
                Open <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          </div>

          {/* Sign out */}
          <div className="text-center mt-8">
            <form action="/api/academy/admin-auth" method="POST" onSubmit={async (e) => {
              e.preventDefault();
              await fetch("/api/academy/admin-auth", { method: "DELETE" });
              window.location.href = "/academy/admin/login";
            }}>
              <button type="submit" className="text-xs text-slate-600 hover:text-slate-400 transition">Sign out</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

AdminHub.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  return { props: { adminEmail: getAdminEmail(req) } };
}
