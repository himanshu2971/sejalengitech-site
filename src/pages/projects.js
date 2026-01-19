import Head from "next/head";
import Layout from "../components/Layout";
import PageSection from "../components/PageSection";

function FeaturedProject({ project }) {
  return (
    <section className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 md:p-7">
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

        <p className="text-sm md:text-base text-slate-300">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {project.role ? (
            <span className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-slate-300">
              {project.role}
            </span>
          ) : null}

          {(project.tech || []).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-slate-300"
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
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-sm md:text-base font-semibold text-slate-100">
          {project.title}
        </h3>
        <p className="text-xs text-slate-400">
          {project.type} {project.timeframe ? `• ${project.timeframe}` : ""}
        </p>
      </div>

      <p className="text-sm text-slate-300">{project.description}</p>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
        {project.role ? (
          <span className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1">
            {project.role}
          </span>
        ) : null}

        {(project.tech || []).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function Projects({ projects = [] }) {
  const featured = projects.find((p) => p.highlight) || null;
  const others = projects.filter((p) => !p.highlight);

  return (
    <Layout>
      <>
        <Head>
          <title>Projects | Sejal Engitech</title>
        </Head>

        <PageSection>
          {/* Header */}
          <div className="mb-8">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Projects &amp; portfolio
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold">
              Work that reflects how we build.
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
              Projects are managed via your internal API and rendered in the same
              design automatically.
            </p>
          </div>

          {/* Featured */}
          {featured ? <FeaturedProject project={featured} /> : null}

          {/* Grid */}
          <section className="mt-8">
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              Selected work
            </h2>

            {others.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
                No projects yet. Add projects from Postman (POST /api/projects).
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {others.map((project) => (
                  <ProjectCard key={project._id || project.title} project={project} />
                ))}
              </div>
            )}
          </section>
        </PageSection>
      </>
    </Layout>
  );
}

// SSR: fetches projects at request-time (always fresh)
export async function getServerSideProps({ req }) {
  const protocol =
    req.headers["x-forwarded-proto"]?.toString() || "http";
  const host = req.headers.host;

  const res = await fetch(`${protocol}://${host}/api/projects`);
  const projects = await res.json();

  return { props: { projects } };
}
