/*
# Create admin user and awards table

## What this migration does

1. Creates an auth user for the admin panel with email adam@gmail.com and password adam1234.
2. Sets that user's role to 'admin' via raw_app_meta_data (used by get_user_role / is_admin functions).
3. Creates a matching profile row in the profiles table.
4. Creates a new `awards` table to store certifications, trophies, and achievement images.
5. Enables RLS on `awards` and creates admin-only CRUD policies + public read policy.

## New Tables

- `awards`
  - id (uuid, PK)
  - title_en (text, not null) — award title in English
  - title_ar (text, nullable) — award title in Arabic
  - description_en (text, nullable) — description in English
  - description_ar (text, nullable) — description in Arabic
  - image_url (text, nullable) — URL to the award image stored in site-media bucket
  - is_published (boolean, default false)
  - sort_order (int, default 0)
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

## Security

- RLS enabled on `awards`.
- Public (anon + authenticated) can SELECT published awards.
- Only admin / super_admin can INSERT, UPDATE, DELETE awards.
- Admin role is checked via the existing `is_admin()` SECURITY DEFINER function.

## Important Notes

1. The admin auth user is created with `auth.users` insert + bcrypt hash. The password is adam1234.
2. The profile row links to the auth user via the same UUID.
3. The raw_app_meta_data 'role' = 'admin' makes is_admin() return true for this user.
*/

-- 1. Create the admin auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'adam@gmail.com',
  crypt('adam1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role":"admin"}'::jsonb,
  '{"full_name":"Adam"}'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'adam@gmail.com'
);

-- 2. Create matching profile
INSERT INTO profiles (id, email, full_name)
SELECT id, email, 'Adam'
FROM auth.users
WHERE email = 'adam@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'adam@gmail.com')
);

-- 3. Create awards table
CREATE TABLE IF NOT EXISTS awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text,
  description_en text,
  description_ar text,
  image_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- Public can read published awards
DROP POLICY IF EXISTS "read_awards" ON awards;
CREATE POLICY "read_awards"
ON awards FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Admin can read all awards
DROP POLICY IF EXISTS "admin_read_awards" ON awards;
CREATE POLICY "admin_read_awards"
ON awards FOR SELECT
TO authenticated
USING (is_admin());

-- Admin can insert awards
DROP POLICY IF EXISTS "admin_insert_awards" ON awards;
CREATE POLICY "admin_insert_awards"
ON awards FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Admin can update awards
DROP POLICY IF EXISTS "admin_update_awards" ON awards;
CREATE POLICY "admin_update_awards"
ON awards FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Admin can delete awards
DROP POLICY IF EXISTS "admin_delete_awards" ON awards;
CREATE POLICY "admin_delete_awards"
ON awards FOR DELETE
TO authenticated
USING (is_admin());
