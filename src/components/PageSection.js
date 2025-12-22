// components/PageSection.js
export default function PageSection({ children }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-2 py-8">{children}</div>
    </main>
  );
}
