import Link from "next/link";
import { useState } from "react";
export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Shared header / nav */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wide">
              Sejal Engitech Pvt. Ltd.
            </span>
            <span className="text-xs text-slate-400">Alambana Tech Group</span>
          </div>
          {/* Mobile menu button */}
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="sm:hidden group inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-950/40 hover:border-cyan-400 transition"
          >
            <span className="sr-only">Menu</span>
            <div className="relative h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-slate-200 transition-all duration-300 ${
                  open ? "translate-y-2 rotate-45 bg-cyan-300" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-6 bg-slate-200 transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-6 bg-slate-200 transition-all duration-300 ${
                  open ? "-translate-y-2 -rotate-45 bg-cyan-300" : ""
                }`}
              />
            </div>
          </button>

          <nav className="hidden sm:flex gap-6 text-sm">
            <Link href="/" className="hover:text-cyan-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-cyan-300">
              About
            </Link>
            <Link href="/services" className="hover:text-cyan-300">
              Services
            </Link>
            <Link href="/projects" className="hover:text-cyan-300">
              Projects
            </Link>
            <Link href="/contact" className="hover:text-cyan-300">
              Contact
            </Link>
          </nav>
          {/* Mobile dropdown menu */}
          {open && (
            <div className="sm:hidden border-t border-slate-800 bg-slate-900/80">
              <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 text-sm">
                <Link
                  href="/"
                  className="rounded-md px-2 py-2 hover:bg-slate-800/60 hover:text-cyan-300 transition"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="rounded-md px-2 py-2 hover:bg-slate-800/60 hover:text-cyan-300 transition"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="rounded-md px-2 py-2 hover:bg-slate-800/60 hover:text-cyan-300 transition"
                  onClick={() => setOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/projects"
                  className="rounded-md px-2 py-2 hover:bg-slate-800/60 hover:text-cyan-300 transition"
                  onClick={() => setOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md px-2 py-2 hover:bg-slate-800/60 hover:text-cyan-300 transition"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-800 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs md:text-sm text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Sejal Engitech &amp; Alambana Tech. All
            rights reserved.
          </span>
          <span className="text-slate-500">
            IT Services • Training • Digital Marketing
          </span>
          <div className="flex gap-4 text-slate-500">
            <Link href="/privacyPolicy" className="hover:text-cyan-300">
              Privacy Policy
            </Link>
            <span aria-hidden="true">•</span>
            <Link href="/termsOfService" className="hover:text-cyan-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
