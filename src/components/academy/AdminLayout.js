import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import usePWAInstall from "@/lib/usePWAInstall";

const NAV = [
  { href: "/academy/admin",              icon: "📊", label: "Dashboard" },
  { href: "/academy/admin/courses",      icon: "🎓", label: "Courses" },
  { href: "/academy/admin/sessions",     icon: "📡", label: "Live Sessions" },
  { href: "/academy/admin/students",     icon: "👥", label: "Students" },
  { href: "/academy/admin/teachers",     icon: "👨‍🏫", label: "Teachers" },
  { href: "/academy/admin/finances",     icon: "💰", label: "Finances" },
  { href: "/academy/admin/analytics",    icon: "📈", label: "Analytics" },
  { href: "/academy/admin/enquiries",    icon: "📝", label: "Enquiries" },
  { href: "/academy/admin/announcements",icon: "📢", label: "Announcements" },
  { href: "/academy/admin/banners",      icon: "🎯", label: "Banners / Ads" },
  { href: "/academy/admin/import",       icon: "📥", label: "Bulk Import" },
];

export default function AdminLayout({ children, title = "Admin" }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const { canInstall, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    fetch("/api/academy/admin-auth")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.email) setAdminEmail(d.email); });
  }, []);

  // Global keyboard shortcut: / focuses first search/text input on the page
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        const input = document.querySelector("input[type='text'], input[type='search'], input:not([type])");
        if (input) { input.focus(); input.select(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  async function handleLogout() {
    await fetch("/api/academy/admin-auth", { method: "DELETE" });
    router.push("/academy/admin/login");
  }

  const isActive = (href) =>
    href === "/academy/admin"
      ? router.pathname === "/academy/admin"
      : router.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/academy/admin" className="block">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Alambana EduTech</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Admin Panel</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition mx-2 rounded-xl mb-0.5 ${
              isActive(n.href)
                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 font-medium"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 flex flex-col gap-2">

        {/* Logged-in admin */}
        {adminEmail && (
          <div className="flex items-center gap-2 px-1 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
              {adminEmail[0].toUpperCase()}
            </div>
            <span className="text-[10px] text-slate-400 truncate">{adminEmail}</span>
          </div>
        )}

        {/* PWA Install button */}
        {!isInstalled && canInstall && (
          <button
            onClick={install}
            className="flex items-center gap-2 text-xs text-violet-300 hover:text-violet-100 transition text-left bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-2"
          >
            <span>📲</span> Install Admin App
          </button>
        )}
        {isInstalled && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 px-1">
            <span>✓</span> App installed
          </div>
        )}

        <p className="text-[10px] text-slate-600 px-1">Press <kbd className="font-mono bg-white/10 rounded px-1">/</kbd> to search</p>

        <Link
          href="/academy"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-200 transition"
        >
          <span>↗</span> View Academy
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-300 transition text-left"
        >
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>{title} | Alambana Admin</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-52 lg:w-56 shrink-0 border-r border-white/10 bg-slate-900/40 sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-10 w-56 bg-slate-900 border-r border-white/10 flex flex-col">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile top bar */}
          <header className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-slate-100 transition text-lg"
            >
              ☰
            </button>
            <span className="text-sm font-semibold">{title}</span>
            <div className="w-6" />
          </header>

          {/* Page content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
