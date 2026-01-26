import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

export default function ServicesCrossSell() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/services/services-crosssell-bg.jpg"
          alt="Modern abstract background for training and digital marketing"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/92 to-slate-950/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
        <motion.div
          {...REVEAL}
          className="rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-7 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
        >
          <h2 className="text-lg font-semibold mb-2 text-emerald-200">
            Looking for Training or Digital Marketing?
          </h2>
          <p className="text-slate-200/80 text-sm md:text-base mb-4">
            Visit our Alambana website for complete details, packages, and offerings.
          </p>
          <a
            href="https://alambanatech.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex px-5 py-2.5 rounded-full bg-emerald-300 text-slate-950 font-semibold text-sm hover:bg-emerald-200 transition"
          >
            Go to alambanatech.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
