import Link from "next/link";

export default function Layout({ children }) {
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
