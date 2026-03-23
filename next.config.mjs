import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  turbopack: {}, // Tells Next.js 16 we're Turbopack-aware (suppresses warning from next-pwa's webpack config)
  async headers() {
    return [
      {
        source: "/api/academy/courses",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" }],
      },
      {
        source: "/api/academy/announcements",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=30, stale-while-revalidate=120" }],
      },
      {
        source: "/api/academy/banners",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=30, stale-while-revalidate=120" }],
      },
      {
        source: "/api/blog",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=120, stale-while-revalidate=600" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      // Supabase storage (course thumbnails, etc.)
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      // Common image hosts
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default withPWA(nextConfig);
