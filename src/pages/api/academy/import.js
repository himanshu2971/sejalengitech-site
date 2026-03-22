import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminAuthed } from "@/lib/adminAuth";

const VALID_CATEGORIES = ["tuition", "coaching", "technology", "creative", "professional"];
const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const YT_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?]+)/;

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function validateRow(row, i) {
  const errors = [];
  const n = i + 2; // 1-based + header row
  if (!row.course_title?.trim()) errors.push(`Row ${n}: course_title is required`);
  if (!VALID_CATEGORIES.includes(row.course_category)) errors.push(`Row ${n}: course_category must be one of ${VALID_CATEGORIES.join(", ")}`);
  if (!row.module_name?.trim()) errors.push(`Row ${n}: module_name is required`);
  if (!row.lesson_title?.trim()) errors.push(`Row ${n}: lesson_title is required`);
  if (!row.lesson_youtube_url?.trim()) errors.push(`Row ${n}: lesson_youtube_url is required`);
  if (!YT_REGEX.test(row.lesson_youtube_url ?? "")) errors.push(`Row ${n}: lesson_youtube_url must be a valid YouTube link`);
  return errors;
}

export default async function handler(req, res) {
  if (!isAdminAuthed(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "POST") return res.status(405).end();

  const { rows } = req.body ?? {};
  if (!Array.isArray(rows) || rows.length === 0)
    return res.status(400).json({ error: "No rows provided" });

  // Validate all rows first
  const allErrors = rows.flatMap((row, i) => validateRow(row, i));
  if (allErrors.length > 0) return res.status(422).json({ errors: allErrors });

  // Group rows: course → module → lessons
  const courseMap = {}; // courseTitle → { meta, modules: { moduleName → { order, lessons[] } } }
  for (const row of rows) {
    const ct = row.course_title.trim();
    if (!courseMap[ct]) {
      courseMap[ct] = {
        title: ct,
        slug: slugify(ct),
        category: row.course_category,
        price: Number(row.course_price ?? 0),
        language: row.course_language || "English",
        instructor: row.course_instructor || "",
        difficulty: VALID_DIFFICULTIES.includes(row.course_difficulty) ? row.course_difficulty : "beginner",
        description: row.course_description || "",
        grade_level: row.grade_level || null,
        modules: {},
      };
    }
    const mn = row.module_name.trim();
    if (!courseMap[ct].modules[mn]) {
      courseMap[ct].modules[mn] = { order: Number(row.module_order ?? 1), lessons: [] };
    }
    courseMap[ct].modules[mn].lessons.push({
      title: row.lesson_title.trim(),
      youtube_url: row.lesson_youtube_url.trim(),
      duration_mins: Number(row.lesson_duration_mins ?? 0),
      is_free: String(row.lesson_is_free).toUpperCase() === "TRUE",
      order: courseMap[ct].modules[mn].lessons.length,
    });
  }

  let courses_created = 0, modules_created = 0, lessons_created = 0;

  for (const [, course] of Object.entries(courseMap)) {
    // Ensure unique slug
    let slug = course.slug;
    const { data: existing } = await supabaseAdmin.from("courses").select("id").eq("slug", slug).maybeSingle();
    if (existing) slug = slug + "-" + Date.now();

    const { data: newCourse, error: cErr } = await supabaseAdmin
      .from("courses")
      .insert([{ title: course.title, slug, category: course.category, price: course.price, language: course.language, instructor: course.instructor, difficulty: course.difficulty, description: course.description, grade_level: course.grade_level, published: false }])
      .select()
      .single();
    if (cErr) return res.status(500).json({ error: `Course insert failed: ${cErr.message}` });
    courses_created++;

    for (const [moduleName, mod] of Object.entries(course.modules)) {
      const { data: newModule, error: mErr } = await supabaseAdmin
        .from("modules")
        .insert([{ course_id: newCourse.id, title: moduleName, order: mod.order }])
        .select()
        .single();
      if (mErr) return res.status(500).json({ error: `Module insert failed: ${mErr.message}` });
      modules_created++;

      const lessonRows = mod.lessons.map((l) => ({
        module_id: newModule.id,
        title: l.title,
        youtube_url: l.youtube_url,
        duration_mins: l.duration_mins,
        is_free: l.is_free,
        order: l.order,
      }));
      const { error: lErr } = await supabaseAdmin.from("lessons").insert(lessonRows);
      if (lErr) return res.status(500).json({ error: `Lesson insert failed: ${lErr.message}` });
      lessons_created += lessonRows.length;
    }
  }

  return res.status(200).json({ ok: true, courses_created, modules_created, lessons_created });
}
