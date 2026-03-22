import { setAdminCookie, clearAdminCookie, isAdminAuthed, getAdminEmail } from "@/lib/adminAuth";

const ALLOWED_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export default function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body ?? {};

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const normalizedEmail = email.trim().toLowerCase();

    if (!ALLOWED_EMAILS.includes(normalizedEmail))
      return res.status(401).json({ error: "This email is not an admin account." });

    if (password !== process.env.ACADEMY_ADMIN_KEY)
      return res.status(401).json({ error: "Wrong password." });

    setAdminCookie(res, normalizedEmail);
    return res.status(200).json({ ok: true, email: normalizedEmail });
  }

  if (req.method === "DELETE") {
    clearAdminCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "GET") {
    if (!isAdminAuthed(req)) return res.status(401).json({ error: "Not authenticated" });
    return res.status(200).json({ email: getAdminEmail(req) });
  }

  res.status(405).end();
}
