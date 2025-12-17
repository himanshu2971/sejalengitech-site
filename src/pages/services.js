import Head from "next/head";
import Layout from "../components/Layout";

export default function Services() {
  return (
    <Layout>
      <>
        <Head>
          <title>Services | Sejal Engitech & Alambana</title>
        </Head>

        <main className="min-h-screen bg-slate-950 text-slate-50">
          <div className="max-w-5xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Our services
              </p>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                Services under Sejal Engitech &amp; Alambana
              </h1>
              <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
                From core IT services and automation to training and digital
                marketing, we provide end-to-end support for growing businesses.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Sejal Engitech */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg md:text-xl font-semibold text-cyan-300 mb-2">
                  Sejal Engitech Private Limited – IT Services
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mb-3">
                  Engineering-focused IT and infrastructure support to keep your
                  operations reliable, secure, and scalable.
                </p>
                <div className="grid gap-2 text-sm md:text-base text-slate-200 md:grid-cols-2">
                  <span>Software Development</span>
                  <span>App Development – School Bus App</span>
                  <span>Web Designing</span>
                  <span>Video for Ads or YouTube</span>
                  <span>Networking</span>
                  <span>Hardware and Software Installation</span>
                  <span>Cyber Security</span>
                </div>
              </section>

              {/* Alambana Edutech / Academy */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg md:text-xl font-semibold text-emerald-300 mb-2">
                  IT Training Institute – Alambana Edutech / Alambana Academy
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mb-3">
                  Practical, industry-oriented training designed to build skills
                  for the next generation of professionals.
                </p>
                <div className="grid gap-2 text-sm md:text-base text-slate-200 md:grid-cols-2">
                  <span>AI – Basic and Advanced</span>
                  <span>Data Analysis – Basic and Advanced</span>
                  <span>Machine Learning – Basic and Advanced</span>
                  <span>Robotics</span>
                  <span>Python</span>
                  <span>Excel</span>
                  <span>Animation – Basic and Advanced</span>
                  <span>Cyber Security</span>
                  <span>Web Designing</span>
                  <span>Graphic Designing</span>
                  <span>Accounting</span>
                </div>
              </section>

              {/* Alambana Digital */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg md:text-xl font-semibold text-fuchsia-300 mb-2">
                  Alambana Digital
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mb-3">
                  Creative digital storytelling and performance marketing to
                  make your brand visible and memorable.
                </p>
                <div className="grid gap-2 text-sm md:text-base text-slate-200">
                  <span>AI Story Videos – start with short story videos</span>
                  <span>
                    Digital Marketing – starting with SR Healthcare
                    advertisement
                  </span>
                </div>
              </section>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}
