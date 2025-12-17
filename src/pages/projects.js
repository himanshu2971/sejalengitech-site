import Head from "next/head";
import Layout from "../components/Layout";

export default function Projects() {
  return (
    <Layout>
      <>
        <Head>
          <title>Projects | Sejal Engitech</title>
        </Head>

        <main className="min-h-screen bg-slate-950 text-slate-50">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-4">Projects &amp; Portfolio</h1>
            <p className="text-slate-300 text-sm md:text-base mb-6">
              Here are a few sample projects that reflect the kind of work we do
              for infrastructure, manufacturing, logistics, and future-ready
              businesses.
            </p>

            <div className="space-y-5 text-sm md:text-base text-slate-200">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
                <h2 className="font-semibold mb-1">
                  Smart Factory Automation Upgrade
                </h2>
                <p className="text-slate-300">
                  Designed and implemented a PLC-based control system for a
                  mid-sized production line, reducing manual errors by 30%.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
                <h2 className="font-semibold mb-1">
                  Enterprise Resource Planning (ERP) Implementation
                </h2>
                <p className="text-slate-300">
                  Rolled out a custom cloud-based ERP solution for a logistics
                  firm to consolidate operations and improve data visibility.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60">
                <h2 className="font-semibold mb-1">
                  Renewable Energy Feasibility Study (Planned)
                </h2>
                <p className="text-slate-300">
                  Conducting a comprehensive technical and economic assessment
                  for a 5MW solar power installation on an industrial park
                  rooftop.
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}
