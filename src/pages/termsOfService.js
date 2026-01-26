import fs from "fs/promises";
import path from "path";

export default function PrivacyPolicy({ content }) {
  const text = content || "Terms of Service not found.";

  return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <div className="prose prose-invert">
          {/* preserve exact spacing and line breaks from the text file */}
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </main>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src", "data", "termsService.txt");
  try {
    const content = await fs.readFile(filePath, "utf8");
    return { props: { content } };
  } catch (err) {
    console.warn("Could not read privacy.txt:", err.message);
    return { props: { content: "" } };
  }
}