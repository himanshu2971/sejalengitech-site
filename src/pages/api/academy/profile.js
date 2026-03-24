import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

// Verify student session via Bearer token sent from client
async function getUser(req) {
  const auth = req.headers.authorization ?? "";
  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data?.user ?? null;
}

export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const uid = user.id;

  // GET — fetch profile + score summary
  if (req.method === "GET") {
    const [profileRes, attemptsRes, purchasesRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").eq("user_id", uid).single(),
      supabaseAdmin.from("quiz_attempts").select("score, passed").eq("user_id", uid),
      supabaseAdmin.from("purchases").select("id").eq("user_id", uid),
    ]);

    const profile = profileRes.data ?? { user_id: uid, display_name: null, avatar_url: null, phone: null, bio: null };
    const attempts = attemptsRes.data ?? [];
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / attempts.length)
      : 0;
    const passRate = attempts.length
      ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100)
      : 0;

    return res.status(200).json({
      profile,
      stats: {
        quizzes: attempts.length,
        avgScore,
        passRate,
        courses: purchasesRes.data?.length ?? 0,
      },
    });
  }

  // PUT — update profile fields
  if (req.method === "PUT") {
    const { display_name, phone, bio, student_type, grade_level } = req.body ?? {};
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: uid, display_name, phone, bio, student_type: student_type || null, grade_level: grade_level || null, updated_at: new Date().toISOString() });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  // POST — update avatar URL (after client uploads to Supabase Storage)
  if (req.method === "POST") {
    const { avatar_url } = req.body ?? {};
    if (!avatar_url) return res.status(400).json({ error: "avatar_url required" });
    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: uid, avatar_url, updated_at: new Date().toISOString() });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
