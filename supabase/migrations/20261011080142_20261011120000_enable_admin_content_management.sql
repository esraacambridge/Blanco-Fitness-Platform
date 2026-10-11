/*
# Enable secure admin content management

1. Public content tables
- Grants authenticated administrators full CRUD access to the existing public content tables used by the website.
- Keeps anonymous visitors limited to the existing published/public read policies.

2. Membership and site management
- Grants administrators access to review and update memberships and site settings.

3. Media uploads
- Creates the public `site-media` bucket for images intentionally displayed on the public website.
- Only authenticated administrators may upload, replace, or delete media in that bucket.

4. Security
- Every administrative policy checks the server-side `is_admin()` function.
- No anonymous write access is added.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-media', 'site-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'muscle_groups', 'exercises', 'programs', 'program_exercises',
    'nutrition_categories', 'nutrition_articles', 'recipes', 'trainers',
    'trainer_availability', 'membership_plans', 'site_settings', 'faqs',
    'testimonials'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_select_' || table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_insert_' || table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_update_' || table_name, table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_delete_' || table_name, table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.is_admin())', 'admin_select_' || table_name, table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin())', 'admin_insert_' || table_name, table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', 'admin_update_' || table_name, table_name);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.is_admin())', 'admin_delete_' || table_name, table_name);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "admin_select_memberships" ON public.memberships;
CREATE POLICY "admin_select_memberships" ON public.memberships FOR SELECT TO authenticated USING (public.is_admin());
DROP POLICY IF EXISTS "admin_update_memberships" ON public.memberships;
CREATE POLICY "admin_update_memberships" ON public.memberships FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_select_profiles" ON public.profiles;
CREATE POLICY "admin_select_profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_upload_site_media" ON storage.objects;
CREATE POLICY "admin_upload_site_media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "admin_update_site_media" ON storage.objects;
CREATE POLICY "admin_update_site_media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-media' AND public.is_admin())
WITH CHECK (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "admin_delete_site_media" ON storage.objects;
CREATE POLICY "admin_delete_site_media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-media' AND public.is_admin());

DROP POLICY IF EXISTS "public_read_site_media" ON storage.objects;
CREATE POLICY "public_read_site_media" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'site-media');