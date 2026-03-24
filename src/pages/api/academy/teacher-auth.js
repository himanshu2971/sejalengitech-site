import { getTeacherSession } from "@/lib/teacherAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getTeacherSession(req);
  if (!session.isTeacher) {
    return res.status(401).json({ error: "Not a teacher" });
  }

  return res.status(200).json({
    isTeacher: true,
    userId: session.userId,
    email: session.email,
  });
}
