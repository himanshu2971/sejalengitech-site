import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default function AdminDashboard({ stats }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/academy/admin-auth", { method: "DELETE" });
    router.push("/academy/admin/login");
  }

  const cards = [
    { label: "Total Courses", value: stats.courses, icon: "🎓", href: "/academy/admin/courses" },
    { label: "Published", value: stats.published, icon: "✅", href: "/academy/admin/courses" },
    { label: "Total Students", value: stats.students, icon: "👥", href: null },
    { label: "Enrollments", value: stats.enrollments, icon: "📋", href: null },
  ];

  return (
    <>
      <Head><title>Admin Dashboard | Sejal Academy</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Top bar */}
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/academy" className="text-xs text-slate-400 hover:text-cyan-200 transition">← Academy</Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-300 transition">Sign out</button>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {cards.map((c) => (
              <div key={c.label} className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 ${c.href ? "cursor-pointer hover:border-cyan-400/40 transition" : ""}`}
                onClick={() => c.href && router.push(c.href)}>
                <p className="text-2xl mb-1">{c.icon}</p>
                <p className="text-2xl font-bold text-slate-100">{c.value}</p>
                <p className="text-xs text-slate-400">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <h2 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Manage Courses", desc: "Add, edit, publish courses", href: "/academy/admin/courses", icon: "🎓" },
              { label: "Live Sessions", desc: "Schedule & manage sessions", href: "/academy/admin/sessions", icon: "📡" },
              { label: "View Academy", desc: "See student-facing site", href: "/academy", icon: "👁️" },
            ].map((a) => (
              <Link key={a.label} href={a.href}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-400/40 transition flex flex-col gap-1">
                <span className="text-xl">{a.icon}</span>
                <p className="text-sm font-medium text-slate-100">{a.label}</p>
                <p className="text-xs text-slate-400">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

AdminDashboard.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const [{ count: courses }, { count: published }, { count: students }, { count: enrollments }] = await Promise.all([
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabaseAdmin.from("users").select("*", { count: "exact", head: true }).schema("auth"),
    supabaseAdmin.from("purchases").select("*", { count: "exact", head: true }),
  ]);

  return { props: { stats: { courses: courses ?? 0, published: published ?? 0, students: students ?? 0, enrollments: enrollments ?? 0 } } };
}
