import Link from "next/link";
import { useRouter } from "next/router";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default function AdminDashboard({ stats }) {
  const statCards = [
    { label: "Total Courses",    value: stats.courses,     icon: "🎓", href: "/academy/admin/courses" },
    { label: "Published",        value: stats.published,   icon: "✅", href: "/academy/admin/courses" },
    { label: "Total Students",   value: stats.students,    icon: "👥", href: "/academy/admin/students" },
    { label: "Enrollments",      value: stats.enrollments, icon: "📋", href: "/academy/admin/finances" },
    { label: "Revenue (₹)",      value: stats.revenue.toLocaleString(), icon: "💰", href: "/academy/admin/finances" },
    { label: "Open Enquiries",   value: stats.openEnquiries, icon: "📝", href: "/academy/admin/enquiries" },
    { label: "Live Sessions",    value: stats.sessions,    icon: "📡", href: "/academy/admin/sessions" },
    { label: "Quiz Attempts",    value: stats.quizAttempts, icon: "🏆", href: "/academy/admin/analytics" },
  ];

  const quickLinks = [
    { label: "Manage Courses",   desc: "Add, edit, publish courses",       href: "/academy/admin/courses",       icon: "🎓" },
    { label: "Live Sessions",    desc: "Schedule & manage Google Meet",     href: "/academy/admin/sessions",      icon: "📡" },
    { label: "Students",         desc: "View enrolled students",            href: "/academy/admin/students",      icon: "👥" },
    { label: "Finances",         desc: "Revenue, refunds, purchases",       href: "/academy/admin/finances",      icon: "💰" },
    { label: "Analytics",        desc: "Quiz stats, completion rates",      href: "/academy/admin/analytics",     icon: "📈" },
    { label: "Enquiries",        desc: "Student support & questions",       href: "/academy/admin/enquiries",     icon: "📝", badge: stats.openEnquiries > 0 ? stats.openEnquiries : null },
    { label: "Announcements",    desc: "Broadcast messages to students",    href: "/academy/admin/announcements", icon: "📢" },
    { label: "Banners & Ads",    desc: "Promotional banners on catalog",    href: "/academy/admin/banners",       icon: "🎯" },
    { label: "View Academy",     desc: "Student-facing site",               href: "/academy",                    icon: "↗️" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Welcome back. Here&apos;s your academy at a glance.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statCards.map((c) => (
            <Link key={c.label} href={c.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:border-cyan-400/30 transition cursor-pointer">
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-2xl font-bold text-slate-100">{c.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map((a) => (
            <Link key={a.label} href={a.href}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-400/40 transition flex flex-col gap-1 relative">
              {a.badge && (
                <span className="absolute top-3 right-3 rounded-full bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                  {a.badge}
                </span>
              )}
              <span className="text-xl">{a.icon}</span>
              <p className="text-sm font-medium text-slate-100">{a.label}</p>
              <p className="text-xs text-slate-400">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

AdminDashboard.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const [
    { count: courses },
    { count: published },
    { count: enrollments },
    { count: sessions },
    { count: quizAttempts },
    { data: purchases },
    { data: enquiries },
  ] = await Promise.all([
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabaseAdmin.from("purchases").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("sessions").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("quiz_attempts").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("purchases").select("amount, status"),
    supabaseAdmin.from("enquiries").select("status"),
  ]);

  const { count: students } = await supabaseAdmin.schema("auth").from("users").select("*", { count: "exact", head: true });

  const revenue = (purchases ?? []).filter((p) => p.status === "completed").reduce((a, p) => a + (p.amount ?? 0), 0);
  const openEnquiries = (enquiries ?? []).filter((e) => e.status === "open").length;

  return {
    props: {
      stats: {
        courses: courses ?? 0,
        published: published ?? 0,
        students: students ?? 0,
        enrollments: enrollments ?? 0,
        sessions: sessions ?? 0,
        quizAttempts: quizAttempts ?? 0,
        revenue,
        openEnquiries,
      },
    },
  };
}
