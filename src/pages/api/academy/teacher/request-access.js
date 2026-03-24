import { supabaseAdmin } from "@/lib/supabaseAdmin";

// POST — called right after teacher signup to mark them as pending_teacher
// Auth: Bearer token from the new Supabase session
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Invalid session" });

  const { display_name } = req.body ?? {};

  // Check if already a teacher or pending — don't downgrade
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (existing?.role === "teacher") {
    return res.status(200).json({ ok: true, already: true });
  }

  const { error: upsertErr } = await supabaseAdmin
    .from("profiles")
    .upsert({
      user_id: user.id,
      display_name: display_name?.trim() || null,
      role: "pending_teacher",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertErr) return res.status(500).json({ error: upsertErr.message });
  return res.status(200).json({ ok: true });
}
