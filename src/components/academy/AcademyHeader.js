import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/academy",           label: "Courses",       icon: "📚" },
  { href: "/academy/dashboard", label: "My Learning",   icon: "🎓", authOnly: true },
];

export default function AcademyHeader({ user, onSignOut, authReady = false }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href) =>
    href === "/academy"
      ? router.pathname === "/academy"
      : router.pathname.startsWith(href);

  const initials = user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-[68px] flex items-center gap-8">

        {/* ── Brand ── */}
        <Link href="/academy" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-400/40 group-hover:shadow-violet-400/60 transition-shadow">
            <span className="text-white font-black text-lg leading-none">A</span>
          </div>
          <div className="leading-none">
            <p className="text-[15px] font-black text-slate-900 tracking-tight">Alambana</p>
            <p className="text-[10px] font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-[0.15em]">EduTech</p>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden sm:flex items-center gap-0.5 flex-1">
          {NAV.filter(n => !n.authOnly || (authReady && user)).map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} href={n.href}
                className="flex items-center gap-1.5 text-[13px] px-4 py-2 rounded-xl font-bold transition-all duration-200"
                style={active
                  ? { background: "linear-gradient(to right, #7c3aed, #4f46e5)", color: "#ffffff", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }
                  : { color: "#0f172a" }
                }>
                <span className="text-sm">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}

          {/* Live badge */}
          <span className="ml-2 flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Classes
          </span>
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          {!authReady ? (
            /* Skeleton placeholder — same height as both auth states, prevents layout shift */
            <div className="w-[90px] h-[38px] rounded-xl bg-slate-100 animate-pulse" />
          ) : user ? (
            <>
              {/* User avatar + email */}
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-300/40">
                  {initials}
                </div>
                <span className="text-xs text-slate-500 font-medium max-w-[140px] truncate">{user.email}</span>
              </div>
              {onSignOut && (
                <button onClick={onSignOut}
                  className="text-[13px] rounded-xl border-2 border-slate-200 px-4 py-2 text-slate-700 font-bold hover:text-red-500 hover:border-red-300 hover:bg-red-50 transition-all">
                  Sign out
                </button>
              )}
            </>
          ) : (
            <Link href="/academy/login"
              className="text-[13px] rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-5 py-2.5 text-white font-bold transition-all shadow-md shadow-indigo-300/50 hover:shadow-lg hover:shadow-indigo-300/70 hover:-translate-y-px">
              Sign in →
            </Link>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition font-bold text-lg">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="sm:hidden border-t-2 border-slate-100 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
          {NAV.filter(n => !n.authOnly || (authReady && user)).map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold px-3 py-2.5 rounded-xl transition"
                style={active
                  ? { background: "linear-gradient(to right, #7c3aed, #4f46e5)", color: "#ffffff" }
                  : { color: "#0f172a" }
                }>
                <span>{n.icon}</span> {n.label}
              </Link>
            );
          })}
          {user && (
            <div className="px-3 py-2 text-xs text-slate-500 border-t border-slate-100 mt-1">
              {user.email}
            </div>
          )}
          {user && onSignOut && (
            <button onClick={() => { onSignOut(); setMenuOpen(false); }}
              className="text-sm font-bold text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 transition text-left">
              Sign out
            </button>
          )}
          {!user && (
            <Link href="/academy/login" onClick={() => setMenuOpen(false)}
              className="text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2.5 rounded-xl transition text-center mt-1">
              Sign in →
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
