# HUDA Welfare & Educational Multipurpose Society — Website

The official website for **HUDA Welfare & Educational Multipurpose Society**, a
community welfare and educational organization based in Hinganghat,
Maharashtra, India.

The site is built to launch honestly as a **new organization**: it never
shows fabricated statistics, testimonials, past events or photos. Every
number, program and photo you see is either configuration you set once
(mission, contact details, focus areas) or real content entered through the
admin panel. As HUDA runs real programs, the same site — no code changes —
grows into a full activity/impact website (see [The 20 September 2026
workflow](#the-20-september-2026-workflow) below).

## 1. Technology Stack

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Supabase** — Postgres database, Auth (admin login) and Storage (images)
- **Zod** for form/server-action validation
- **Lucide React** for icons (plus a couple of hand-drawn social icons —
  see [Note on icons](#note-on-social-icons))
- **next/image** and **next/font** for optimized images and fonts

No separate backend server — all data access goes through Next.js Server
Components, Server Actions and Supabase's Row Level Security.

## 2. Project Structure

```
src/
  app/
    (public)/            # Public site — shares Header/Footer layout
      page.tsx            # Homepage
      about/ our-work/ programs/ programs/[slug]/
      gallery/ get-involved/ contact/ privacy/ terms/
    admin/
      login/               # Admin login (no sidebar)
      (dashboard)/         # Authenticated admin area (sidebar layout)
        dashboard/ programs/ gallery/ team/ volunteers/ contacts/ settings/
    sitemap.ts robots.ts
  actions/                # Server Actions ('use server') — forms, CRUD, auth
  components/
    layout/ ui/ home/ programs/ gallery/ team/ forms/ admin/ icons/
  lib/
    supabase/              # browser/server/admin clients, storage helpers
    data/                  # server-side data-access functions per table
    validations/           # Zod schemas
    constants.ts format.ts settings.ts structured-data.ts
  types/                  # database.ts (schema mirror) + app-facing types
  proxy.ts                # Next.js 16's renamed middleware.ts — admin auth guard
supabase/
  migrations/             # SQL schema + RLS policies
  seed.sql                # Neutral seed data only
```

## 3. Content Rules (read before adding "sample" content)

This codebase intentionally has **no** seeded volunteers, staff, past
programs, testimonials or photos. Empty states are a first-class UI
concern — see `EmptyState`, and how the homepage, gallery and programs
pages hide or replace sections when there is no real data yet. When
extending this site, keep following that rule: never hard-code a number,
name or achievement that isn't backed by a real database row.

## 4. Local Setup

### 4.1 Install dependencies

```bash
pnpm install
```

### 4.2 Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings → API**, copy the **Project URL**, **anon public
   key**, and **service_role key**.

### 4.3 Environment variables

Copy `.env.example` to `.env.local` and fill in the values from step 4.2:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server-only, never exposed to the browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The site is designed to **run without these** too — Supabase-backed
sections (programs, gallery, forms, admin) degrade to their empty states
and the admin area stays locked, so `pnpm dev` and `pnpm build` both work
before Supabase is configured.

### 4.4 Run the database migrations

Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

This runs everything in `supabase/migrations/`:

- `0001_init.sql` — tables, indexes, `updated_at` triggers for `programs`,
  `program_gallery`, `gallery`, `team_members`, `volunteer_submissions`,
  `contact_submissions`, `newsletter_subscribers`, `site_settings`.
- `0002_rls.sql` — Row Level Security policies (see [Security](#7-security))
  and creates the public `media` Storage bucket.

Alternatively, paste the contents of both files, in order, into the
Supabase Dashboard's SQL Editor and run them.

### 4.5 Seed neutral starting data (optional but recommended)

```bash
psql "<your-connection-string>" -f supabase/seed.sql
```

or paste `supabase/seed.sql` into the SQL Editor. This inserts the
organization's `site_settings` row and one generic "Upcoming Community
Program" entry dated 20 September 2026 — no fabricated details.

### 4.6 Storage bucket

The `0002_rls.sql` migration already creates a public bucket named
`media` with the right policies (public read, authenticated
insert/update/delete). If you'd rather create it by hand: **Storage → New
bucket → name `media` → Public bucket**.

### 4.7 Create the first admin user

Admin login uses Supabase Auth (email + password). Create the first admin
in **Authentication → Users → Add user** in the Supabase Dashboard (set
"Auto Confirm User"). Any confirmed user in your Supabase project can sign
in at `/admin/login` — there is no separate roles table, since this is a
single small organization managing its own site.

### 4.8 Run locally

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public site
and [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
for the admin panel.

## 5. Production Build

```bash
pnpm lint
pnpm build
pnpm start
```

`pnpm build` runs Turbopack's production build, including TypeScript type
checking. There is no separate `next lint` step (removed in Next.js 16) —
`pnpm lint` runs ESLint directly.

## 6. Deploying to Vercel

1. Push this repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the four environment variables from `.env.example` in the Vercel
   project's **Settings → Environment Variables** (set
   `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. No further configuration is needed — there's no local-file
   database or long-running process, so it runs entirely on Vercel's
   serverless/edge infrastructure.

## 7. Security

Row Level Security (`supabase/migrations/0002_rls.sql`) enforces:

- **Public (anon) users** can read programs, program gallery photos,
  general gallery photos, active team members and site settings; they can
  only **insert** into `volunteer_submissions`, `contact_submissions` and
  `newsletter_subscribers` — never read them back.
- **Authenticated users** (admins) can read and write everything.
- The `SUPABASE_SERVICE_ROLE_KEY` is only imported in
  `src/lib/supabase/admin.ts`, guarded by the `server-only` package so a
  build fails if it's ever imported from a Client Component. It currently
  isn't used by any shipped code path — the anon key + RLS is sufficient
  for every operation in this app — but it's available for future
  server-only jobs that must bypass RLS.

Admin routes (`/admin/*`) are protected in two layers:

1. `src/proxy.ts` (Next.js 16's renamed `middleware.ts`) checks the
   Supabase session on every request and redirects unauthenticated users
   to `/admin/login` **before** any admin page renders.
2. `src/app/admin/(dashboard)/layout.tsx` re-checks the session
   server-side as defense in depth.

## 8. Content Workflows

### Creating a program

1. Sign in at ```/admin/login```.
2. **Programs → + New Program.** Fill in title, date, category, short and
   full description. Slug auto-fills from the title (editable).
3. Optionally upload a cover image, set a registration link, or mark it
   **Featured**.
4. Save. It immediately appears on `/programs` and, if it's the earliest
   upcoming one, in the homepage "Upcoming Program" section.

### Uploading event photos

- **Per-program photos** (shown on that program's own page): open
  **Programs → Edit** on the program, scroll to **Program Gallery
  Photos**, upload and optionally caption each photo.
- **General gallery photos** (shown on `/gallery`, filterable by
  category): **Gallery → Upload Photo**, pick a category, optionally link
  it to a program.

### The 20 September 2026 workflow

The seed data ships exactly one generic upcoming program dated 20
September 2026, with the copy "Details will be announced soon." — no
invented venue, headcount or program name. After that program actually
happens:

1. Sign in and open **Programs**, click **Edit** on the program.
2. Change **Status** from `Upcoming` to `Completed`.
3. Fill in the real title, venue, description, and — in the **Program
   Report** section that appears once status is `Completed` — summary,
   objectives, activities and outcomes.
4. Optionally enter participant / volunteer / beneficiary counts. Leave
   any of them blank if you don't have a reliable number — the public
   page hides a stat rather than showing `0`.
5. Upload the cover photograph and any additional program photos.
6. Save.

No code changes are needed for any of this. The program now appears under
**Past Programs** on `/programs`, the homepage's "Recent Activities"
section appears automatically (it only renders once a completed program
exists), the program's own page shows the full report, and its photos
appear both there and in the general gallery if also added there.

## 9. Note on Social Icons

`lucide-react` (as of the version pinned here) no longer ships brand/logo
icons (Facebook, Instagram, YouTube, LinkedIn). `src/components/icons/SocialIcons.tsx`
provides small outline icons in the same visual style for these four
platforms — swap them for official brand assets if you have them.

## 10. Replacing the Logo

`src/components/layout/Logo.tsx` currently renders a temporary text-based
HUDA mark. To use the real logo, replace its contents with a `next/image`
pointing at an asset in `public/branding/` — no other file needs to
change.
