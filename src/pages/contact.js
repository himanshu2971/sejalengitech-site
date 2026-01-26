// src/pages/services.js  (NOTE: this is currently your Contact page)
import Head from "next/head";
import { useState } from "react";
import PageSection from "../components/PageSection";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ContactPage() {
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
    <>
      <Head>
        <title>Contact | Sejal Engitech</title>
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
              src="/images/contact/contact-hero.png"
              alt="Contact hero background"
              fill
              priority
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/10 via-slate-950/55 to-slate-950/85" />
          </div>

          <div className="relative px-5 py-10 md:px-10 md:py-12">
            <p className="inline-flex items-center rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Contact
            </p>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold">Contact us</h1>
            <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
              Have a project, training need, or digital campaign in mind? Reach
              out using the form below or via phone/WhatsApp.
            </p>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr,1fr]">
          {/* LEFT: form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
            >
              <Field
                label="Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              <Field
                label="Phone / WhatsApp"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 ..."
              />

              <div>
                <label className="block text-sm mb-1 text-slate-200/80">
                  How can we help?
                </label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-slate-950/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 transition"
                  placeholder="Tell us about your requirement"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-full bg-cyan-300 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:bg-cyan-200 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Submit Enquiry"}
              </button>

              {status === "success" && (
                <p className="text-xs text-emerald-200 mt-2">
                  Thank you! Your enquiry has been sent.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-rose-200 mt-2">
                  Something went wrong. Please try again later.
                </p>
              )}
            </form>
          </motion.div>

          {/* RIGHT: info card */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 text-sm md:text-base shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
          >
            <h2 className="text-lg font-semibold mb-3 text-cyan-200">
              Direct contact
            </h2>

            <p className="text-slate-100/90">
              Phone / WhatsApp:{" "}
              <a href="tel:+919001207105" className="text-cyan-200 hover:underline">
                +91 9001207105
              </a>
            </p>

            <p className="text-slate-100/90 mt-2">
              Email:{" "}
              <a
                href="mailto:info.sejalengitech@gmail.com"
                className="text-cyan-200 hover:underline"
              >
                info.sejalengitech@gmail.com
              </a>
            </p>

            <p className="text-slate-100/90 mt-4">
              Address: Sejal Engitech / Alambana, 305, KPR Habitat, Kasavanahalli,
              Bengaluru, Karnataka, India – 560035
            </p>

            <p className="text-xs text-slate-200/70 mt-4">
              We usually respond to enquiries within 24–48 business hours.
            </p>
          </motion.aside>
        </div>
      </PageSection>
    </>
  );
}

function Field({ label, name, type, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-slate-200/80">{label}</label>
      <input
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-xl bg-slate-950/50 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 transition"
        placeholder={placeholder}
      />
    </div>
  );
}
