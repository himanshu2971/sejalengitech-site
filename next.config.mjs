/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
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

export default nextConfig;
