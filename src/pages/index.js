import Head from "next/head";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <>
        <Head>
          <title>Sejal Engitech | Alambana Tech</title>
          <meta
            name="description"
            content="IT Services, Training, and Digital Marketing by Sejal Engitech and Alambana Tech."
          />
        </Head>

        <main className="min-h-screen bg-slate-950 text-slate-50">
          {/* Hero section */}
          <section className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
            <div>
              <p className="text-sm font-semibold text-cyan-300 uppercase tracking-[0.2em] mb-3">
                IT • Training • Digital
              </p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                We simplify your business needs
                <span className="block text-cyan-300">
                  and help your business prosper.
                </span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base mb-6">
                We are a bunch of IT and Marketing graduates here to simplify
                your business needs and help your business prosper. We provide
                all kinds of services related to IT and Digital Marketing,
                including handling your social media accounts and posting on
                your behalf.
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                <a
                  href="/contact"
                  className="px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 transition"
                >
                  Contact / Get Quote
                </a>
                <a
                  href="/services"
                  className="px-5 py-2.5 rounded-full border border-slate-600 text-sm hover:border-cyan-400 hover:text-cyan-300 transition"
                >
                  View Services
                </a>
              </div>

              <p className="text-xs text-slate-400">
                Primary actions: Enquiry form • Call / WhatsApp • Email RFQ
              </p>
            </div>

            {/* Right side: three entities */}
            <div className="grid gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="text-sm font-semibold text-cyan-300 mb-1">
                  Sejal Engitech Private Limited
                </h2>
                <p className="text-xs text-slate-300">
                  IT services: software and app development, web design, video,
                  networking, hardware and software installation, and cyber
                  security.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="text-sm font-semibold text-emerald-300 mb-1">
                  Alambana Edutech / Alambana Academy
                </h2>
                <p className="text-xs text-slate-300">
                  Training institute: AI, data analysis, machine learning,
                  robotics, Python, Excel, animation, cyber security, web and
                  graphic design, and accounting.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h2 className="text-sm font-semibold text-fuchsia-300 mb-1">
                  Alambana Digital
                </h2>
                <p className="text-xs text-slate-300">
                  Digital work: AI story videos and digital marketing, starting
                  with campaigns like SR Healthcare advertisement.
                </p>
              </div>
            </div>
          </section>
        </main>
      </>
    </Layout>
  );
}
