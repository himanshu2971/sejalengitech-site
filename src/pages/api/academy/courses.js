import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert([req.body])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const { data, error } = await supabaseAdmin
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
