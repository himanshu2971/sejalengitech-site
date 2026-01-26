// src/pages/projects.js
import Head from "next/head";
import PageSection from "../components/PageSection";
import Image from "next/image";
import { motion } from "framer-motion";

function FeaturedProject({ project }) {
  return (
    <motion.section
      variants={item}
      className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)] p-5 md:p-7"
    >
      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
        Featured project
      </span>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-slate-100">
            {project.title}
          </h2>
          <p className="text-xs text-slate-400">
            {project.type} {project.timeframe ? `• ${project.timeframe}` : ""}
          </p>
        </div>

        <p className="text-sm md:text-base text-slate-300">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {project.role ? (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-200/90">
              {project.role}
            </span>
          ) : null}

          {(project.tech || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-200/90"
            >
              {tag}
            </span>
          ))}
        </div>

        {project.link ? (
          <div className="mt-4">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
            >
              View live project
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.article
      variants={item}
      className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] p-5 flex flex-col gap-3 hover:border-cyan-400/40 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm md:text-base font-semibold text-slate-100">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400">
            {project.type} {project.timeframe ? `• ${project.timeframe}` : ""}
          </p>
        </div>

        {/* Tiny accent */}
        <span className="h-2 w-2 rounded-full bg-cyan-400/70 shadow-[0_0_25px_rgba(34,211,238,0.35)]" />
      </div>

      <p className="text-sm text-slate-300">{project.description}</p>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-200/90">
        {project.role ? (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
            {project.role}
          </span>
        ) : null}

        {(project.tech || []).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>

      {project.link ? (
        <div className="mt-3">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
          >
            View live project
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      ) : null}
    </motion.article>
  );
}

/* Animations: parent staggers children; children slide+fade in */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Projects({ projects = [] }) {
  const featured = projects.find((p) => p.highlight) || null;
  const others = projects.filter((p) => !p.highlight);

  return (
    <>
      <Head>
        <title>Projects | Sejal Engitech</title>
      </Head>

      <PageSection>
        {/* Premium hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]">
          <div className="absolute inset-0">
            <Image
              src="/images/projects/projects-hero.png"
              alt="Projects hero background"
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/50 to-slate-950/80" />
          </div>

          <div className="relative px-5 py-10 md:px-10 md:py-12">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Projects &amp; portfolio
            </p>

            <h1 className="mt-4 text-3xl md:text-5xl font-bold">
              Work that reflects how we build.
            </h1>

            <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
              Curated projects delivered with modern stacks, clean design systems, and
              production-grade deployment.
            </p>
          </div>
        </div>

        {/* Content */}
        <motion.div variants={container} initial="hidden" animate="show" className="mt-10">
          {featured ? (
            <div className="mb-8">
              <FeaturedProject project={featured} />
            </div>
          ) : null}

          <section className="mt-2">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Selected work</h2>

            {others.length === 0 ? (
              <motion.div
                variants={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 text-sm text-slate-300"
              >
                No projects yet. Add projects from Postman (POST /api/projects).
              </motion.div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {others.map((project) => (
                  <ProjectCard key={project._id || project.title} project={project} />
                ))}
              </div>
            )}
          </section>
        </motion.div>
      </PageSection>
    </>
  );
}

// SSR: fetches projects at request-time (always fresh)
export async function getServerSideProps({ req }) {
  const protocol = req.headers["x-forwarded-proto"]?.toString() || "http";
  const host = req.headers.host;

  const res = await fetch(`${protocol}://${host}/api/projects`);
  const projects = await res.json();

  return { props: { projects } };
}
