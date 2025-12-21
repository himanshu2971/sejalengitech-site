import Link from "next/link";
import { useState } from "react";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const NavLink = ({ href, children }) => (
    <Link href={href} className="hover:text-cyan-300" onClick={close}>
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Shared header / nav */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wide">
              Sejal Engitech Pvt. Ltd.
            </span>
            <span className="text-xs text-slate-400">
              IT Services • Since 2014
            </span>
          </div>

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

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/services">IT Services</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/contact">Contact</NavLink>

            {/* Child site link */}
            <a
              href="https://alambanatech.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-3 py-1 text-xs hover:border-cyan-400 hover:text-cyan-300 transition"
            >
              Alambana (Training & Digital)
            </a>
          </nav>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-900/80">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-2 text-sm">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/services">IT Services</NavLink>
              <NavLink href="/projects">Projects</NavLink>
              <NavLink href="/contact">Contact</NavLink>

              <a
                href="https://alambanatech.com"
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-md border border-slate-700 px-3 py-2 text-xs hover:border-cyan-400 hover:text-cyan-300 transition"
                onClick={close}
              >
                Visit Alambana (Training & Digital)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-800 bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs md:text-sm text-slate-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Sejal Engitech Pvt. Ltd. All rights
            reserved.
          </span>
          <span className="text-slate-500">
            For Training & Digital services:{" "}
            <a
              href="https://alambanatech.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 hover:underline"
            >
              alambanatech.com
            </a>
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
