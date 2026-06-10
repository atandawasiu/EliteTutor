# Elite Tutor

Africa's leading exam preparation platform for JAMB, WAEC, NECO, IELTS, SAT, GRE and 12+ exams — with AI-powered CBT, score tracking, smart insights, and bulk question management.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/myprep run dev` — run the MyPrep frontend (port 22454)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + TanStack Router (file-based SPA)
- Backend: Express 5 (api-server)
- Database: Supabase (PostgreSQL) — external managed instance
- Auth: Supabase Auth (email/password, with user_roles table for admin/contributor/student/agent/cbt_centre/edu_consultant)
- Styling: Tailwind CSS v4, shadcn/ui components, framer-motion
- AI: Supabase Edge Functions (ai-chat, parse-questions) using Lovable AI gateway
- Math/Science: WolframAlpha Full Access API (proxied via /api/wolfram)

## Where things live

- `artifacts/myprep/src/routes/` — all pages (TanStack Router file-based routing)
- `artifacts/myprep/src/components/` — shared components (ui/, layout/, landing/, admin/)
- `artifacts/myprep/src/hooks/` — useAuth, useTheme, useSiteSettings, useSiteMenu
- `artifacts/myprep/src/integrations/supabase/` — Supabase client + generated types
- `artifacts/api-server/src/routes/wolfram.ts` — WolframAlpha proxy route

## Architecture decisions

- TanStack Start (SSR) was replaced with standard TanStack Router (SPA) for Replit compatibility
- Supabase Edge Functions handle AI features (ai-chat, parse-questions) — no Replit server needed for AI
- WolframAlpha Full Access API is proxied through the Express api-server to keep the API key server-side
- Admin bulk importer supports 1M+ questions via chunked CSV upload (500 rows/batch) with progress bar
- All SSR-specific APIs (HeadContent, Scripts, shellComponent) were removed; standard Vite SPA setup used instead

## Product

- **Landing page**: Hero, exam categories, features, testimonials, CTA
- **CBT engine**: /cbt/:subjectId — timed mock exams with AI explanation widget
- **Practice builder**: /practice — custom sessions with subject/count/time picker
- **Browse exams**: /exams — all exams and subjects from Supabase
- **Admin panel**: /admin — questions, exams, subjects, schools, blog, announcements, site settings, bulk importer
- **Community**: /community — discussion threads
- **Blog**: /blog — articles with Markdown rendering
- **Tools**: /tools — Aggregate calculator + WolframAlpha maths/science engine
- **Schools**: /schools — partner school listings
- **Leaderboard**: /leaderboard — gamification rankings
- **Partner portals**: /portal (agent, cbt_centre, edu_consultant)
- **Pricing**: /pricing — free vs premium plans

## User preferences

- No Google Maps integration
- WolframAlpha Full Access API key: stored as WOLFRAMALPHA_APP_ID env var
- Supabase project: xdkmreqkkcwujimdhbrq
- Admin can upload 1M+ questions via CSV (chunked in batches of 500)

## Gotchas

- Supabase anon key is stored as VITE_SUPABASE_ANON_KEY (not PUBLISHABLE_KEY)
- TanStack Router auto-generates routeTree.gen.ts on first Vite dev start — do not edit it manually
- The head() API from TanStack Start is not available in SPA mode — use index.html for meta tags
- WolframAlpha API key must stay server-side (api-server); never expose in frontend env vars

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Supabase types: `artifacts/myprep/src/integrations/supabase/types.ts`
