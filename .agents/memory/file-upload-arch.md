---
name: File Upload Architecture
description: How file uploads work in Elite Tutor — API server multer proxy, URL construction, and the reusable ImageUpload component.
---

# File Upload Architecture

## How it works

POST /api/upload (multipart/form-data, field name: "file") → Express api-server with multer → saves to `artifacts/api-server/uploads/` → returns `{ url, filename, size }`.

GET /api/uploads/:filename → Express static file serving from the same directory.

**URL construction**: Uses `REPLIT_DOMAINS` env var (split on comma, take first) to build `https://<domain>/api/uploads/<filename>`. Falls back to relative `/api/uploads/<filename>` if domain unavailable. Never uses `localhost` or internal IPs.

**Why:** Supabase Storage requires service role key to create buckets; anon key returns 403. Using the api-server avoids this dependency entirely.

## ImageUpload component

`artifacts/myprep/src/components/ui/ImageUpload.tsx` — reusable, supports:
- Drag & drop or click to upload
- Image preview with remove button
- "Use URL instead" toggle for pasting external URLs
- Accepts JPEG/PNG/WebP/GIF/SVG, max 10MB

## Wired up in
- `artifacts/myprep/src/routes/profile.tsx` — avatar_url (profile photo)
- `artifacts/myprep/src/components/admin/SiteSettingsManager.tsx` — logo_url (site logo)
- `artifacts/myprep/src/routes/admin.tsx` BlogManager — cover_url (blog post cover)
- `artifacts/myprep/src/routes/admin.tsx` SchoolsManager — logo_url (school logo)

**Why:** Express static dir + multer is zero-dependency from the Supabase perspective and works in both dev and production.

**How to apply:** Any new image field should use `<ImageUpload value={url} onChange={setUrl} />` and will POST to /api/upload automatically.
