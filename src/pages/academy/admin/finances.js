import { useState } from "react";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STATUS_COLORS = {
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  pending:   "border-amber-500/30 bg-amber-500/10 text-amber-200",
  refunded:  "border-red-500/30 bg-red-500/10 text-red-300",
};

export default function AdminFinances({ purchases: initial }) {
  const [purchases, setPurchases] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  const filtered = filter === "all" ? purchases : purchases.filter((p) => p.status === filter);

  const totalRevenue = purchases.filter((p) => p.status === "completed").reduce((a, p) => a + (p.amount ?? 0), 0);
  const totalPending = purchases.filter((p) => p.status === "pending").reduce((a, p) => a + (p.amount ?? 0), 0);
  const totalRefunded = purchases.filter((p) => p.status === "refunded").reduce((a, p) => a + (p.amount ?? 0), 0);

  const thisMonth = purchases.filter((p) => {
    const d = new Date(p.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && p.status === "completed";
  }).reduce((a, p) => a + (p.amount ?? 0), 0);

  async function updateStatus(id, status) {
    setUpdating(id);
    const res = await fetch("/api/academy/finances", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setPurchases((ps) => ps.map((p) => p.id === id ? { ...p, status } : p));
    }
    setUpdating(null);
  }

  return (
    <AdminLayout title="Finances">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-lg font-semibold mb-6">Finances & Revenue</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: "text-emerald-300" },
            { label: "This Month", value: `₹${thisMonth.toLocaleString()}`, icon: "📅", color: "text-cyan-300" },
            { label: "Pending", value: `₹${totalPending.toLocaleString()}`, icon: "⏳", color: "text-amber-300" },
            { label: "Refunded", value: `₹${totalRefunded.toLocaleString()}`, icon: "↩️", color: "text-red-300" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xl mb-1">{c.icon}</p>
              <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "completed", "pending", "refunded"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs transition capitalize border ${
                filter === s
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {s} ({s === "all" ? purchases.length : purchases.filter((p) => p.status === s).length})
            </button>
          ))}
        </div>

        {/* Purchases table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[1fr,1fr,80px,100px,120px] gap-3 px-4 py-2.5 border-b border-white/10 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            <span>Student</span><span>Course</span><span>Amount</span><span>Status</span><span>Date</span>
          </div>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">No transactions found.</div>
          )}

          {filtered.map((p, i) => (
            <div
              key={p.id}
              className={`px-4 py-3 flex flex-col md:grid md:grid-cols-[1fr,1fr,80px,100px,120px] gap-2 md:gap-3 md:items-center text-sm ${
                i > 0 ? "border-t border-white/[0.06]" : ""
              }`}
            >
              <p className="text-slate-300 truncate text-xs md:text-sm">{p.student_email ?? "—"}</p>
              <p className="text-slate-400 truncate text-xs">{p.courses?.title ?? "—"}</p>
              <p className="text-slate-300 text-xs font-medium">
                {p.amount ? `₹${p.amount}` : <span className="text-slate-600">Free</span>}
              </p>
              <span className={`text-[10px] rounded-full border px-2 py-0.5 w-fit capitalize ${STATUS_COLORS[p.status] ?? "border-white/10 text-slate-400"}`}>
                {p.status}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500">
                  {new Date(p.created_at).toLocaleDateString("en-IN")}
                </span>
                {p.status !== "refunded" && p.amount > 0 && (
                  <button
                    onClick={() => updateStatus(p.id, "refunded")}
                    disabled={updating === p.id}
                    className="text-[10px] border border-red-500/20 text-red-400 rounded px-1.5 py-0.5 hover:bg-red-500/10 transition disabled:opacity-40"
                  >
                    Refund
                  </button>
                )}
                {p.status === "pending" && (
                  <button
                    onClick={() => updateStatus(p.id, "completed")}
                    disabled={updating === p.id}
                    className="text-[10px] border border-emerald-500/20 text-emerald-400 rounded px-1.5 py-0.5 hover:bg-emerald-500/10 transition disabled:opacity-40"
                  >
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

AdminFinances.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };

  const { data: purchases } = await supabaseAdmin
    .from("purchases")
    .select("*, courses(title, price)")
    .order("created_at", { ascending: false });

  // Get student emails
  const userIds = [...new Set((purchases ?? []).map((p) => p.user_id))];
  let emailMap = {};
  if (userIds.length > 0) {
    const { data: users } = await supabaseAdmin.schema("auth").from("users").select("id, email").in("id", userIds);
    (users ?? []).forEach((u) => { emailMap[u.id] = u.email; });
  }

  const enriched = (purchases ?? []).map((p) => ({
    ...p,
    student_email: emailMap[p.user_id] ?? null,
  }));

  return { props: { purchases: enriched } };
}
