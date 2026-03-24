import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AcademyHeader from "@/components/academy/AcademyHeader";

function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState({ display_name: "", phone: "", bio: "", student_type: "", grade_level: "" });
  const [stats, setStats] = useState({ quizzes: 0, avgScore: 0, passRate: 0, courses: 0 });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setAuthReady(true);
      if (!data.session) { router.replace("/academy/login"); return; }
      const u = data.session.user;
      setUser(u);

      const res = await fetch("/api/academy/profile", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setProfile({
          display_name: d.profile.display_name ?? "",
          phone: d.profile.phone ?? "",
          bio: d.profile.bio ?? "",
          student_type: d.profile.student_type ?? "",
          grade_level: d.profile.grade_level ?? "",
        });
        setAvatarUrl(d.profile.avatar_url ?? null);
        setStats(d.stats);
      }
    });
  }, [router]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/academy/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
    else setError("Failed to save. Try again.");
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Avatar must be under 2 MB"); return; }

    setUploadingAvatar(true); setError("");
    const { data: { session } } = await supabase.auth.getSession();
    const ext = file.name.split(".").pop();
    const path = `${user.id}.${ext}`;

    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setError("Upload failed: " + upErr.message); setUploadingAvatar(false); return; }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await fetch("/api/academy/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ avatar_url: publicUrl }),
    });

    setAvatarUrl(publicUrl + "?t=" + Date.now());
    setUploadingAvatar(false);
  }

  const initials = profile.display_name
    ? profile.display_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Head><title>My Profile | Alambana EduTech</title></Head>
      <div className="min-h-screen bg-slate-50">
        <AcademyHeader user={user} onSignOut={async () => { await supabase.auth.signOut(); router.push("/academy"); }} authReady={authReady} />

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Header */}
          <div className="mb-8">
            <Link href="/academy/dashboard" className="text-sm text-indigo-600 hover:underline">← Back to Dashboard</Link>
            <h1 className="text-2xl font-black text-slate-900 mt-3">My Profile</h1>
            <p className="text-slate-500 text-sm mt-1">Update your name, photo and personal details.</p>
          </div>

          {/* Avatar + Stats card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="text-white font-black text-2xl">{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white text-xs hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {uploadingAvatar ? "…" : "✏"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Courses", value: stats.courses, color: "indigo" },
                { label: "Quizzes", value: stats.quizzes, color: "violet" },
                { label: "Avg Score", value: `${stats.avgScore}%`, color: "emerald" },
                { label: "Pass Rate", value: `${stats.passRate}%`, color: "amber" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`flex flex-col items-center bg-${color}-50 border border-${color}-100 rounded-xl px-4 py-2`}
                  style={{ borderColor: `var(--color-${color}-100, #e0e7ff)`, background: `var(--color-${color}-50, #eef2ff)` }}>
                  <span className="text-xl font-black text-slate-900">{value}</span>
                  <span className="text-xs text-slate-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
                placeholder="How should we call you?"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400">Email is managed by your login and cannot be changed here.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone (optional)</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio (optional)</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself…"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition resize-none"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning Profile</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">I am a…</label>
                <select
                  value={profile.student_type}
                  onChange={(e) => setProfile((p) => ({ ...p, student_type: e.target.value, grade_level: "" }))}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 transition bg-white"
                >
                  <option value="">Select (optional)</option>
                  <option value="school">School Student (Class 1–12)</option>
                  <option value="college">College / University Student</option>
                  <option value="professional">Working Professional</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {profile.student_type === "school" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Class</label>
                  <select
                    value={profile.grade_level}
                    onChange={(e) => setProfile((p) => ({ ...p, grade_level: e.target.value }))}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-400 transition bg-white"
                  >
                    <option value="">Select class</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={`class_${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {saved && <p className="text-sm text-emerald-600 font-semibold">✓ Profile saved!</p>}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-6 py-3 text-sm font-bold text-white transition shadow-md shadow-indigo-200 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;

ProfilePage.noLayout = true;
