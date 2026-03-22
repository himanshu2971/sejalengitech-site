import { MongoClient, ObjectId } from "mongodb";
import { isAdminAuthed } from "@/lib/adminAuth";

let cached = global._mongoBlog;
if (!cached) cached = global._mongoBlog = { client: null, promise: null };

async function getCollection() {
  if (cached.client) return cached.client.db(process.env.MONGODB_DB).collection("blog_posts");
  if (!cached.promise) {
    cached.promise = MongoClient.connect(process.env.MONGODB_URI).then((c) => { cached.client = c; return c; });
  }
  const client = await cached.promise;
  return client.db(process.env.MONGODB_DB).collection("blog_posts");
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function handler(req, res) {
  const col = await getCollection();

  // Public GET — fetch published posts or single post by slug
  if (req.method === "GET" && !isAdminAuthed(req)) {
    const { slug, admin } = req.query;
    if (slug) {
      const post = await col.findOne({ slug, published: true });
      if (!post) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ ...post, _id: post._id.toString() });
    }
    const posts = await col.find({ published: true }).sort({ published_at: -1 }).toArray();
    return res.status(200).json(posts.map((p) => ({ ...p, _id: p._id.toString() })));
  }

  // Admin-only routes below
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  // Admin GET — all posts (including drafts)
  if (req.method === "GET") {
    const posts = await col.find({}).sort({ created_at: -1 }).toArray();
    return res.status(200).json(posts.map((p) => ({ ...p, _id: p._id.toString() })));
  }

  // POST — create new post
  if (req.method === "POST") {
    const { title, excerpt, content, cover_image, tags, published, author } = req.body ?? {};
    if (!title?.trim()) return res.status(400).json({ error: "title required" });
    const slug = slugify(title);
    const existing = await col.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
    const now = new Date();
    const doc = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt?.trim() ?? "",
      content: content?.trim() ?? "",
      cover_image: cover_image?.trim() ?? "",
      tags: Array.isArray(tags) ? tags : (tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? []),
      author: author?.trim() ?? "",
      published: !!published,
      published_at: published ? now : null,
      created_at: now,
      updated_at: now,
    };
    const result = await col.insertOne(doc);
    return res.status(201).json({ ...doc, _id: result.insertedId.toString() });
  }

  // PUT — update post
  if (req.method === "PUT") {
    const { id, title, excerpt, content, cover_image, tags, published, author } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id required" });
    const existing = await col.findOne({ _id: new ObjectId(id) });
    const updates = {
      title: title?.trim() ?? existing.title,
      excerpt: excerpt?.trim() ?? existing.excerpt,
      content: content?.trim() ?? existing.content,
      cover_image: cover_image?.trim() ?? existing.cover_image,
      tags: Array.isArray(tags) ? tags : (tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? existing.tags),
      author: author?.trim() ?? existing.author,
      published: !!published,
      published_at: published && !existing.published_at ? new Date() : existing.published_at,
      updated_at: new Date(),
    };
    await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return res.status(200).json({ ok: true });
  }

  // DELETE
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id required" });
    await col.deleteOne({ _id: new ObjectId(id) });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
