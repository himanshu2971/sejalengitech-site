import Head from "next/head";
import Layout from "../components/Layout";
import PageSection from "../components/PageSection";
import Image from "next/image";

export default function About() {
  return (
    <Layout>
      <>
        <Head>
          <title>About | Sejal Engitech & Alambana</title>
        </Head>

        <PageSection>
          {/* Top badge + heading */}
          <div className="mb-8">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              About us
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold">
              About Sejal Engitech &amp; Alambana
            </h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
              Engineering, IT services, training, and digital solutions under
              one roof for growing businesses.
            </p>
          </div>

          {/* Mission card */}
          <section className="grid gap-6 md:grid-cols-[2fr,1.2fr] mb-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3 text-cyan-300">
                Our mission
              </h2>
              <p className="text-slate-300 text-sm md:text-base mb-3">
                Our mission is to empower the infrastructure and manufacturing
                sectors with cutting-edge engineering solutions that ensure
                reliability and accelerate growth.
              </p>
              <p className="text-slate-300 text-sm md:text-base">
                We also partner with ambitious enterprises to drive digital
                transformation and achieve market leadership through strategic
                IT consultation and innovative technology implementation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-2">
                  At a glance
                </p>
                <p className="text-2xl font-bold text-cyan-300 mb-1">
                  Since 2014
                </p>
                <p className="text-slate-300 text-sm">
                  A decade of experience serving businesses with engineering,
                  IT, training, and digital needs.
                </p>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                Sejal Engitech • Alambana Edutech / Academy • Alambana Digital
              </div>
            </div>
          </section>

          {/* Why choose us */}
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              Why choose Sejal Engitech / Alambana
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold mb-1 text-cyan-300">
                  Expertise-driven solutions
                </h3>
                <p className="text-xs md:text-sm text-slate-300">
                  A decade of industry-specific experience guarantees
                  high-quality, practical, and future-proof outcomes.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold mb-1 text-emerald-300">
                  Client-centric partnership
                </h3>
                <p className="text-xs md:text-sm text-slate-300">
                  We go beyond a vendor role, offering dedicated support and
                  tailored strategies that align perfectly with your business
                  goals.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold mb-1 text-fuchsia-300">
                  Commitment to innovation
                </h3>
                <p className="text-xs md:text-sm text-slate-300">
                  We continuously integrate the latest technologies and
                  methodologies to provide you with a lasting competitive edge.
                </p>
              </div>
            </div>
          </section>

          {/* Leadership + Team */}
          <section className="mt-16 max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Leadership &amp; Team
              </h2>
              <p className="text-slate-300 text-sm md:text-base max-w-3xl">
                A hands-on team delivering IT services through Sejal Engitech and
                training &amp; digital initiatives through Alambana Group.
              </p>
            </div>

            {/* Founder / MD featured */}
            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {/* Photo */}
                <div className="shrink-0">
                  <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/40 shadow-lg shadow-black/30">
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
                      <p className="text-slate-400 text-sm">
                        Founder &amp; Managing Director
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 px-3 py-1">
                        20+ years experience
                      </span>
                      <span className="text-xs rounded-full border border-slate-800 bg-slate-950/40 text-slate-300 px-3 py-1">
                        M.C.A
                      </span>
                      <span className="text-xs rounded-full border border-slate-800 bg-slate-950/40 text-slate-300 px-3 py-1">
                        Certified Research Analyst
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
                    Seasoned business leader with over 20 years of professional
                    experience across IT, technical education, healthcare, and
                    enterprise management. Brings strong expertise in marketing,
                    distribution, retail management, and securities &amp; market
                    research analysis.
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
                        className="text-xs rounded-full border border-slate-800 bg-slate-950/40 text-slate-300 px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Core team */}
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg md:text-xl font-semibold">Core team</h3>
                <p className="text-xs text-slate-500">6 members</p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* 1) Himanshu */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
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
                      <p className="text-xs text-slate-400">Program Manager</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Leads delivery across IT services, training, and digital—keeping
                    scope, timelines, and outcomes aligned.
                  </p>
                </div>

                {/* 2) Stuti */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40">
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
                      <p className="text-xs text-slate-400">Digital Creative Lead</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Builds brand awareness through AI-led storytelling, ad creatives,
                    and social-first campaigns.
                  </p>
                </div>

                {/* 3) Alambana Team */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-800 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center text-slate-100 font-bold">
                      AT
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-slate-100">
                        Alambana Tech Team
                      </p>
                      <p className="text-xs text-slate-400">
                        IT &amp; Training Specialists
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Engineers and trainers working on AI, data, web, and automation
                    projects while mentoring learners.
                  </p>
                </div>

                {/* 4) Manish Kumar */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40">
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
                      <p className="text-xs text-slate-400">
                        Senior Consultant • Melbourne, Australia (SEPL Branch)
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    18 years advising organizations on transformation,
                    modernization, and operational excellence. Trusted partner to
                    executives in aligning strategy with execution, leading complex
                    initiatives, and delivering measurable business outcomes.
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
                        className="text-xs rounded-full border border-slate-800 bg-slate-950/40 text-slate-300 px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5) Deepak Singh */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/40">
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
                      <p className="text-xs text-slate-400">
                        Senior Consultant • Telecom IT
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    IT professional with 18+ years delivering end-to-end telecom IT
                    solutions. Expert in system automation, cloud-native and open-source
                    migration, database architecture, analytics, and billing platforms.
                    Proven leader in mission-critical deliveries, modernization, cost
                    reduction, reliability, and regulatory compliance.
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
                        className="text-xs rounded-full border border-slate-800 bg-slate-950/40 text-slate-300 px-3 py-1"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 6) QA & Support (kept) */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 hover:border-cyan-500/40 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-800 bg-slate-950/40 flex items-center justify-center text-slate-100 font-bold">
                      QA
                    </div>
                    <div>
                      <p className="font-semibold text-sm md:text-base text-slate-100">
                        QA &amp; Support
                      </p>
                      <p className="text-xs text-slate-400">
                        Testing &amp; Delivery Support
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ensures quality releases through test plans, regression checks,
                    and post-launch monitoring.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </PageSection>
      </>
    </Layout>
  );
}
