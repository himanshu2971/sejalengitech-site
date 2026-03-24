# Alambana EduTech — Platform Operating Manual
### Sejal Engitech Pvt. Ltd. · Last updated: March 2026

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [All URLs — Quick Reference](#2-all-urls--quick-reference)
3. [Three-Tier Access System](#3-three-tier-access-system)
4. [Admin Panel — Full Guide](#4-admin-panel--full-guide)
5. [Teacher Portal — Full Guide](#5-teacher-portal--full-guide)
6. [Student Experience — Full Guide](#6-student-experience--full-guide)
7. [Key Flows — Step by Step](#7-key-flows--step-by-step)
8. [Database Tables Reference](#8-database-tables-reference)
9. [Tech Stack](#9-tech-stack)
10. [Environment Variables](#10-environment-variables)
11. [What's Been Built](#11-whats-been-built)
12. [Roadmap — What's Next](#12-roadmap--whats-next)

---

## 1. Platform Overview

**Alambana EduTech** is the online learning platform built and operated by Sejal Engitech Pvt. Ltd., Patna, Bihar.

| Property | Value |
|---|---|
| Live URL | https://www.sejalengitech.in |
| Academy URL | https://www.sejalengitech.in/academy |
| Brand name (student-facing) | Alambana EduTech |
| Brand name (admin-facing) | Sejal Engitech |
| Git repo | https://github.com/himanshu2971/sejalengitech-site |
| Deployment | Vercel (auto-deploy on push to `main`) |

The platform serves:
- **School students** (tuition, CBSE/ICSE, class 1–12)
- **Exam aspirants** (JEE, NEET, UPSC, CAT)
- **Tech learners** (web dev, coding, cybersecurity)
- **Creative learners** (art, music, design)
- **Working professionals** (business, marketing, leadership)

---

## 2. All URLs — Quick Reference

### Main Site (Sejal Engitech)
| URL | Purpose |
|---|---|
| `/` | Home page |
| `/about` | About Sejal Engitech |
| `/services` | Services listing |
| `/projects` | Projects portfolio |
| `/contact` | Contact form |

### Student-Facing Academy (Alambana EduTech)
| URL | Purpose |
|---|---|
| `/academy` | Course catalog (all categories, personalized for logged-in students) |
| `/academy/login` | Student login — magic link (no password) |
| `/academy/dashboard` | Student home — enrolled courses, sessions, announcements |
| `/academy/courses/[slug]` | Course detail page — curriculum, instructor, enroll CTA |
| `/academy/learn/[courseSlug]` | Video player + quiz (full-screen, no nav) |
| `/academy/profile` | Student profile — name, photo, phone, learning type |
| `/academy/sessions` | All upcoming & past live sessions |

### Admin Panel (Sejal Engitech — password protected)
| URL | Purpose |
|---|---|
| `/academy/admin/login` | Admin login (password only) |
| `/academy/admin` | Dashboard — stats + quick links |
| `/academy/admin/courses` | Course list + create new course |
| `/academy/admin/courses/[id]` | Full course editor — modules, lessons, quizzes, teacher assignment |
| `/academy/admin/sessions` | Live session scheduling |
| `/academy/admin/students` | All students — enrollment history |
| `/academy/admin/teachers` | Teacher management — pending approvals + active teachers |
| `/academy/admin/finances` | Revenue, transactions, refunds |
| `/academy/admin/analytics` | Quiz stats, completion rates, enrollment charts |
| `/academy/admin/enquiries` | Student support tickets |
| `/academy/admin/announcements` | Broadcast messages to all students |
| `/academy/admin/banners` | Promotional banners on catalog page |
| `/academy/admin/import` | Bulk CSV import for courses |

### Teacher Portal (password — email + password)
| URL | Purpose |
|---|---|
| `/academy/teacher/login` | Teacher login (email + password) and sign up |
| `/academy/teacher/dashboard` | Teacher home — assigned courses, sessions, student count |
| `/academy/teacher/courses/[id]` | Course content editor (modules, lessons, quizzes — scoped) |
| `/academy/teacher/sessions` | Manage live sessions for their courses |
| `/academy/teacher/students` | Students enrolled in their courses |
| `/academy/teacher/analytics` | Quiz pass rates, completion rates — their courses only |

---

## 3. Three-Tier Access System

```
┌─────────────────────────────────────────────────────┐
│  ADMIN (Sejal Engitech team)                        │
│  Login: /academy/admin/login  ·  Password: env var  │
│  Access: Everything — all courses, finances, users   │
├─────────────────────────────────────────────────────┤
│  TEACHER (Alambana instructors)                     │
│  Login: /academy/teacher/login  ·  Email + password │
│  Access: Only assigned courses + their students      │
├─────────────────────────────────────────────────────┤
│  STUDENT (learners)                                 │
│  Login: /academy/login  ·  Magic link (no password) │
│  Access: Enrolled courses + own profile             │
└─────────────────────────────────────────────────────┘
```

### How admin auth works
- Admin types the password (`ACADEMY_ADMIN_KEY` env var) at `/academy/admin/login`
- Server sets an httpOnly cookie `academy_admin` (7-day expiry)
- Every admin page and API checks `isAdminAuthed(req)` — reads the cookie server-side
- No Supabase account required for admin

### How teacher auth works
- Teacher signs up at `/academy/teacher/login` with name + email + password
- Their Supabase account is created with `profiles.role = 'pending_teacher'`
- Admin sees them in the "Pending Approval" list at `/academy/admin/teachers`
- Admin clicks "Approve" → `profiles.role` becomes `'teacher'`
- Teacher signs in → gets a JWT access token → every teacher API route checks the token + role
- Admin can also manually enter any email at the teachers page to grant access directly

### How student auth works
- Student enters their email at `/academy/login`
- Supabase sends a magic link (no password ever)
- Click the link → signed in → redirected to `/academy/dashboard`
- Session stored in browser localStorage (Supabase handles this)
- All student API routes check the Bearer JWT token from `Authorization` header

---

## 4. Admin Panel — Full Guide

### Login
**URL:** `/academy/admin/login`
Password is set via the `ACADEMY_ADMIN_KEY` environment variable. This is only known to Sejal Engitech team members. After logging in, the session lasts 7 days.

---

### Dashboard (`/academy/admin`)
Shows 8 live stats:
- Total courses, published courses
- Total students, new this month
- Revenue (total + this month)
- Open enquiries (badge alert if any)
- Upcoming sessions
- Quick-action cards to every section

---

### Courses (`/academy/admin/courses`)
**List view:** All courses with publish status, category, price, lesson count.
**Create:** Fill title, category, price (0 = free), language, instructor, difficulty, description. Click Create.

**Course Editor** (`/academy/admin/courses/[id]`):
- Edit course settings: title, slug, description, thumbnail URL, price, language, instructor
- **Modules:** Add modules (chapters) with title + description
- **Lessons:** Inside each module — add lessons with YouTube URL, duration, free/locked toggle
- **Quizzes:** Inside each lesson — add a quiz with MCQ questions (up to 4 options, correct answer, explanation)
- **Publish toggle:** Switch between draft and published (students can only see published courses)
- **Assigned Teachers:** Toggle which teachers are assigned to this course

**Bulk Import** (`/academy/admin/import`):
Upload a CSV file to create an entire course (with modules and lessons) in one shot. Download the template from the page for the correct format.

---

### Live Sessions (`/academy/admin/sessions`)
Schedule, edit, and delete live class sessions.

**Fields:** Title, description, Google Meet URL, date/time, duration, linked course (optional).

**After class:** Edit the session → check "Session was recorded" → paste the YouTube recording URL. Students immediately see a "Watch Recording" button on their dashboard.

---

### Students (`/academy/admin/students`)
Lists all registered students (from Supabase auth). Expandable rows show each student's enrolled courses and enrollment dates. Search bar at top.

---

### Teachers (`/academy/admin/teachers`)
**Pending Approval section** (top, amber highlight):
Shows teachers who signed up at `/academy/teacher/login` and are waiting for access. Admin can:
- **Approve** — grants teacher role immediately, moves them to Active list
- **Decline** — resets to student role

**Add Manually section:**
Enter any registered email to grant teacher access directly (without them needing to request it).

**Active Teachers section:**
Shows all active teachers with their assigned courses. Expand a teacher to assign/unassign courses (toggle grid).

**Revoke:** Remove a teacher's access (sets them back to student, removes all course assignments).

---

### Finances (`/academy/admin/finances`)
Shows:
- Total revenue, this month's revenue, pending payments, refunds
- Full transaction table (student email, course, amount, date, status)
- Actions: Mark as Paid, Refund

---

### Analytics (`/academy/admin/analytics`)
- **Enrollment chart:** Bar chart per course showing total students
- **Quiz pass rates:** Per quiz, showing attempts / pass rate / avg score
- **Lesson completion:** Which lessons have been completed most
- **Recent activity:** Latest quiz attempts and progress updates

---

### Enquiries (`/academy/admin/enquiries`)
Student support tickets. Each ticket shows:
- Student name, email, subject, message, timestamp
- Status: Open / In Progress / Closed
- Admin can reply (reply is shown to student — currently only stored, no email sent yet)
- Bulk actions: Close, Delete

---

### Announcements (`/academy/admin/announcements`)
Create messages that appear as colored banners on the student dashboard.

**Types:** Info (blue) · Warning (amber) · Success (green)

Toggle active/inactive — deactivated announcements disappear from all students immediately.

---

### Banners / Ads (`/academy/admin/banners`)
Promotional banners shown in a horizontal scroll strip on the course catalog page.

**Fields:** Headline, subtitle, CTA button text + URL, badge text, accent color (cyan / violet / emerald / amber / rose / sky), display order.

Active banners appear on `/academy` immediately.

---

## 5. Teacher Portal — Full Guide

### Signing Up
**URL:** `/academy/teacher/login` → Sign Up tab

1. Enter your name, email (Gmail, Yahoo, any), and a password (min 6 characters)
2. Account is created — your status becomes "Pending Approval"
3. You'll see a message: "Account created! Your admin needs to grant you teacher access."
4. An Alambana admin reviews your request at `/academy/admin/teachers` and approves it
5. Once approved, come back to `/academy/teacher/login` → Sign In

If admin has already granted you access without you signing up, just use Sign Up to create your account, then sign in.

---

### Dashboard (`/academy/teacher/dashboard`)
After login, you see:
- Assigned courses count, student count across all your courses, upcoming session count
- List of your assigned courses (click to edit)
- Upcoming live sessions

---

### Course Editor (`/academy/teacher/courses/[id]`)
Same full editor as admin — modules, lessons, quizzes.

**What teachers CAN do:**
- Add / edit / delete modules
- Add / edit / delete lessons (YouTube URL, duration, free/locked)
- Add / edit / delete quizzes and questions

**What teachers CANNOT do:**
- Change course title, price, or slug (admin-only)
- Publish or unpublish a course (admin-only)
- Delete the course itself (admin-only)
- Edit courses they are not assigned to (403 error)

---

### Live Sessions (`/academy/teacher/sessions`)
Create, edit, delete live sessions — same form as admin but only shows your assigned courses in the course dropdown.

---

### Students (`/academy/teacher/students`)
Students enrolled in any of your assigned courses. Search by name/email. Shows which courses each student is enrolled in.

---

### Analytics (`/academy/teacher/analytics`)
Quiz pass rates and lesson completion rates — scoped only to your courses.

---

## 6. Student Experience — Full Guide

### Catalog (`/academy`)
The course catalog page. All published courses displayed in category tabs.

**Personalized tabs** (if logged in and profile set):
| Your type | Tabs shown | Tabs hidden |
|---|---|---|
| School student | Tuition, Coaching, Technology, Creative | Professional |
| College student | Coaching, Technology, Creative, Professional | Tuition |
| Working professional | Professional, Technology, Creative | Tuition |
| Not set / Other | All tabs | None |

Promotional banners (set by admin) appear in a horizontal strip above the course grid.

---

### Login (`/academy/login`)
Magic link — enter email, click "Send me a link", check inbox, click the link. No password ever needed.

First-time students get an onboarding modal on the dashboard asking "Who are you?" — this sets up catalog personalization.

---

### Dashboard (`/academy/dashboard`)
After login:
- **Onboarding modal** (first time only) — choose student type for personalized catalog
- **Announcements** — Admin broadcasts shown as colored banners
- **Upcoming Live Sessions** — with Google Meet join link. "Starting Soon" badge appears 30 min before class
- **Recordings** — Past sessions with YouTube playback
- **My Courses** — Enrolled courses with progress bar
- **Quick Actions** — Browse courses, view profile, sessions page

---

### Course Detail (`/academy/courses/[slug]`)
- Course overview: instructor, duration, lessons count, difficulty
- Full curriculum accordion (modules + lessons)
- Free lessons have a "Preview" button (no login needed)
- Enroll CTA (sticky on mobile)
- Currently enrollment is manual — admin marks purchase as "paid" in Finances

---

### Video Player (`/academy/learn/[courseSlug]`)
Full-screen learning experience (no header/footer):
- YouTube video embed with 70+ subtitle languages (CC button)
- Lesson list sidebar
- "Mark as complete" button
- "Take Quiz" button per lesson (if quiz exists)
- Progress bar

---

### Profile (`/academy/profile`)
- Upload profile photo (stored in Supabase Storage)
- Edit display name, phone, bio
- Set learning profile: student type + class (for catalog personalization)
- Stats: courses enrolled, quizzes taken, avg score, pass rate

---

## 7. Key Flows — Step by Step

### Flow 1: Admin creates and publishes a course

```
Admin → /academy/admin/courses → "Create Course"
→ Fill title, category, price, instructor
→ Course editor opens → Add Module → Add Lessons (YouTube URLs)
→ Add Quiz to a lesson (optional)
→ Toggle "Published" → Course appears on catalog
→ Assign teacher (optional) → Teacher can now edit content
```

### Flow 2: Teacher signs up and gets access

```
Teacher → /academy/teacher/login → "Sign Up" tab
→ Enter name, email, password → Account created (pending_teacher)
Admin → /academy/admin/teachers → Sees in "Pending Approval"
→ Clicks "Approve" → teacher.role = 'teacher'
Teacher → Signs in → Lands on /academy/teacher/dashboard
→ Sees assigned courses
```

### Flow 3: Student enrolls in a course

```
Student → /academy → Browses catalog → Clicks course
→ /academy/courses/[slug] → Clicks "Enroll"
→ Contacts admin/pays offline
Admin → /academy/admin/finances → Marks purchase as "paid"
Student → Sees course in /academy/dashboard → "Continue Learning"
→ /academy/learn/[courseSlug] → Watches, takes quizzes
```

### Flow 4: Live session flow

```
Admin/Teacher → Creates session with Google Meet URL + scheduled time
Student → Sees on /academy/dashboard → "Upcoming Sessions"
→ "Starting Soon" badge 30 min before class
→ Joins via Meet link
After class:
Admin/Teacher → Edits session → Checks "Was Recorded" → Pastes YouTube URL
Student → Sees "▶ Watch Recording" on dashboard
```

### Flow 5: Student catalog personalization

```
Student → Signs in for first time → /academy/dashboard
→ Onboarding modal: "Who are you?"
→ Selects "School Student" (Class 1–12)
→ Goes to /academy → Professional tab is hidden
Student → /academy/profile → Can change their type anytime
```

### Flow 6: Admin broadcasts announcement

```
Admin → /academy/admin/announcements → "Create Announcement"
→ Type: Info / Warning / Success
→ Title + message → Toggle active
All students → See colored banner at top of their dashboard immediately
Admin → Toggle off → Banner disappears from all dashboards immediately
```

---

## 8. Database Tables Reference

### Supabase Tables

| Table | Key columns | Purpose |
|---|---|---|
| `profiles` | `user_id, display_name, role, student_type, grade_level, avatar_url, phone, bio` | Extended user info. role: student/teacher/pending_teacher |
| `courses` | `id, title, slug, category, price, instructor, published, org_id` | Course catalog |
| `modules` | `id, course_id, title, order` | Course chapters |
| `lessons` | `id, module_id, title, youtube_url, is_free, order` | Individual lessons |
| `quizzes` | `id, lesson_id, title, passing_score` | Quiz per lesson |
| `questions` | `id, quiz_id, question, option_a–d, correct_index, explanation` | MCQ questions |
| `quiz_attempts` | `user_id, quiz_id, score, passed` | Student quiz history |
| `progress` | `user_id, lesson_id, completed_at` | Lesson completion tracking |
| `purchases` | `user_id, course_id, amount, currency, status` | Enrollment/payment records |
| `sessions` | `id, title, meet_url, scheduled_at, course_id, is_recorded, recording_url, created_by` | Live classes |
| `teacher_courses` | `teacher_user_id, course_id` | Teacher → course assignment |
| `enquiries` | `name, email, subject, message, status, reply` | Student support tickets |
| `announcements` | `title, message, type, active` | Dashboard broadcasts |
| `banners` | `title, subtitle, cta_text, cta_url, accent, active, order` | Catalog promo banners |
| `organizations` | `id, name, slug, plan, owner_user_id` | SaaS groundwork (unused in UI yet) |

### MongoDB Collections (Main Site)

| Collection | Purpose |
|---|---|
| `home_enquiries` | Contact form from main homepage |
| `contact_enquiries` | Contact page form submissions |
| `projects` | Portfolio projects (CRUD via API key) |

---

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) + React 19 |
| Styling | Tailwind CSS v4 (inline @theme in globals.css) |
| Animations | Framer Motion v12 |
| LMS Database | Supabase (PostgreSQL + Auth + Storage) |
| Site Database | MongoDB v7 |
| Deployment | Vercel |
| Analytics | Vercel Analytics |
| SEO | next-sitemap (auto post-build) |
| PWA | site.webmanifest — installable from browser (no app store) |

---

## 10. Environment Variables

All must be set in `.env.local` (local) and Vercel → Settings → Environment Variables.

| Variable | Where used | Notes |
|---|---|---|
| `MONGODB_URI` | Main site API | MongoDB connection string |
| `MONGODB_DB` | Main site API | DB name: `sejalengitech` |
| `PROJECTS_API_KEY` | `/api/projects` | Write access to projects |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend + backend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend only | Safe to expose — limited permissions |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend only (never expose) | Full database access |
| `ACADEMY_ADMIN_KEY` | Admin login | The admin panel password |

---

## 11. What's Been Built

### Phase 1 — Foundation
- Supabase integration (auth + database)
- Course catalog with 5 category tabs
- Student magic-link login
- Student dashboard (sessions, recordings, courses)
- Course detail page
- Video player (YouTube embed, 70+ subtitles)
- Progress tracking
- Quiz system (MCQ, scoring, pass/fail, explanations)

### Phase 2 — Admin Panel
- Admin login (cookie-based, password only)
- Dashboard with 8 stats
- Course editor (modules, lessons, quizzes)
- Live session management
- Students page
- Finances (revenue, transactions, refunds)
- Analytics (enrollment, quiz stats, completion)
- Enquiries (support tickets, reply, close)
- Announcements (broadcast banners to students)
- Banners/Ads (catalog promotions)
- Bulk CSV import

### Phase 3 — UI Overhaul (Alambana EduTech rebrand)
- Renamed Sejal Academy → Alambana EduTech
- Complete AcademyHeader rebuild (solid white navbar, auth-aware)
- Full catalog redesign: hero, path selector, path cards
- Dashboard redesign: sessions, recordings, quick actions
- Sessions page (student-facing)
- Profile page with avatar upload

### Phase 2.3 — Teacher Portal & Smart Catalog
- Three-tier access model (Admin → Teacher → Student)
- Teacher signup with email + password (any email)
- Pending approval flow (teachers wait for admin approval)
- Teacher portal: dashboard, course editor (scoped), sessions, students, analytics
- Admin teacher management: pending approvals, active teachers, course assignment
- Smart catalog: personalized tabs based on student type
- Onboarding modal on first login
- Student type / grade level in profile
- SaaS groundwork: `organizations` table, `org_id` FKs (no UI yet)

---

## 12. Roadmap — What's Next

### Phase 3 — Payments (Razorpay + Stripe)
Currently enrollment is manual (admin marks as paid). Next:
- Razorpay checkout for Indian students (UPI, cards, net banking)
- Stripe for international students
- Automatic enrollment on payment success
- Receipts + invoice emails

### Phase 3.5 — Multi-Tenant SaaS
The `organizations` table and `org_id` FKs are already in the database (from Phase 2.3). Next:
- Org admin onboarding: `/academy/[orgSlug]` serves that org's courses
- Each org gets their own admin panel, teacher pool, and student base
- Platform admin sees all organizations and revenue
- Org invites teachers and students under their brand

### Phase 4 — Billing & Feature Gating
- `organizations.plan`: free / starter / pro / enterprise
- Stripe monthly subscriptions for org admins
- Feature gates: free orgs get 3 courses, pro gets unlimited
- Platform admin dashboard: all revenue across all orgs

### Phase 4.5 — Certificates
- Certificate generation on course completion (PDF)
- Certificate includes student name, course title, completion date, Alambana seal
- Shareable certificate URL (verify.alambanatech.com/cert/[id])

### Phase 5 — White Label
- Custom domain support (CNAME mapping)
- Orgs can show their own logo/branding — Alambana infrastructure underneath
- Teacher logins + student portals under the org's domain

### Phase 5.5 — Mobile App (React Native)
- Full offline video support
- Push notifications for live class reminders
- Available on Android (Play Store) and iOS (App Store)
- PWA already installable — native app adds offline + push

### Future Considerations
- i18next UI language switching (Hindi, Bengali, Tamil, etc.)
- Doubt-clearing live chat (WebSockets or Crisp integration)
- Group classes / cohort-based learning
- Discussion forums per course
- Parent dashboard (for school students — see child's progress)

---

*This document was last updated: March 2026*
*Prepared by: Claude (AI assistant) + Himanshu Shourabh, Sejal Engitech*
