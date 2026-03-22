const COOKIE_NAME = "academy_admin";

function parseCookie(req) {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return null;
  try {
    return decodeURIComponent(raw).split("|");
  } catch {
    return raw.split("|");
  }
}

export function isAdminAuthed(req) {
  const parts = parseCookie(req);
  if (!parts || parts.length !== 2) return false;
  return parts[1] === process.env.ACADEMY_ADMIN_KEY;
}

export function getAdminEmail(req) {
  const parts = parseCookie(req);
  return parts?.length === 2 ? parts[0] : null;
}

export function setAdminCookie(res, email) {
  const value = `${email}|${process.env.ACADEMY_ADMIN_KEY}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${secure}`
  );
}

export function clearAdminCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );
}
