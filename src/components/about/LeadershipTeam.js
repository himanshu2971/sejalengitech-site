import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

const SECTION_STAGGER = {
  initial: {},
  whileInView: {},
  transition: { ...REVEAL.transition, staggerChildren: 0.12, delayChildren: 0.06 },
};

export default function LeadershipTeam() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/about/about-team-bg.jpg"
          alt="Professional team and technology themed background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/92 to-slate-950/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
        <motion.div {...REVEAL} className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Leadership &amp; Team
          </h2>
          <p className="text-slate-200/80 text-sm md:text-base max-w-3xl">
            A hands-on team delivering IT services through Sejal Engitech and training &amp; digital initiatives through Alambana Group.
          </p>
        </motion.div>

        <motion.div
          {...REVEAL}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]"
        >
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="shrink-0">
              <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-lg shadow-black/30">
                <Image
                  src="/team/AmrendraAnand.jpeg"
                  alt="Amrendra Kumar Anand"
                  fill
                  sizes="(min-width: 768px) 112px, 96px"
                  className="object-cover object-[50%_20%]"
                  priority
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                  <p className="text-slate-100 text-xl md:text-2xl font-semibold">
                    Amrendra Kumar Anand
                  </p>
                  <p className="text-slate-200/60 text-sm">
                    Founder &amp; Managing Director
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 px-3 py-1">
                    20+ years experience
                  </span>
                  <span className="text-xs rounded-full border border-white/10 bg-white/[0.03] text-slate-200/80 px-3 py-1">
                    M.C.A
                  </span>
                  <span className="text-xs rounded-full border border-white/10 bg-white/[0.03] text-slate-200/80 px-3 py-1">
                    Certified Research Analyst
                  </span>
                </div>
              </div>

              <p className="mt-4 text-slate-200/80 text-sm md:text-base leading-relaxed">
                Seasoned business leader with over 20 years of professional experience across IT, technical education, healthcare, and enterprise management. Brings strong expertise in marketing, distribution, retail management, and securities &amp; market research analysis.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "IT & enterprise strategy",
                  "Business growth",
                  "Operations & governance",
                  "Market research",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs rounded-full border border-white/10 bg-white/[0.03] text-slate-200/80 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <motion.h3 {...REVEAL} className="text-lg md:text-xl font-semibold">
              Core team
            </motion.h3>
            <motion.p {...REVEAL} className="text-xs text-slate-200/60">
              6 members
            </motion.p>
          </div>

          <motion.div
            className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={SECTION_STAGGER}
            initial="initial"
            whileInView="whileInView"
            viewport={REVEAL.viewport}
          >
            {/* <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl border border-white/10 overflow-hidden bg-white/[0.03]">
                  <Image
                    src="/team/himanshushourabh.jpeg"
                    alt="Himanshu Shourabh"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    Himanshu Shourabh
                  </p>
                  <p className="text-xs text-slate-200/60">Program Manager</p>
                </div>
              </div>
              <p className="text-sm text-slate-200/80 leading-relaxed">
                Leads delivery across IT services, training, and digital—keeping scope, timelines, and outcomes aligned.
              </p>
            </motion.div> */}

            <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl border border-white/10 overflow-hidden bg-white/[0.03]">
                  <Image
                    src="/team/stutiagrawal.jpg"
                    alt="Stuti Agrawal"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    Stuti Agrawal
                  </p>
                  <p className="text-xs text-slate-200/60">Digital Creative Lead</p>
                </div>
              </div>
              <p className="text-sm text-slate-200/80 leading-relaxed">
                Builds brand awareness through AI-led storytelling, ad creatives, and social-first campaigns.
              </p>
            </motion.div>

            <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl border border-white/10 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-slate-100 font-bold">
                  AT
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    Alambana Tech Team
                  </p>
                  <p className="text-xs text-slate-200/60">
                    IT &amp; Training Specialists
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-200/80 leading-relaxed">
                Engineers and trainers working on AI, data, web, and automation projects while mentoring learners.
              </p>
            </motion.div>

            <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <Image
                    src="/team/ManishKumar.jpeg"
                    alt="Manish Kumar"
                    fill
                    sizes="48px"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    Manish Kumar
                  </p>
                  <p className="text-xs text-slate-200/60">
                    Senior Consultant • Melbourne, Australia (SEPL Branch)
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-200/80 leading-relaxed">
                18 years advising organizations on transformation, modernization, and operational excellence. Trusted partner to executives in aligning strategy with execution, leading complex initiatives, and delivering measurable business outcomes.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Transformation",
                  "Modernization",
                  "Operational excellence",
                  "Strategy → execution",
                ].map((t) => (
                  <span
                    key={t}
                    className="text-xs rounded-full border border-white/10 bg-white/[0.03] text-slate-200/80 px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                  <Image
                    src="/team/DeepakKumar.jpeg"
                    alt="Deepak Singh"
                    fill
                    sizes="48px"
                    className="object-cover object-[50%_20%]"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    Deepak Singh
                  </p>
                  <p className="text-xs text-slate-200/60">
                    Senior Consultant • Telecom IT
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-200/80 leading-relaxed">
                IT professional with 18+ years delivering end-to-end telecom IT solutions. Expert in system automation, cloud-native and open-source migration, database architecture, analytics, and billing platforms. Proven leader in mission-critical deliveries, modernization, cost reduction, reliability, and regulatory compliance.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Automation",
                  "Cloud-native",
                  "Open-source migration",
                  "Database architecture",
                  "Analytics",
                  "Billing platforms",
                ].map((t) => (
                  <span
                    key={t}
                    className="text-xs rounded-full border border-white/10 bg-white/[0.03] text-slate-200/80 px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={REVEAL}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-100 font-bold">
                  QA
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base text-slate-100">
                    QA &amp; Support
                  </p>
                  <p className="text-xs text-slate-200/60">
                    Testing &amp; Delivery Support
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-200/80 leading-relaxed">
                Ensures quality releases through test plans, regression checks, and post-launch monitoring.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
