/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.sejalengitech.in",
  generateRobotsTxt: true,
  exclude: [
    "/academy/admin",
    "/academy/admin/*",
    "/api/*",
  ],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/academy/admin", "/api"] },
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path.startsWith("/academy/courses/") ? "weekly"
      : path === "/" ? "weekly"
      : "monthly",
    priority: path === "/" ? 1.0
      : path.startsWith("/academy/courses/") ? 0.9
      : path === "/academy" ? 0.85
      : path.startsWith("/academy") ? 0.7
      : 0.6,
    lastmod: new Date().toISOString(),
  }),
};
