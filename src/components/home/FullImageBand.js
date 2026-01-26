import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function FullImageBand({ src, alt, children, overlayClassName }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

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
