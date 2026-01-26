import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

export default function WhoWeHelp() {
  return (
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
            Websites, apps, IT support, installation, and reliable systems to run
            daily operations smoothly.
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
            MVP development, faster iterations, and tech decisions that keep cost
            low and growth possible.
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
            Security, networking, modernization, and custom solutions for larger
            teams and higher reliability needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
