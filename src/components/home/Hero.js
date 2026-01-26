// src/components/home/Hero.js
import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

export default function Hero() {
  return (
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
  );
}
