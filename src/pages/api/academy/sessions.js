import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .order("scheduled_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST") {
    const { title, description, meet_url, scheduled_at, duration_mins, course_id, is_recorded, recording_url } = req.body;
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .insert([{ title, description, meet_url, scheduled_at, duration_mins, course_id, is_recorded, recording_url }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, title, description, meet_url, scheduled_at, duration_mins, course_id, is_recorded, recording_url } = req.body;
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .update({ title, description, meet_url, scheduled_at, duration_mins, course_id, is_recorded, recording_url })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await supabaseAdmin.from("sessions").delete().eq("id", id);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
