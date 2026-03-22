import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed, getAdminEmail } from "@/lib/adminAuth";
import { MongoClient } from "mongodb";

let _mongo = global._mongoLogs;
if (!_mongo) _mongo = global._mongoLogs = { client: null, promise: null };

async function logAction(admin_email, action, entity, entity_id, details) {
  try {
    if (!_mongo.client) {
      if (!_mongo.promise) _mongo.promise = MongoClient.connect(process.env.MONGODB_URI).then((c) => { _mongo.client = c; return c; });
      await _mongo.promise;
    }
    await _mongo.client.db(process.env.MONGODB_DB).collection("admin_logs").insertOne({ admin_email, action, entity, entity_id, details, timestamp: new Date() });
  } catch { /* non-critical */ }
}

export default async function handler(req, res) {
  // Students can POST (submit enquiry) without auth
  // Admin needs auth for GET / PUT / DELETE

  if (req.method === "POST") {
    const { name, email, subject, message } = req.body;
    if (!email || !message) return res.status(400).json({ error: "email and message required" });
    const { data, error } = await supabaseAdmin
      .from("enquiries")
      .insert([{ name, email, subject, message }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { status } = req.query;
    let query = supabaseAdmin.from("enquiries").select("*").order("created_at", { ascending: false });
    if (status && status !== "all") query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "PUT") {
    const { id, status, reply } = req.body;
    const adminEmail = getAdminEmail(req);
    const updates = { status, reply };
    if (reply) {
      updates.replied_by = adminEmail;
      updates.replied_at = new Date().toISOString();
    }
    const { error } = await supabaseAdmin.from("enquiries").update(updates).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    await logAction(adminEmail, "replied_enquiry", "enquiry", id, `Status: ${status}`);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("enquiries").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
