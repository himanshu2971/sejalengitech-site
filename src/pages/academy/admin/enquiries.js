import { useState } from "react";
import AdminLayout from "@/components/academy/AdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const STATUS_COLORS = {
  open:    "border-amber-500/30 bg-amber-500/10 text-amber-200",
  replied: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  closed:  "border-white/10 text-slate-500",
};

export default function AdminEnquiries({ enquiries: initial }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(null);

  const filtered = filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  async function handleReply(id) {
    setSaving(id);
    await fetch("/api/academy/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "replied", reply }),
    });
    setEnquiries((es) => es.map((e) => e.id === id ? { ...e, status: "replied", reply } : e));
    setReply("");
    setExpanded(null);
    setSaving(null);
  }

  async function handleClose(id) {
    await fetch("/api/academy/enquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "closed" }),
    });
    setEnquiries((es) => es.map((e) => e.id === id ? { ...e, status: "closed" } : e));
  }

  async function handleDelete(id) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/academy/enquiries?id=${id}`, { method: "DELETE" });
    setEnquiries((es) => es.filter((e) => e.id !== id));
  }

  const openCount = enquiries.filter((e) => e.status === "open").length;

  return (
    <AdminLayout title="Enquiries">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-semibold">Enquiries & Support</h1>
            {openCount > 0 && (
              <p className="text-xs text-amber-300 mt-0.5">{openCount} open — needs attention</p>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["all", "open", "replied", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs capitalize border transition ${
                filter === s
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {s} ({s === "all" ? enquiries.length : enquiries.filter((e) => e.status === s).length})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center text-slate-400 text-sm">
              No enquiries found.
            </div>
          )}
          {filtered.map((e) => (
            <div key={e.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button
                onClick={() => { setExpanded(expanded === e.id ? null : e.id); setReply(e.reply ?? ""); }}
                className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/[0.02] transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-100">{e.subject || "No subject"}</p>
                    <span className={`text-[10px] rounded-full border px-2 py-0.5 ${STATUS_COLORS[e.status]}`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {e.name ? `${e.name} · ` : ""}{e.email} · {new Date(e.created_at).toLocaleDateString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{e.message}</p>
                </div>
                <span className="text-slate-500 text-xs shrink-0 mt-0.5">{expanded === e.id ? "▲" : "▼"}</span>
              </button>

              {expanded === e.id && (
                <div className="border-t border-white/10 px-4 py-4 bg-white/[0.02] flex flex-col gap-4">
                  {/* Message */}
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Message</p>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap">{e.message}</p>
                  </div>

                  {/* Previous reply */}
                  {e.reply && (
                    <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.04] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-sky-400 uppercase tracking-wider">Reply</p>
                        {e.replied_by && (
                          <p className="text-[10px] text-slate-500">
                            by <span className="text-slate-400">{e.replied_by}</span>
                            {e.replied_at && <> · {new Date(e.replied_at).toLocaleDateString("en-IN")}</>}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-slate-200 whitespace-pre-wrap">{e.reply}</p>
                    </div>
                  )}

                  {/* Reply form */}
                  {e.status !== "closed" && (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={3}
                        value={reply}
                        onChange={(ev) => setReply(ev.target.value)}
                        placeholder="Type your reply…"
                        className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/60 transition resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(e.id)}
                          disabled={!reply.trim() || saving === e.id}
                          className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 px-4 py-1.5 text-xs font-semibold text-slate-950 transition"
                        >
                          {saving === e.id ? "Sending…" : "Send Reply"}
                        </button>
                        <button
                          onClick={() => handleClose(e.id)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition ml-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  {e.status === "closed" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

AdminEnquiries.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  const { data } = await supabaseAdmin.from("enquiries").select("*").order("created_at", { ascending: false });
  return { props: { enquiries: data ?? [] } };
}
