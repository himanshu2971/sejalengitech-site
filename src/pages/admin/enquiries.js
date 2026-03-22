import { useState, useEffect } from "react";
import Head from "next/head";
import SiteAdminLayout from "@/components/SiteAdminLayout";
import { isAdminAuthed } from "@/lib/adminAuth";
import { MongoClient } from "mongodb";

export default function AdminSiteEnquiries({ enquiries: initial }) {
  const [enquiries] = useState(initial ?? []);

  return (
    <SiteAdminLayout title="Site Enquiries">
      <Head><title>Enquiries | Sejal Admin</title></Head>
      <div className="p-4 md:p-8">
        <h1 className="text-xl font-black text-slate-100 mb-6">📬 Main Site Enquiries</h1>
        {enquiries.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-3">📬</p>
            <p className="font-semibold">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div key={e._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{e.name || "—"}</p>
                    <p className="text-xs text-slate-400">{e.email || e.companyEmail || "—"}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 shrink-0">{e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-IN") : ""}</p>
                </div>
                {e.company && <p className="text-xs text-slate-500 mb-1">Company: {e.company}</p>}
                {e.service && <p className="text-xs text-amber-400 mb-1">Service: {e.service}</p>}
                {e.message && <p className="text-xs text-slate-300 border-t border-white/5 pt-2 mt-2">{e.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </SiteAdminLayout>
  );
}

AdminSiteEnquiries.noLayout = true;

export async function getServerSideProps({ req }) {
  if (!isAdminAuthed(req)) return { redirect: { destination: "/academy/admin/login", permanent: false } };
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const col = client.db(process.env.MONGODB_DB).collection("home_enquiries");
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(100).toArray();
    await client.close();
    return { props: { enquiries: JSON.parse(JSON.stringify(docs)) } };
  } catch {
    return { props: { enquiries: [] } };
  }
}
