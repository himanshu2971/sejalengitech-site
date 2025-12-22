import Head from "next/head";
import { useState } from "react";
import Layout from "../components/Layout";
import PageSection from "../components/PageSection";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <>
        <Head>
          <title>Contact | Sejal Engitech</title>
        </Head>

        <PageSection>
          {/* Header */}
          <div className="mb-8">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Contact
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold">Contact us</h1>
            <p className="mt-3 text-slate-300 text-sm md:text-base max-w-3xl">
              Have a project, training need, or digital campaign in mind? Reach
              out to us using the form below or via phone/WhatsApp.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
            {/* LEFT: form */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
              >
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Phone / WhatsApp</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    placeholder="+91 ..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    How can we help?
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                    placeholder="Tell us about your requirement"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:bg-cyan-300 transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Submit Enquiry"}
                </button>

                {status === "success" && (
                  <p className="text-xs text-emerald-300 mt-2">
                    Thank you! Your enquiry has been sent.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-xs text-rose-300 mt-2">
                    Something went wrong. Please try again later.
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT: info card */}
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm md:text-base">
              <h2 className="text-lg font-semibold mb-3 text-cyan-300">
                Direct contact
              </h2>
              <p className="text-slate-200">
                Phone / WhatsApp:{" "}
                <a
                  href="tel:+919001207105"
                  className="text-cyan-300 hover:underline"
                >
                  +91 9001207105
                </a>
              </p>
              <p className="text-slate-200">
                Email:{" "}
                <a
                  href="mailto:himanshushourabh@gmail.com"
                  className="text-cyan-300 hover:underline"
                >
                  himanshushourabh@gmail.com
                </a>
              </p>
              <p className="text-slate-200 mt-3">
                Address: Sejal Engitech / Alambana, 305, KPR Habitat,
                Kasavanahalli, Bengaluru, Karnataka, India – 560035
              </p>
              <p className="text-xs text-slate-400 mt-4">
                We usually respond to enquiries within 24–48 business hours.
              </p>
            </aside>
          </div>
        </PageSection>
      </>
    </Layout>
  );
}
