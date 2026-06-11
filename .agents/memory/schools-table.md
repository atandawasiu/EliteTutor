---
name: Schools Table Column Names
description: The schools table uses logo_url for the image field, not image_url.
---

# Schools Table — Image Column

The `schools` table uses `logo_url` (not `image_url`) for the school's photo/logo.

`image_url` belongs to the `content_blocks` table.

**Why:** Easy to confuse since both are image URL fields on different tables. The Supabase types confirm this at lines 817-855 (logo_url on schools) and 365-401 (image_url on content_blocks).
