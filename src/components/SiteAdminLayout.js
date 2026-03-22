import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import usePWAInstall from "@/lib/usePWAInstall";

const NAV = [
  { href: "/admin",            icon: "🏠", label: "Hub" },
  { href: "/admin/projects",   icon: "🗂", label: "Projects" },
  { href: "/admin/blog",       icon: "✍", label: "Blog Posts" },
  { href: "/admin/enquiries",  icon: "📬", label: "Enquiries" },
];

export default function SiteAdminLayout({ children, title = "Sejal Admin" }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const { canInstall, isInstalled, install } = usePWAInstall();

  useEffect(() => {
    fetch("/api/academy/admin-auth")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.email) setAdminEmail(d.email); });
  }, []);

  async function handleLogout() {
    await fetch("/api/academy/admin-auth", { method: "DELETE" });
    router.push("/academy/admin/login");
  }

  const isActive = (href) =>
    href === "/admin" ? router.pathname === "/admin" : router.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/admin" className="block">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Sejal Engitech</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Main Site Admin</p>
        </Link>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition mx-2 rounded-xl mb-0.5 ${
              isActive(n.href)
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium"
                : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
            }`}>
            <span className="text-base">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 flex flex-col gap-2">
        {adminEmail && (
          <div className="flex items-center gap-2 px-1 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
              {adminEmail[0].toUpperCase()}
            </div>
            <span className="text-[10px] text-slate-400 truncate">{adminEmail}</span>
          </div>
        )}

        {!isInstalled && canInstall && (
          <button onClick={install}
            className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-100 transition text-left bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <span>📲</span> Install Admin App
          </button>
        )}
        {isInstalled && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 px-1"><span>✓</span> App installed</div>
        )}

        <Link href="/academy/admin" className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-200 transition">
          <span>↗</span> Alambana Academy
        </Link>
        <Link href="/" className="flex items-center gap-2 text-xs text-slate-500 hover:text-amber-200 transition">
          <span>↗</span> View Site
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-300 transition text-left">
          <span>⎋</span> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>{title} | Sejal Engitech</title></Head>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">
        <aside className="hidden md:flex flex-col w-52 lg:w-56 shrink-0 border-r border-white/10 bg-slate-900/40 sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-10 w-56 bg-slate-900 border-r border-white/10 flex flex-col">
              <SidebarContent />
            </aside>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden sticky top-0 z-40 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-100 transition text-lg">☰</button>
            <span className="text-sm font-semibold">{title}</span>
            <div className="w-6" />
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
