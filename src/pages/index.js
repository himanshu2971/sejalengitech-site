// src/pages/index.js
import Head from "next/head";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const REVEAL = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.5, ease: "easeOut" },
};

function FullImageBand({ src, alt, children, overlayClassName }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax on the background image
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
        <div
          className={
            overlayClassName ??
            "absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent"
          }
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        {children}
      </div>
    </section>
  );
}

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
        <meta property="og:image" content="https://www.sejalengitech.in/og.jpg" />
      </Head>

      {/* HERO (same content, but adds hover lift so it feels alive) */}
      <section className="px-3 md:px-6 pt-6 md:pt-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]"
          >
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

                <div className="grid gap-4">
                  <motion.div
                    {...REVEAL}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                  >
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
                  </motion.div>

                  <motion.div
                    {...REVEAL}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <p className="text-xs font-semibold text-slate-200/70 uppercase tracking-[0.18em] mb-3">
                      Promise
                    </p>
                    <p className="text-sm text-slate-100/90">
                      Clear scope, realistic timelines, and a long-term support
                      mindset—so your tech stays stable after launch.
                    </p>
                  </motion.div>

                  <motion.div
                    {...REVEAL}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
                  >
                    <p className="text-xs font-semibold text-slate-200/70 uppercase tracking-[0.18em] mb-2">
                      Typical turnaround
                    </p>
                    <p className="text-sm text-slate-100/90">
                      Websites: 1–3 weeks • MVPs: 4–8 weeks • Security &
                      networking: by scope
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
          </motion.div>
        </div>
      </section>

      {/* BAND 1 */}
      <FullImageBand
        src="/images/home/home-band-1.png"
        alt="Modern technology abstract background"
        overlayClassName="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-transparent"
      >
        <motion.div {...REVEAL}>
          <h2 className="text-2xl md:text-4xl font-bold">
            Trusted IT support for growing businesses
          </h2>
          <p className="mt-3 max-w-2xl text-slate-200/80 text-sm md:text-base">
            From websites and apps to security and networking, we deliver
            reliable systems with clear communication and long-term support.
          </p>
        </motion.div>
      </FullImageBand>

      {/* WHO WE HELP */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <motion.h2 {...REVEAL} className="text-lg md:text-xl font-semibold mb-3">
          Who we help
        </motion.h2>

        <motion.p
          {...REVEAL}
          className="text-slate-300 text-sm md:text-base max-w-3xl mb-6"
        >
          Whether you need a simple website, a full product build, or secure
          enterprise-grade systems, we adapt to your stage and scale.
        </motion.p>

        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            {...REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <h3 className="text-sm font-semibold text-cyan-200 mb-2">
              Local businesses
            </h3>
            <p className="text-sm text-slate-200/80">
              Websites, apps, IT support, installation, and reliable systems to
              run daily operations smoothly.
            </p>
          </motion.div>

          <motion.div
            {...REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <h3 className="text-sm font-semibold text-emerald-200 mb-2">
              Startups
            </h3>
            <p className="text-sm text-slate-200/80">
              MVP development, faster iterations, and tech decisions that keep
              cost low and growth possible.
            </p>
          </motion.div>

          <motion.div
            {...REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <h3 className="text-sm font-semibold text-fuchsia-200 mb-2">
              Enterprises
            </h3>
            <p className="text-sm text-slate-200/80">
              Security, networking, modernization, and custom solutions for
              larger teams and higher reliability needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BAND 2 (Option B overlay stronger for readability) */}
      <FullImageBand
        src="/images/home/home-band-2.png"
        alt="Abstract workflow background"
        overlayClassName="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-slate-950/10"
      >
        <motion.div {...REVEAL} className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
            Delivery process
          </p>
          <h2 className="mt-4 text-2xl md:text-4xl font-bold">
            Predictable execution, clear updates
          </h2>
          <p className="mt-3 text-slate-200/80 text-sm md:text-base">
            We work in milestones with testing, documentation, and handover so
            your team can run confidently after launch.
          </p>
        </motion.div>
      </FullImageBand>

      {/* HOW WE WORK */}
      <section className="max-w-7xl mx-auto px-4 py-16 pb-16">
        <motion.h2 {...REVEAL} className="text-lg md:text-xl font-semibold mb-3">
          How we work
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Step 1", "Discovery", "Goals, users, risks, and timelines."],
            ["Step 2", "Plan", "Scope, cost, and technical approach."],
            ["Step 3", "Build", "Milestones, testing, and clear updates."],
            ["Step 4", "Launch & Support", "Go-live, monitoring, improvements."],
          ].map(([step, title, desc]) => (
            <motion.div
              key={step}
              {...REVEAL}
              className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <p className="text-xs text-slate-200/60 uppercase tracking-[0.18em] mb-1">
                {step}
              </p>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-slate-200/80">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA as band 3 */}
      <FullImageBand
        src="/images/home/home-band-3.png"
        alt="Abstract background for call to action"
        overlayClassName="absolute inset-0 bg-gradient-to-br from-slate-950/65 via-slate-950/25 to-slate-950/75"
      >
        <motion.div
          {...REVEAL}
          className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-8 md:p-10 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
        >
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
        </motion.div>
      </FullImageBand>
    </>
  );
}
