import { setAdminCookie, clearAdminCookie } from "@/lib/adminAuth";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { password } = req.body;
    if (password === process.env.ACADEMY_ADMIN_KEY) {
      setAdminCookie(res);
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ error: "Wrong password" });
  }

  if (req.method === "DELETE") {
    clearAdminCookie(res);
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
