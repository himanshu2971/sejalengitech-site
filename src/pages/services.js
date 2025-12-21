import Head from "next/head";
import Layout from "../components/Layout";

export default function Services() {
  return (
    <Layout>
      <>
        <Head>
          <title>IT Services | Sejal Engitech</title>
        </Head>

        <main className="min-h-screen bg-slate-950 text-slate-50">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <div className="mb-8">
              <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                IT Services
              </p>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                IT Services by Sejal Engitech
              </h1>
              <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
                Reliable development, deployment, and support for businesses—
                designed to be secure, scalable, and easy to maintain.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">Software Development</h3>
    <p className="text-slate-300 text-sm">
      Custom software to automate workflows, reduce manual effort, and improve reliability.
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">App Development</h3>
    <p className="text-slate-300 text-sm">
      Mobile apps built for speed, usability, and real business outcomes (including your School Bus App).
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">Web Designing</h3>
    <p className="text-slate-300 text-sm">
      Modern, responsive websites that look premium and convert visitors into leads.
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">Networking</h3>
    <p className="text-slate-300 text-sm">
      Secure, stable networks with clean setup, monitoring guidance, and best practices.
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">Hardware & Software Installation</h3>
    <p className="text-slate-300 text-sm">
      Smooth installations, upgrades, and troubleshooting for office and small enterprise setups.
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
    <h3 className="font-semibold text-cyan-300 mb-1">Cyber Security</h3>
    <p className="text-slate-300 text-sm">
      Basic hardening, access control, backups, and security checks to reduce business risk.
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 md:col-span-2">
    <h3 className="font-semibold text-cyan-300 mb-1">Video for Ads / YouTube</h3>
    <p className="text-slate-300 text-sm">
      Product explainers, promos, and business videos that support your marketing and branding.
    </p>
    <p className="text-xs text-slate-400 mt-1">
      For full digital marketing packages, visit alambanatech.com.
    </p>
  </div>
</div>


            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h2 className="text-lg font-semibold mb-2 text-emerald-300">
                Looking for Training or Digital Marketing?
              </h2>
              <p className="text-slate-300 text-sm md:text-base mb-4">
                Visit our Alambana website for complete details, packages, and
                offerings.
              </p>
              <a
                href="https://alambanatech.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex px-5 py-2.5 rounded-full bg-emerald-300 text-slate-950 font-semibold text-sm hover:bg-emerald-200 transition"
              >
                Go to alambanatech.com
              </a>
            </div>
          </div>
        </main>
      </>
    </Layout>
  );
}
