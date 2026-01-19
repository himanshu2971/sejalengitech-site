import { MongoClient, ObjectId } from "mongodb";
import { z } from "zod";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}
if (!process.env.PROJECTS_API_KEY) {
  throw new Error("Missing PROJECTS_API_KEY in environment variables.");
}

// Cache Mongo client across dev hot-reloads
let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

async function getCollection() {
  if (cached.client) {
    return cached.client.db("sejalengitech").collection("projects");
  }

  if (!cached.promise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  const client = await cached.promise;
  return client.db("sejalengitech").collection("projects");
}

// Validation schema for projects
const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  type: z.string().max(80).optional().default(""),
  timeframe: z.string().max(80).optional().default(""),
  role: z.string().max(120).optional().default(""),
  tech: z.array(z.string().min(1).max(40)).min(1).max(12).default([]),
  link: z.string().url().optional(),
  highlight: z.boolean().optional().default(false),
});

export default async function handler(req, res) {
  const { method } = req;

  // ✅ Protect write operations (team only)
  if (method === "POST" || method === "PUT" || method === "DELETE") {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.PROJECTS_API_KEY) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  try {
    const collection = await getCollection();

    // GET /api/projects
    // Optional: /api/projects?highlight=true
    if (method === "GET") {
      const { highlight } = req.query;

      const filter =
        typeof highlight === "string"
          ? { highlight: highlight === "true" }
          : {};

      const projects = await collection
        .find(filter)
        .sort({ highlight: -1, _id: -1 })
        .toArray();

      // Convert ObjectId -> string for frontend
      res.status(200).json(
        projects.map((p) => ({
          ...p,
          _id: p._id.toString(),
        }))
      );
      return;
    }

    // POST /api/projects
    if (method === "POST") {
      const project = projectSchema.parse(req.body);

      const result = await collection.insertOne({
        ...project,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json({ _id: result.insertedId.toString(), ...project });
      return;
    }

    // PUT /api/projects?id=<ObjectId>
    if (method === "PUT") {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Missing id in query (?id=...)" });
        return;
      }
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid MongoDB ObjectId" });
        return;
      }

      const project = projectSchema.parse(req.body);

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...project, updatedAt: new Date() } }
      );

      res.status(200).json({ updated: result.modifiedCount > 0 });
      return;
    }

    // DELETE /api/projects?id=<ObjectId>
    if (method === "DELETE") {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "Missing id in query (?id=...)" });
        return;
      }
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid MongoDB ObjectId" });
        return;
      }

      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ deleted: result.deletedCount > 0 });
      return;
    }

    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err) {
    if (err?.name === "ZodError") {
      res.status(400).json({ error: "Validation failed", details: err.errors });
      return;
    }

    res.status(500).json({
      error: "Server error",
      message: err?.message || "Unknown error",
    });
  }
}
