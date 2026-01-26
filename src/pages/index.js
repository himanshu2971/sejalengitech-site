// src/pages/index.js
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Head>
        <title>Sejal Engitech Private Limited | IT Services</title>
        <meta
          name="description"
          content="Sejal Engitech Private Limited provides IT services for local businesses, startups, and enterprises: software development, app development, web design, networking, installation, and cyber security."
        />
        <link rel="canonical" href="https://www.sejalengitech.in/" />
        <meta
          property="og:image"
          content="https://www.sejalengitech.in/og.jpg"
        />
      </Head>

      {/* HERO (Premium glass + image + motion) */}
      <section className="px-3 md:px-6 pt-6 md:pt-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/home/home-hero.png"
                alt="Sejal Engitech hero background"
                fill
                priority
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/45 to-slate-950/80" />
            </div>

            <div className="relative px-5 py-10 md:px-10 md:py-14">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                {/* Left */}
                <div>
                  <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    IT Services • Since 2014
                  </p>

                  <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                    Build, secure, and scale
                    <span className="block bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200 py-2 bg-clip-text text-transparent">
                      your technology.
                    </span>
                  </h1>

                  <p className="mt-5 text-slate-200/80 text-base md:text-lg max-w-xl">
                    Custom software, mobile apps, websites, networking,
                    installations, and cyber security—delivered with clear
                    communication, realistic timelines, and long-term support.
                  </p>

                  {/* CTAs */}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="/contact"
                      className="px-6 py-3 rounded-full bg-cyan-300 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:bg-cyan-200 transition"
                    >
                      Get a Quote
                    </a>
                    <a
                      href="/services"
                      className="px-6 py-3 rounded-full border border-white/15 bg-white/[0.03] text-sm hover:border-cyan-400/70 hover:text-cyan-200 transition"
                    >
                      Explore IT Services
                    </a>
                  </div>

                  {/* Trust strip */}
                  <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-slate-200/70">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                      Clear scope & milestones
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                      Security-first mindset
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                      Ongoing support after launch
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-slate-200/70">
                    Training & digital marketing are available on{" "}
                    <a
                      href="https://alambanatech.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-200 hover:underline"
                    >
                      alambanatech.com
                    </a>
                    .
                  </p>
                </div>

                {/* Right */}
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
                    <p className="text-xs font-semibold text-slate-200/70 uppercase tracking-[0.18em] mb-3">
                      What we deliver
                    </p>

                    <ul className="grid gap-2 text-sm text-slate-100 md:grid-cols-2">
                      {[
                        "Custom Software",
                        "Mobile Apps",
                        "Websites",
                        "Networking",
                        "Installations",
                        "Cyber Security",
                      ].map((x) => (
                        <li
                          key={x}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                        >
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6">
                    <p className="text-xs font-semibold text-slate-200/70 uppercase tracking-[0.18em] mb-3">
                      Promise
                    </p>
                    <p className="text-sm text-slate-100/90">
                      Clear scope, realistic timelines, and a long-term support
                      mindset—so your tech stays stable after launch.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6">
                    <p className="text-xs font-semibold text-slate-200/70 uppercase tracking-[0.18em] mb-2">
                      Typical turnaround
                    </p>
                    <p className="text-sm text-slate-100/90">
                      Websites: 1–3 weeks • MVPs: 4–8 weeks • Security &
                      networking: by scope
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
          </motion.div>
        </div>
      </section>

      {/* WHO WE HELP */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Who we help</h2>
        <p className="text-slate-300 text-sm md:text-base max-w-3xl mb-6">
          Whether you need a simple website, a full product build, or secure
          enterprise-grade systems, we adapt to your stage and scale.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
            <h3 className="text-sm font-semibold text-cyan-200 mb-2">
              Local businesses
            </h3>
            <p className="text-sm text-slate-200/80">
              Websites, apps, IT support, installation, and reliable systems to
              run daily operations smoothly.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-200 mb-2">
              Startups
            </h3>
            <p className="text-sm text-slate-200/80">
              MVP development, faster iterations, and tech decisions that keep
              cost low and growth possible.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5">
            <h3 className="text-sm font-semibold text-fuchsia-200 mb-2">
              Enterprises
            </h3>
            <p className="text-sm text-slate-200/80">
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
          {[
            ["Step 1", "Discovery", "Goals, users, risks, and timelines."],
            ["Step 2", "Plan", "Scope, cost, and technical approach."],
            ["Step 3", "Build", "Milestones, testing, and clear updates."],
            [
              "Step 4",
              "Launch & Support",
              "Go-live, monitoring, improvements.",
            ],
          ].map(([step, title, desc]) => (
            <div
              key={step}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4"
            >
              <p className="text-xs text-slate-200/60 uppercase tracking-[0.18em] mb-1">
                {step}
              </p>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-slate-200/80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-8 md:p-10 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to build or upgrade your IT systems?
          </h2>
          <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
            Share your requirement and we’ll respond with a clear plan, a
            practical timeline, and the next steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-cyan-300 text-slate-950 font-semibold text-sm hover:bg-cyan-200 transition"
            >
              Contact Sejal Engitech
            </a>
            <a
              href="https://alambanatech.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-sm hover:border-emerald-300/70 hover:text-emerald-200 transition"
            >
              Training & Digital (Alambana)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
