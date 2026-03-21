import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  // Public GET for active announcements (students see them)
  if (req.method === "GET" && !isAdminAuthed(req)) {
    const { data } = await supabaseAdmin
      .from("announcements")
      .select("id, title, message, type")
      .eq("active", true)
      .order("created_at", { ascending: false });
    return res.status(200).json(data ?? []);
  }

  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data } = await supabaseAdmin
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST") {
    const { title, message, type } = req.body;
    const { data, error } = await supabaseAdmin
      .from("announcements")
      .insert([{ title, message, type: type ?? "info", active: true }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, title, message, type, active } = req.body;
    const { error } = await supabaseAdmin
      .from("announcements")
      .update({ title, message, type, active })
      .eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("announcements").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
