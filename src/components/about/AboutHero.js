import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/about/about-hero-bg.jpg"
          alt="Abstract engineering and technology background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-slate-950/65 to-slate-950/90" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
        <motion.div
          {...REVEAL}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          <div className="px-5 py-10 md:px-10 md:py-12">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              About us
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold">
              About Sejal Engitech &amp; Alambana
            </h1>
            <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
              Engineering, IT services, training, and digital solutions under one roof for growing businesses.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
