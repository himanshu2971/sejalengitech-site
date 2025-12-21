# Copilot / AI Agent Instructions — alambana-site

**Short summary:** Next.js (pages router) static site with simple API routes and Tailwind for styling. Use `src/` as the source root. This file contains focused, actionable notes to help an AI agent make productive changes quickly.

## Big picture
- Framework: Next.js (pages router) — pages live in `src/pages` (e.g., `index.js`, `about.js`). Keep `src/` as the canonical code root. Layout and shared UI live in `src/components`.
- Static legal content is stored as plain text under `src/data/` and loaded using `getStaticProps` (see `privacyPolicy.js` / `termsOfService.js`).
- Simple server/API routes exist under `src/pages/api/` (e.g., `src/pages/api/contact.js`), currently implemented as lightweight handlers (no external services yet).

## How to run / common commands
- Start dev server: `npm run dev` (runs `next dev`) — opens at http://localhost:3000
- Build for production: `npm run build` (runs `next build`)
- Start production server: `npm start` (runs `next start`)
- Lint: `npm run lint` (uses `eslint` + `eslint-config-next`)

## Project-specific patterns & conventions
- Import alias: use `@/` to reference `src/` (configured in `jsconfig.json`). Example: `import Layout from '@/components/Layout'`.
- Page content pattern: For pages that render from text files, use `getStaticProps` and read files with `fs/promises` and `path.join(process.cwd(), 'src', 'data', '...')`. See `privacyPolicy.js` and `termsOfService.js`.
- UI composition: Use `src/components/Layout.js` as the page wrapper (header/footer). Pages typically return JSX wrapped in `<Layout>...</Layout>`.
- Styling: Tailwind utility classes are used everywhere. Global styles are in `src/styles/globals.css` (`@import "tailwindcss"`). No `tailwind.config.js` exists yet — if adding custom tokens, create one at the project root.
- Forms & API: Client forms POST JSON to `/api/*` and the API handlers accept `req.body`. Example: contact form in `src/pages/contact.js` posts to `/api/contact`.

## Integration points & TODOs
- `src/pages/api/contact.js` currently logs incoming enquiries and returns a 200. TODOs noted in-file: send email and/or save to DB. Integrations (SMTP, SendGrid, or a database) are expected to be implemented here.
- No CI/CD pipeline or GitHub Actions detected. Deployments reference Vercel in `README.md` (recommended for Next.js).

## Editing examples (do this when modifying behavior)
- Add a new static page + file content:
  1. Add `src/pages/faq.js` exporting a default component.
  2. If reading text file, add `src/data/faq.txt` and implement `export async function getStaticProps()` that reads it via `fs/promises` and passes `content` as a prop.
- Extend the contact API to send email:
  - Edit `src/pages/api/contact.js` to call an email provider or queue; keep existing `POST` guard and JSON input shape `{name, email, phone, message}`.

## Tests / Lint / Debugging
- There are no automated tests in the repo. Use `npm run lint` to catch lint issues.
- For server-side debugging (API routes or `getStaticProps`), run `npm run dev` and check the terminal for `console.log` output from the server.

## Files to inspect when making changes
- Key UI & pages: `src/pages/*.js`, `src/components/Layout.js`
- Static content: `src/data/*.txt`
- API endpoints: `src/pages/api/*.js` (notably `contact.js`)
- Configs: `package.json`, `jsconfig.json`, `next.config.mjs`, `postcss.config.mjs`

---
If anything above is unclear or you'd like more examples (unit test scaffolding, CI, or a sample email integration for `src/pages/api/contact.js`), tell me which area to expand and I will update this file. ✅
