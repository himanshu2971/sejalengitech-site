import Link from "next/link";
import { useState } from "react";
import SEO from "@/components/seo/SEO";

export default function Layout({ children, seo }) {

  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const NavLink = ({ href, children }) => (
    <Link href={href} className="hover:text-cyan-300" onClick={close}>
      {children}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <SEO {...seo} />
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
            {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919001207105?text=Hi%2C%20I%27m%20interested%20in%20your%20IT%20services."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-18 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 hover:bg-[#1ebe57] transition"
        aria-label="Chat on WhatsApp"
      >
        {/* simple WhatsApp icon using SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 308 308"
          className="h-6 w-6 fill-white"
        >
          <path d="M227.9 176.98c-.6-.29-23.05-11.35-27.04-12.78-1.63-.59-3.38-1.16-5.23-1.16-3.03 0-5.58 1.51-7.56 4.48-2.24 3.33-9.03 11.27-11.13 13.64-.27.31-.65.69-.87.69-.2 0-3.67-1.43-4.73-1.89-24.09-10.46-42.37-35.62-44.88-39.86-.36-.61-.37-.89-.37-.89.09-.32.9-1.13 1.32-1.55 1.22-1.21 2.55-2.81 3.83-4.35.61-.74 1.22-1.47 1.81-2.16 1.86-2.16 2.69-3.84 3.65-5.79l.5-1.01c2.35-4.66.34-8.59-.31-9.86-.53-1.06-10.01-23.94-11.02-26.35-2.43-5.81-5.63-8.51-10.08-8.51-.41 0 0 0-1.73.07-2.11.09-13.59 1.6-18.67 4.8-5.39 3.39-14.5 14.21-14.5 33.25 0 17.13 10.87 33.3 15.54 39.45.11.16.32.47.63.92 17.87 26.1 40.16 45.45 62.74 54.47 21.75 8.69 32.04 9.7 37.89 9.7h.01c2.46 0 4.43-.19 6.17-.36l1.1-.11c7.51-.66 24.02-9.22 27.78-19.65 2.96-8.22 3.74-17.2 1.77-20.46-1.06-1.78-3.38-2.9-6.32-4.31z" />
          <path d="M156.73 0C73.32 0 5.45 67.35 5.45 150.14c0 26.78 7.17 52.99 20.74 75.93L.21 302.72c-.48 1.43-.12 3.01.93 4.08.77.78 1.8 1.2 2.86 1.2.41 0 .82-.06 1.22-.19l79.92-25.4c21.87 11.69 46.59 17.86 71.59 17.86 83.41 0 151.27-67.35 151.27-150.14C308 67.35 240.14 0 156.73 0zm0 268.99c-23.54 0-46.34-6.8-65.94-19.66-.66-.43-1.42-.65-2.19-.65-.41 0-.82.06-1.21.19l-40.03 12.73 12.92-38.13c.42-1.24.21-2.6-.56-3.65-14.92-20.39-22.81-44.48-22.81-69.68 0-65.54 53.75-118.87 119.82-118.87 66.06 0 119.81 53.33 119.81 118.87 0 65.54-53.75 118.87-119.81 118.87z" />
        </svg>
      </a>

    </div>
  );
}
