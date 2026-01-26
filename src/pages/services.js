// src/pages/services.js
import Head from "next/head";
import PageSection from "../components/PageSection";
import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
};

function ServiceCard({ title, desc }) {
  return (
    <motion.div
      variants={item}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] p-5"
    >
      <h3 className="font-semibold text-cyan-200 mb-1">{title}</h3>
      <p className="text-slate-200/80 text-sm">{desc}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <>
      <Head>
        <title>IT Services | Sejal Engitech</title>
      </Head>

      <PageSection>
        {/* Premium hero */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/services/services-hero.png"
              alt="IT Services hero background"
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/55 to-slate-950/85" />
          </div>

          <div className="relative px-5 py-10 md:px-10 md:py-12">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              IT Services
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold">
              IT Services by Sejal Engitech
            </h1>
            <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
              Reliable development, deployment, and support for businesses—designed
              to be secure, scalable, and easy to maintain.
            </p>
          </div>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-10 grid gap-5 md:grid-cols-2"
        >
          <ServiceCard
            title="Software Development"
            desc="Custom software to automate workflows, reduce manual effort, and improve reliability."
          />
          <ServiceCard
            title="App Development"
            desc="Mobile apps built for speed, usability, and real business outcomes."
          />
          <ServiceCard
            title="Web Designing"
            desc="Modern, responsive websites that look premium and convert visitors into leads."
          />
          <ServiceCard
            title="Networking"
            desc="Secure, stable networks with clean setup, monitoring guidance, and best practices."
          />
          <ServiceCard
            title="Hardware & Software Installation"
            desc="Smooth installations, upgrades, and troubleshooting for office and small enterprise setups."
          />
          <ServiceCard
            title="Cyber Security"
            desc="Basic hardening, access control, backups, and security checks to reduce business risk."
          />

          <motion.div
            variants={item}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] p-6 md:col-span-2"
          >
            <h3 className="font-semibold text-cyan-200 mb-1">Video for Ads / YouTube</h3>
            <p className="text-slate-200/80 text-sm">
              Product explainers, promos, and business videos that support your marketing and branding.
            </p>
            <p className="text-xs text-slate-200/60 mt-2">
              For full digital marketing packages, visit alambanatech.com.
            </p>
          </motion.div>
        </motion.div>

        {/* Cross-sell */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-xl p-7 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
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
      </PageSection>
    </>
  );
}
