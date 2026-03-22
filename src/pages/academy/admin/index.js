import Link from "next/link";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ACTION_LABELS = {
  replied_enquiry: "Replied to enquiry",
  created_course: "Created course",
  deleted_course: "Deleted course",
  created_banner: "Created banner",
  deleted_banner: "Deleted banner",
  created_announcement: "Created announcement",
  deleted_announcement: "Deleted announcement",
  created_session: "Created session",
  deleted_session: "Deleted session",
};

export default function AdminDashboard({ stats, issues, recentLogs }) {
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

        {/* Content Health */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Content Health</h2>
            {issues.length > 0 && (
              <span className="rounded-full bg-red-500 text-white text-[10px] font-bold px-2 py-0.5">
                {issues.length} issue{issues.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {issues.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 flex items-center gap-3">
              <span className="text-lg">✅</span>
              <p className="text-sm text-emerald-300 font-medium">All clear — no content issues detected.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {issues.map((issue, i) => (
                <div
                  key={i}
                  className={
                    issue.severity === "error"
                      ? "rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 flex items-start gap-3"
                      : "rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 flex items-start gap-3"
                  }
                >
                  <span className="text-base mt-0.5">{issue.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={issue.severity === "error" ? "text-sm font-semibold text-red-300" : "text-sm font-semibold text-amber-300"}>
                      {issue.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{issue.desc}</p>
                  </div>
                  <Link
                    href={issue.href}
                    className="shrink-0 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition whitespace-nowrap mt-0.5"
                  >
                    Fix →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Recent Activity */}
        {recentLogs && recentLogs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</h2>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] divide-y divide-white/[0.06]">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">
                      {ACTION_LABELS[log.action] ?? log.action}
                      {log.details && (
                        <span className="text-slate-500 font-normal"> — {log.details}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {log.admin_email ?? "admin"}
                      {log.timestamp && (
                        <> · {new Date(log.timestamp).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

AdminDashboard.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  const { MongoClient } = await import("mongodb");
  let recentLogs = [];
  try {
    const mc = await MongoClient.connect(process.env.MONGODB_URI);
    recentLogs = await mc.db(process.env.MONGODB_DB).collection("admin_logs").find({}).sort({ timestamp: -1 }).limit(10).toArray();
    recentLogs = JSON.parse(JSON.stringify(recentLogs));
    await mc.close();
  } catch { /* non-critical */ }

  const [
    { count: courses },
    { count: published },
    { count: enrollments },
    { count: sessions },
    { count: quizAttempts },
    { data: purchases },
    { data: enquiries },
    { data: quizRows },
    { data: lessonRows },
    { data: moduleRows },
    { data: courseRows },
  ] = await Promise.all([
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    supabaseAdmin.from("purchases").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("sessions").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("quiz_attempts").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("purchases").select("amount, status"),
    supabaseAdmin.from("enquiries").select("status"),
    supabaseAdmin.from("quizzes").select("id, lesson_id, title, questions(id)"),
    supabaseAdmin.from("lessons").select("id, title, module_id"),
    supabaseAdmin.from("modules").select("id, course_id"),
    supabaseAdmin.from("courses").select("id, title"),
  ]);

  const { count: students } = await supabaseAdmin.schema("auth").from("users").select("*", { count: "exact", head: true });

  const revenue = (purchases ?? []).filter((p) => p.status === "completed").reduce((a, p) => a + (p.amount ?? 0), 0);
  const openEnquiries = (enquiries ?? []).filter((e) => e.status === "open").length;

  // ── Content Health Checks ──────────────────────────────────────────────────
  const issues = [];

  const lessonMap  = Object.fromEntries((lessonRows  ?? []).map((l) => [l.id, l]));
  const moduleMap  = Object.fromEntries((moduleRows  ?? []).map((m) => [m.id, m]));
  const courseMap  = Object.fromEntries((courseRows  ?? []).map((c) => [c.id, c]));

  function getCourseId(lessonId) {
    const lesson = lessonMap[lessonId];
    if (!lesson) return null;
    const mod = moduleMap[lesson.module_id];
    return mod?.course_id ?? null;
  }

  // 1. Duplicate quizzes per lesson
  const quizzesByLesson = {};
  for (const q of (quizRows ?? [])) {
    if (!quizzesByLesson[q.lesson_id]) quizzesByLesson[q.lesson_id] = [];
    quizzesByLesson[q.lesson_id].push(q);
  }
  for (const [lessonId, qs] of Object.entries(quizzesByLesson)) {
    if (qs.length > 1) {
      const lesson = lessonMap[lessonId];
      const courseId = getCourseId(lessonId);
      const course = courseId ? courseMap[courseId] : null;
      issues.push({
        severity: "error",
        icon: "🔴",
        title: `Duplicate quiz on "${lesson?.title ?? "Unknown lesson"}"`,
        desc: `${qs.length} quizzes found for this lesson — only one is allowed. Students will see nothing. Delete the extra in the course editor.`,
        href: courseId ? `/academy/admin/courses/${courseId}` : "/academy/admin/courses",
        courseName: course?.title ?? null,
      });
    }
  }

  // 2. Empty quizzes (quiz exists but has 0 questions)
  for (const q of (quizRows ?? [])) {
    if ((q.questions?.length ?? 0) === 0) {
      const lesson = lessonMap[q.lesson_id];
      const courseId = getCourseId(q.lesson_id);
      const course = courseId ? courseMap[courseId] : null;
      issues.push({
        severity: "warning",
        icon: "🟡",
        title: `Empty quiz on "${lesson?.title ?? "Unknown lesson"}"`,
        desc: `Quiz "${q.title}" has no questions. Add questions or delete the quiz.`,
        href: courseId ? `/academy/admin/courses/${courseId}` : "/academy/admin/courses",
        courseName: course?.title ?? null,
      });
    }
  }

  // 3. Published courses with no lessons
  const { data: pubCourses } = await supabaseAdmin
    .from("courses")
    .select("id, title, modules(lessons(id))")
    .eq("published", true);

  for (const c of (pubCourses ?? [])) {
    const lessonCount = (c.modules ?? []).reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
    if (lessonCount === 0) {
      issues.push({
        severity: "error",
        icon: "🔴",
        title: `Published with no content: "${c.title}"`,
        desc: "This course is live but has no lessons. Students can enroll but have nothing to learn.",
        href: `/academy/admin/courses/${c.id}`,
        courseName: c.title,
      });
    }
  }

  return {
    props: {
      stats: {
        courses:      courses      ?? 0,
        published:    published    ?? 0,
        students:     students     ?? 0,
        enrollments:  enrollments  ?? 0,
        sessions:     sessions     ?? 0,
        quizAttempts: quizAttempts ?? 0,
        revenue,
        openEnquiries,
      },
      issues,
      recentLogs,
    },
  };
}
