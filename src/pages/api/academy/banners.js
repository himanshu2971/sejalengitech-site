import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  // Public GET for active banners
  if (req.method === "GET" && !isAdminAuthed(req)) {
    const { data } = await supabaseAdmin
      .from("banners")
      .select("id, title, subtitle, cta_text, cta_url, badge, accent")
      .eq("active", true)
      .order("order", { ascending: true });
    return res.status(200).json(data ?? []);
  }

  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data } = await supabaseAdmin
      .from("banners")
      .select("*")
      .order("order", { ascending: true });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST") {
    const { title, subtitle, cta_text, cta_url, badge, accent, active, order } = req.body;
    const { data, error } = await supabaseAdmin
      .from("banners")
      .insert([{ title, subtitle, cta_text, cta_url, badge, accent, active: active ?? true, order: order ?? 0 }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, ...fields } = req.body;
    const { error } = await supabaseAdmin.from("banners").update(fields).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("banners").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
