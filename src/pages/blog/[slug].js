import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { MongoClient } from "mongodb";

export default function BlogPost({ post }) {
  if (!post) return null;

  return (
    <>
      <Head>
        <title>{post.title} | Sejal Engitech Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
      </Head>

      <article className="min-h-screen">
        {/* Hero */}
        <div className="relative">
          {post.cover_image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>
          )}
          <div className={`max-w-3xl mx-auto px-4 sm:px-8 ${post.cover_image ? "relative -mt-24 pb-8" : "py-16"}`}>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 mb-6 transition">
              ← Back to Blog
            </Link>
            {(post.tags ?? []).length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {post.tags.map((t) => (
                  <span key={t} className="text-[10px] font-bold text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 rounded-full px-2.5 py-0.5">{t}</span>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{post.author || "Sejal Engitech"}</span>
              <span>·</span>
              <span>{post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-20">
          <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:text-white prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-code:text-cyan-300 prose-code:bg-white/[0.05] prose-code:rounded prose-code:px-1 prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-white/10">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
            <Link href="/blog" className="text-sm text-cyan-400 hover:text-cyan-300 transition">← All posts</Link>
            <Link href="/contact" className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition">
              Get in touch
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const posts = await client.db(process.env.MONGODB_DB).collection("blog_posts")
      .find({ published: true }, { projection: { slug: 1 } }).toArray();
    await client.close();
    return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: "blocking" };
  } catch {
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const post = await client.db(process.env.MONGODB_DB).collection("blog_posts")
      .findOne({ slug: params.slug, published: true });
    await client.close();
    if (!post) return { notFound: true };
    return { props: { post: JSON.parse(JSON.stringify(post)) }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}
