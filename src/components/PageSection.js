// src/components/PageSection.js
export default function PageSection({ children }) {
  return (
    <section className="px-3 md:px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Glass panel wrapper */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]">
          <div className="px-4 py-8 md:px-8 md:py-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
