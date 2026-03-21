import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

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
    const { error } = await supabaseAdmin.from("enquiries").update({ status, reply }).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("enquiries").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
