import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

const SECTION_STAGGER = {
  initial: {},
  whileInView: {},
  transition: { ...REVEAL.transition, staggerChildren: 0.08, delayChildren: 0.06 },
};

function ServiceCard({ title, desc, tone = "cyan" }) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-200"
      : tone === "fuchsia"
        ? "text-fuchsia-200"
        : "text-cyan-200";

  return (
    <motion.div
      variants={REVEAL}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] p-5"
    >
      <h3 className={`font-semibold mb-1 ${toneClass}`}>{title}</h3>
      <p className="text-slate-200/80 text-sm">{desc}</p>
    </motion.div>
  );
}

export default function ServicesGrid() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/services/services-grid-bg.jpg"
          alt="Subtle modern technology grid background"
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/92 to-slate-950/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={SECTION_STAGGER}
          initial="initial"
          whileInView="whileInView"
          viewport={REVEAL.viewport}
        >
          <ServiceCard
            title="Software Development"
            desc="Custom software to automate workflows, reduce manual effort, and improve reliability."
            tone="cyan"
          />
          <ServiceCard
            title="App Development"
            desc="Mobile apps built for speed, usability, and real business outcomes."
            tone="emerald"
          />
          <ServiceCard
            title="Web Designing"
            desc="Modern, responsive websites that look premium and convert visitors into leads."
            tone="fuchsia"
          />
          <ServiceCard
            title="Networking"
            desc="Secure, stable networks with clean setup, monitoring guidance, and best practices."
            tone="cyan"
          />
          <ServiceCard
            title="Hardware & Software Installation"
            desc="Smooth installations, upgrades, and troubleshooting for office and small enterprise setups."
            tone="emerald"
          />
          <ServiceCard
            title="Cyber Security"
            desc="Basic hardening, access control, backups, and security checks to reduce business risk."
            tone="fuchsia"
          />

          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] p-6 md:col-span-2 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-200 mb-1">
                  Video for Ads / YouTube
                </h3>
                <p className="text-slate-200/80 text-sm">
                  Product explainers, promos, and business videos that support your marketing and branding.
                </p>
                <p className="text-xs text-slate-200/60 mt-2">
                  For full digital marketing packages, visit alambanatech.com.
                </p>
              </div>

              <div className="shrink-0">
                <div className="relative h-20 w-full md:w-56 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <Image
                    src="/images/services/services-video-card.jpg"
                    alt="Video production and marketing creative background"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950/15 via-slate-950/45 to-slate-950/80" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
