const COOKIE_NAME = "academy_admin";

export function isAdminAuthed(req) {
  return req.cookies?.[COOKIE_NAME] === process.env.ACADEMY_ADMIN_KEY;
}

export function setAdminCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${process.env.ACADEMY_ADMIN_KEY}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${secure}`
  );
}

export function clearAdminCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`
  );
}
