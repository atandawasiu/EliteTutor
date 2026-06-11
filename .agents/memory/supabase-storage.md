---
name: Supabase Storage Blocked
description: Why Supabase Storage can't be used directly and what the workaround is.
---

# Supabase Storage is not usable with the anon key

## Rule

Do NOT try to create Supabase Storage buckets using the anon key or VITE_SUPABASE_ANON_KEY. It returns 403 (RLS block). Bucket creation requires the service role key which is not available in the environment.

**Why:** The Supabase project (xdkmreqkkcwujimdhbrq) has RLS enabled on storage.buckets. The anon key cannot create buckets. We don't have SUPABASE_SERVICE_ROLE_KEY in the environment.

**How to apply:** Use the api-server upload proxy (POST /api/upload) for all file uploads. See file-upload-arch.md for details.
