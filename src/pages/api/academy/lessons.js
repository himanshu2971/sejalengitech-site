import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { data, error } = await supabaseAdmin
      .from("lessons")
      .insert([req.body])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, ...updates } = req.body;
    const { data, error } = await supabaseAdmin
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const { error } = await supabaseAdmin.from("lessons").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
