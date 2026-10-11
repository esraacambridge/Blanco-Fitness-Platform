/*
# Transformations (Before / After)
Stores member transformation showcase entries with before/after images.
*/
CREATE TABLE IF NOT EXISTS transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text,
  before_image_url text NOT NULL,
  after_image_url text NOT NULL,
  caption_en text,
  caption_ar text,
  duration_weeks int,
  weight_before_kg numeric,
  weight_after_kg numeric,
  is_published boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "transformations_select_published" ON transformations;
CREATE POLICY "transformations_select_published" ON transformations FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_select_transformations" ON transformations;
CREATE POLICY "admin_select_transformations" ON transformations FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "admin_insert_transformations" ON transformations;
CREATE POLICY "admin_insert_transformations" ON transformations FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_transformations" ON transformations;
CREATE POLICY "admin_update_transformations" ON transformations FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_transformations" ON transformations;
CREATE POLICY "admin_delete_transformations" ON transformations FOR DELETE TO authenticated USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_transformations_published ON transformations(is_published);