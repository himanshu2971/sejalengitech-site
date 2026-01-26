// src/pages/api/homeEnquiries.js
import { MongoClient } from "mongodb";
import { z } from "zod";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables.");
}

// Cache Mongo client across dev hot-reloads
let cached = global._mongo;
if (!cached) cached = global._mongo = { client: null, promise: null };

async function getCollection() {
  if (cached.client) {
    return cached.client.db("sejalengitech").collection("home_enquiries"); // <-- change if needed
  }

  if (!cached.promise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }

  const client = await cached.promise;
  return client.db("sejalengitech").collection("home_enquiries"); // <-- change if needed
}

const enquirySchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  organization: z.string().max(120).optional().default(""),
  phone: z.string().min(7).max(20),
  region: z.string().max(60).optional().default(""),
  inquiryType: z.string().max(80).optional().default(""),
  message: z.string().max(2000).optional().default(""),
});

export default async function handler(req, res) {
  const { method } = req;

  // For public form: only accept POST
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const data = enquirySchema.parse(req.body);
    const collection = await getCollection();

    const result = await collection.insertOne({
      ...data,
      source: "home",
      createdAt: new Date(),
    });

    return res.status(201).json({ ok: true, _id: result.insertedId.toString() });
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }

    return res.status(500).json({
      error: "Server error",
      message: err?.message || "Unknown error",
    });
  }
}
