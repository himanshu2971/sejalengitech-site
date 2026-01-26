import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

const SECTION_STAGGER = {
  initial: {},
  whileInView: {},
  transition: { ...REVEAL.transition, staggerChildren: 0.12, delayChildren: 0.06 },
};

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/about/about-why-bg.jpg"
          alt="Modern abstract background with cyan highlights"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.div {...REVEAL} className="max-w-3xl">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Why choose Sejal Engitech / Alambana
          </h2>
          <p className="text-slate-200/80 text-sm md:text-base">
            A practical, execution-first team with the range to cover engineering, IT delivery, training, and digital growth.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-5 md:grid-cols-3"
          variants={SECTION_STAGGER}
          initial="initial"
          whileInView="whileInView"
          viewport={REVEAL.viewport}
        >
          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
          >
            <h3 className="text-sm font-semibold mb-1 text-cyan-200">
              Expertise-driven solutions
            </h3>
            <p className="text-sm text-slate-200/80">
              A decade of industry-specific experience guarantees high-quality, practical, and future-proof outcomes.
            </p>
          </motion.div>

          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
          >
            <h3 className="text-sm font-semibold mb-1 text-emerald-200">
              Client-centric partnership
            </h3>
            <p className="text-sm text-slate-200/80">
              We go beyond a vendor role, offering dedicated support and tailored strategies aligned with your business goals.
            </p>
          </motion.div>

          <motion.div
            variants={REVEAL}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
          >
            <h3 className="text-sm font-semibold mb-1 text-fuchsia-200">
              Commitment to innovation
            </h3>
            <p className="text-sm text-slate-200/80">
              We continuously integrate the latest technologies and methodologies to provide a lasting competitive edge.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
