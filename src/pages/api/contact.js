import { MongoClient } from "mongodb";

let cached = global._mongoContact;
if (!cached) cached = global._mongoContact = { client: null, promise: null };

async function getCollection() {
  if (cached.client) {
    return cached.client.db(process.env.MONGODB_DB || "sejalengitech").collection("contact_enquiries");
  }
  if (!cached.promise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }
  const client = await cached.promise;
  return client.db(process.env.MONGODB_DB || "sejalengitech").collection("contact_enquiries");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  try {
    const collection = await getCollection();
    await collection.insertOne({
      name,
      email,
      phone: phone || "",
      message,
      source: "contact",
      createdAt: new Date(),
    });
    return res.status(200).json({ message: "Enquiry received" });
  } catch (err) {
    return res.status(500).json({ error: "Server error", message: err?.message });
  }
}
