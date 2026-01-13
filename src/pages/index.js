import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout
      seo={{
        title: "Sejal Engitech Private Limited | IT Services",
        description:
          "Sejal Engitech Private Limited provides IT services for local businesses, startups, and enterprises: software development, app development, web design, networking, installation, and cyber security.",
        canonical: "https://www.sejalengitech.in/",
        ogImage: "https://www.sejalengitech.in/og.jpg",
      }}
    >
      {/* HERO (Revamped) */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

        {/* Subtle grid glow */}
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-10 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 pb-14 md:pt-20 md:pb-20">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Left */}
            <div>
              <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                IT Services • Since 2014
              </p>

              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                Build, secure, and scale
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  your technology.
                </span>
              </h1>

              <p className="mt-5 text-slate-300 text-base md:text-lg max-w-xl">
                Custom software, mobile apps, websites, networking,
                installations, and cyber security—delivered with clear
                communication, realistic timelines, and long-term support.
              </p>

              {/* CTAs (primary + secondary) */}
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="px-6 py-3 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 transition"
                >
                  Get a Quote
                </a>
                <a
                  href="/services"
                  className="px-6 py-3 rounded-full border border-slate-600 text-sm hover:border-cyan-400 hover:text-cyan-300 transition"
                >
                  Explore IT Services
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1">
                  Clear scope & milestones
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1">
                  Security-first mindset
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1">
                  Ongoing support after launch
                </span>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Training & digital marketing are available on{" "}
                <a
                  href="https://alambanatech.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 hover:underline"
                >
                  alambanatech.com
                </a>
                .
              </p>
            </div>

            {/* Right: service highlights */}
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-3">
                  What we deliver
                </p>
                <ul className="grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Custom Software
                  </li>
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Mobile Apps
                  </li>
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Websites
                  </li>
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Networking
                  </li>
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Installations
                  </li>
                  <li className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2">
                    Cyber Security
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950 p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-3">
                  Promise
                </p>
                <p className="text-sm text-slate-200">
                  Clear scope, realistic timelines, and a long-term support
                  mindset—so your tech stays stable after launch.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-2">
                  Typical turnaround
                </p>
                <p className="text-sm text-slate-200">
                  Websites: 1–3 weeks • MVPs: 4–8 weeks • Security & networking:
                  by scope
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-slate-800/80" />

      </section>

      {/* WHO WE HELP */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-16">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Who we help</h2>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl mb-6">
          Whether you need a simple website, a full product build, or secure
          enterprise-grade systems, we adapt to your stage and scale.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-cyan-300 mb-2">
              Local businesses
            </h3>
            <p className="text-sm text-slate-300">
              Websites, apps, IT support, installation, and reliable systems to
              run daily operations smoothly.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-emerald-300 mb-2">
              Startups
            </h3>
            <p className="text-sm text-slate-300">
              MVP development, faster iterations, and tech decisions that keep
              cost low and growth possible.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-sm font-semibold text-fuchsia-300 mb-2">
              Enterprises
            </h3>
            <p className="text-sm text-slate-300">
              Security, networking, modernization, and custom solutions for
              larger teams and higher reliability needs.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-lg md:text-xl font-semibold mb-3">How we work</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-[0.18em] mb-1">
              Step 1
            </p>
            <p className="font-semibold">Discovery</p>
            <p className="text-sm text-slate-300">Goals, users, risks, and timelines.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-[0.18em] mb-1">
              Step 2
            </p>
            <p className="font-semibold">Plan</p>
            <p className="text-sm text-slate-300">Scope, cost, and technical approach.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-[0.18em] mb-1">
              Step 3
            </p>
            <p className="font-semibold">Build</p>
            <p className="text-sm text-slate-300">Milestones, testing, and clear updates.</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-[0.18em] mb-1">
              Step 4
            </p>
            <p className="font-semibold">Launch & Support</p>
            <p className="text-sm text-slate-300">Go-live, monitoring, improvements.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900/70 to-slate-950 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to build or upgrade your IT systems?
          </h2>
          <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
            Share your requirement and we’ll respond with a clear plan, a
            practical timeline, and the next steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm hover:bg-cyan-300 transition"
            >
              Contact Sejal Engitech
            </a>
            <a
              href="https://alambanatech.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-slate-600 text-sm hover:border-emerald-300 hover:text-emerald-300 transition"
            >
              Training & Digital (Alambana)
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
