import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

const STAGGER = {
  initial: {},
  whileInView: {},
  transition: {
    // keep your existing REVEAL transition feel, just orchestrate children
    ...REVEAL.transition,
    staggerChildren: 0.12,
    delayChildren: 0.06,
  },
};

export default function HowWeWork() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 pb-16">
      <motion.h2 {...REVEAL} className="text-lg md:text-xl font-semibold mb-3">
        How we work
      </motion.h2>

      <motion.div
        className="grid gap-4 md:grid-cols-4"
        variants={STAGGER}
        initial="initial"
        whileInView="whileInView"
        viewport={REVEAL.viewport}
      >
        {[
          ["Step 1", "Discovery", "Goals, users, risks, and timelines."],
          ["Step 2", "Plan", "Scope, cost, and technical approach."],
          ["Step 3", "Build", "Milestones, testing, and clear updates."],
          ["Step 4", "Launch & Support", "Go-live, monitoring, improvements."],
        ].map(([step, title, desc]) => (
          <motion.div
            key={step}
            variants={REVEAL}
            className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
          >
            <p className="text-xs text-slate-200/60 uppercase tracking-[0.18em] mb-1">
              {step}
            </p>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-slate-200/80">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
