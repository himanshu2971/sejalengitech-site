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

          {/* Team section */}
          <section className="mt-12">
            <h2 className="text-lg md:text-xl font-semibold mb-3">
              Meet our core team
            </h2>
            <p className="text-slate-300 text-sm md:text-base mb-6 max-w-3xl">
              A small, hands-on team of engineers, trainers, and digital
              specialists driving projects for Sejal Engitech and Alambana
              Group, a unit of Sejal Engitech Private Limited.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Member 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-lg">
                    <Image
                      src="/team/himanshushourabh.jpeg"
                      alt="Himanshu Shourabh"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      Himanshu Shourabh
                    </p>
                    <p className="text-xs text-slate-400">
                        Program Manager
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-300">
                  Leads overall strategy across IT services, training, and
                  digital, ensuring every project stays aligned with business
                  outcomes.
                </p>
              </div>

              {/* Member 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-lg">
                    A
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      Alambana Tech Team
                    </p>
                    <p className="text-xs text-slate-400">
                      IT &amp; Training Specialists
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-300">
                  Engineers and trainers working on AI, data, web, and
                  automation projects while mentoring learners in the academy.
                </p>
              </div>

              {/* Member 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-fuchsia-400 flex items-center justify-center text-slate-950 font-bold text-lg">
                    <Image
                      src="/team/stutiagrawal.jpg"
                      alt="Stuti Agrawal"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      Stuti Agrawal
                    </p>
                    <p className="text-xs text-slate-400">
                      Digital Creative Lead
                    </p>
                    <p className="text-xs text-slate-400">
                      AI &amp; Marketing Creators
                    </p>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-slate-300">
                  Focused on AI story videos, ad campaigns, and social media
                  content that builds brand awareness and leads.
                </p>
              </div>
            </div>
          </section>
        </PageSection>
      </>
    </Layout>
  );
}
