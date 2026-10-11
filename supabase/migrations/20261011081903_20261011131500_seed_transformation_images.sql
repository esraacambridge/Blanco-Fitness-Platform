/*
# Seed transformation showcase images

1. Purpose
- Adds three visible sample transformation cards so the Before / After section is populated immediately after launch.
- The sample images are public fitness placeholders and can be replaced from the admin dashboard by uploading real member images.

2. Data
- Adds rows to `transformations` with names, before/after image URLs, captions, and published status.
- No existing rows are changed or deleted.

3. Security
- Uses the existing RLS policies on `transformations`.
- Public visitors can see only published rows; administrators can manage all rows.

4. Important notes
- Image replacement is performed through the dashboard upload control, not by editing URLs.
- The seed operation is idempotent and will not add duplicates if transformation rows already exist.
*/
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.transformations) THEN
    INSERT INTO public.transformations (name_en, name_ar, before_image_url, after_image_url, caption_en, caption_ar, duration_weeks, weight_before_kg, weight_after_kg, is_published, sort_order)
    VALUES
      ('Strength Journey', 'رحلة القوة', 'https://images.pexels.com/photos/8519692/pexels-photo-8519692.jpeg?auto=compress&cs=tinysrgb&w=940', 'https://images.pexels.com/photos/5327524/pexels-photo-5327524.jpeg?auto=compress&cs=tinysrgb&w=940', 'Consistent training creates visible change.', 'الالتزام بالتدريب يصنع فرقاً واضحاً.', 16, 82, 76, true, 1),
      ('Training Progress', 'تطور التدريب', 'https://images.pexels.com/photos/4162479/pexels-photo-4162479.jpeg?auto=compress&cs=tinysrgb&w=940', 'https://images.pexels.com/photos/12966654/pexels-photo-12966654.jpeg?auto=compress&cs=tinysrgb&w=940', 'A stronger routine, a stronger self.', 'روتين أقوى، ونسخة أقوى من نفسك.', 12, 78, 72, true, 2),
      ('New Confidence', 'ثقة جديدة', 'https://images.pexels.com/photos/39219650/pexels-photo-39219650.jpeg?auto=compress&cs=tinysrgb&w=940', 'https://images.pexels.com/photos/40080383/pexels-photo-40080383.jpeg?auto=compress&cs=tinysrgb&w=940', 'Progress built one session at a time.', 'التقدم يُبنى مع كل حصة تدريب.', 20, 74, 68, true, 3);
  END IF;
END $$;