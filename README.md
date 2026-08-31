# trip-timeline — monorepo (MVP base)

A personalized countdown page: a live countdown, a day-by-day timeline of where
someone is, and a note. Built for long-distance couples first.

> **Branch note.** This restructure lives on `develop`. `main` still holds the
> single hand-authored page ("donde está juanjo") and is what Vercel production
> serves. Nothing here is deployed until `main` is deliberately updated and the
> Vercel project's **Root Directory** is pointed at `apps/renderer`.

## Layout

```
apps/
  renderer/   public site. "/" = the seed page (static, no network),
              "/p/:slug" = a published page fetched from Supabase.
  builder/    authenticated page builder (form + live preview). Skeleton.
packages/
  shared/     Vue components, composables, the PageConfig schema
              (normalizeConfig / toRenderModel), and tokens.css.
supabase/     migrations (pages / orders / RLS) + local seed.
```

`packages/shared` is the render surface. Both apps import from `@trip/shared`;
neither app imports the other.

## Run

```bash
npm install                 # workspaces link @trip/shared into both apps
npm run dev:renderer        # http://localhost:5173  — "/" is the seed page
npm run dev:builder         # http://localhost:5174  — needs Supabase, else demo mode
npm run build               # builds both apps
```

Copy `apps/*/.env.example` → `apps/*/.env` and fill Supabase keys to leave demo
mode. Local Supabase:

```bash
supabase start
supabase db reset           # applies migrations + seed
```

## The config model

One `PageConfig` object per page (stored as `pages.config` jsonb, also the shape
the builder edits). `@trip/shared/lib/normalizeConfig.js` documents it and fills
defaults; `toRenderModel.js` flattens it to what the components read. The seed
page is `apps/renderer/src/configs/juanjo.js`.

## What's stubbed (M1)

Payment (LemonSqueezy checkout + webhook → `plan='paid'`), dynamic OG images,
i18n strings, extra themes, photo uploads, password-protected pages, custom
domains. See `.claude/plans/` for the full plan.
