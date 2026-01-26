import { useState } from "react";
import { motion } from "framer-motion";
import { REVEAL } from "@/components/motion/reveal";

export default function HomeEnquiry() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    region: "",
    inquiryType: "",
    message: "",
    companyWebsite: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (form.companyWebsite) return;

    setLoading(true);
    try {
      const res = await fetch("/api/homeEnquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.organization,
          phone: form.phone,
          region: form.region,
          inquiryType: form.inquiryType,
          message: form.message,
        }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          organization: "",
          phone: "",
          region: "",
          inquiryType: "",
          message: "",
          companyWebsite: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-20">
      <motion.div
        {...REVEAL}
        className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-10 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)]"
      >
        <h2 className="text-2xl md:text-4xl font-bold">
          Get answers to your questions
        </h2>
        <p className="mt-3 text-slate-200/80 text-sm md:text-base max-w-3xl">
          Our clients turn to us to help them reimagine ways of working with technology.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            name="companyWebsite"
            value={form.companyWebsite}
            onChange={onChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name*" name="name" value={form.name} onChange={onChange} required />
            <Field label="Email*" name="email" type="email" value={form.email} onChange={onChange} required />
            <Field label="Organization*" name="organization" value={form.organization} onChange={onChange} required />
            <Field label="Contact Number*" name="phone" value={form.phone} onChange={onChange} required />

            <Select
              label="Region*"
              name="region"
              value={form.region}
              onChange={onChange}
              required
              options={["India", "Asia", "Middle East", "Europe", "USA/Canada", "Other"]}
            />
            <Select
              label="Inquiry Type*"
              name="inquiryType"
              value={form.inquiryType}
              onChange={onChange}
              required
              options={[
                "Software Development",
                "App Development",
                "Website",
                "Networking / Installation",
                "Cyber Security",
                "Other",
              ]}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-200/80">Message</label>
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={onChange}
              className="w-full rounded-2xl bg-slate-950/30 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 transition"
              placeholder="Tell us about your requirement"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-cyan-300 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:bg-cyan-200 transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            {status === "success" && (
              <p className="text-sm text-emerald-200">Thanks! We’ll contact you shortly.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-rose-200">Something went wrong. Try again later.</p>
            )}
          </div>
        </form>
      </motion.div>
    </section>
  );
}

function Field({ label, name, value, onChange, type = "text", required }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-slate-200/80">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl bg-slate-950/30 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 transition"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, required, options }) {
  return (
    <div>
      <label className="block text-sm mb-1 text-slate-200/80">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl bg-slate-950/30 border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 transition"
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-slate-900">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
