import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

const SECTION_STAGGER = {
  initial: {},
  whileInView: {},
  transition: { ...REVEAL.transition, staggerChildren: 0.12, delayChildren: 0.06 },
};

export default function MissionAndAtAGlance() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/about/about-section-grid.jpg"
          alt="Subtle technical grid background"
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.div
          variants={SECTION_STAGGER}
          initial="initial"
          whileInView="whileInView"
          viewport={REVEAL.viewport}
          className="grid gap-6 md:grid-cols-[2fr,1.2fr]"
        >
          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
          >
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-cyan-200">
              Our mission
            </h2>
            <p className="text-slate-200/80 text-sm md:text-base mb-3">
              Our mission is to empower the infrastructure and manufacturing sectors with cutting-edge engineering solutions that ensure reliability and accelerate growth.
            </p>
            <p className="text-slate-200/80 text-sm md:text-base">
              We also partner with ambitious enterprises to drive digital transformation and achieve market leadership through strategic IT consultation and innovative technology implementation.
            </p>
          </motion.div>

          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden"
          >
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
              <div className="relative h-36 w-full">
                <Image
                  src="/images/about/about-at-a-glance.jpg"
                  alt="Modern engineering and IT collage"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/20 via-slate-950/55 to-slate-950/80" />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-200/60 uppercase tracking-[0.18em] mb-2">
                At a glance
              </p>
              <p className="text-2xl font-bold text-cyan-200 mb-1">Since 2014</p>
              <p className="text-slate-200/80 text-sm">
                A decade of experience serving businesses with engineering, IT, training, and digital needs.
              </p>
            </div>

            <div className="mt-4 text-xs text-slate-200/60">
              Sejal Engitech • Alambana Edutech / Academy • Alambana Digital
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
