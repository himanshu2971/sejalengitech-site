import Head from "next/head";
import Link from "next/link";
import { PageSection } from "@/components/PageSection";
import SEO from "@/components/seo/SEO";
import { MongoClient } from "mongodb";

export default function BlogIndex({ posts }) {
  return (
    <>
      <SEO title="Blog | Sejal Engitech" description="Insights on IT services, tech trends, and digital transformation from the Sejal Engitech team." />
      <Head><title>Blog | Sejal Engitech</title></Head>

      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-8 relative">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">Our Blog</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Insights & <span className="text-cyan-400">Ideas</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              Tech tips, industry insights, and updates from the Sejal Engitech team.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-5xl mb-4">✍</p>
              <p className="text-lg font-semibold">No posts yet</p>
              <p className="text-sm">Check back soon — we{"'"}re working on some great content.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`}
                  className="group rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all overflow-hidden flex flex-col">
                  {post.cover_image && (
                    <div className="relative h-48 overflow-hidden bg-slate-800">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {(post.tags ?? []).length > 0 && (
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 rounded-full px-2.5 py-0.5">{t}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-base font-black text-white leading-snug mb-2 group-hover:text-cyan-300 transition">{post.title}</h2>
                    <p className="text-sm text-slate-400 line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-slate-500">{post.author || "Sejal Engitech"}</span>
                      <span className="text-xs text-slate-600">{post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const posts = await client.db(process.env.MONGODB_DB).collection("blog_posts")
      .find({ published: true }).sort({ published_at: -1 }).toArray();
    await client.close();
    return { props: { posts: JSON.parse(JSON.stringify(posts)) }, revalidate: 60 };
  } catch {
    return { props: { posts: [] }, revalidate: 60 };
  }
}
