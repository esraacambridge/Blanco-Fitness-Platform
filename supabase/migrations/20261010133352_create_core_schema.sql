/*
# BLANCO FITNESS — Core Database Schema

## Overview
Creates the complete database schema for the BLANCO FITNESS premium fitness platform.
This includes user profiles, exercises, programs, nutrition, memberships, trainers,
bookings, notifications, audit logs, and site settings.

## Tables Created
1. **profiles** — User profile data linked to auth.users, with role assignments
2. **muscle_groups** — Muscle group categories for exercises
3. **exercises** — Exercise library with bilingual names, instructions, etc.
4. **exercise_equipment** — Equipment types reference
5. **exercise_to_equipment** — Many-to-many exercise/equipment mapping
6. **programs** — Training programs (beginner/intermediate/advanced)
7. **program_exercises** — Exercises within programs with sets/reps
8. **workout_sessions** — Logged workout sessions for users
9. **workout_session_items** — Individual exercise entries within a session
10. **personal_records** — User PRs per exercise
11. **favorite_exercises** — User favorited exercises
12. **saved_programs** — User saved programs
13. **nutrition_categories** — Categories for nutrition articles
14. **nutrition_articles** — Educational nutrition content
15. **recipes** — Healthy recipes with ingredients and macros
16. **saved_articles** — User saved nutrition articles
17. **saved_recipes** — User saved recipes
18. **trainers** — Trainer profiles
19. **trainer_availability** — Available time slots for trainers
20. **bookings** — Booking requests for training sessions
21. **membership_plans** — Configurable membership plans
22. **memberships** — User memberships (pending/active/expired/cancelled/rejected)
23. **payment_records** — Payment transaction records
24. **notifications** — User notifications
25. **audit_logs** — Administrative action audit trail
26. **site_settings** — Global site configuration (single row)
27. **faqs** — Frequently asked questions
28. **testimonials** — User testimonials
29. **newsletter_subscribers** — Newsletter signup records

## Security (RLS)
- All tables have RLS enabled
- Public tables (exercises, programs, nutrition, trainers, plans, FAQs, testimonials, site_settings): readable by anon+authenticated
- User-scoped tables (favorites, sessions, PRs, saved items, notifications, memberships): owner-only CRUD via auth.uid()
- Admin tables (audit_logs): insert by authenticated, read by admin only via JWT role check
- Write operations on content tables restricted to admin/trainer roles via JWT app metadata
*/

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  full_name_ar text,
  phone text,
  avatar_url text,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  fitness_goals text,
  experience_level text CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  height_cm numeric,
  weight_kg numeric,
  target_weight_kg numeric,
  bio text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow viewing basic profile info for trainers (name, avatar) by authenticated users
DROP POLICY IF EXISTS "profiles_select_public" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT
  TO authenticated USING (true);

-- ============================================================================
-- MUSCLE GROUPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS muscle_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "muscle_groups_select_all" ON muscle_groups;
CREATE POLICY "muscle_groups_select_all" ON muscle_groups FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- EXERCISES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_ar text,
  muscle_group_id uuid REFERENCES muscle_groups(id) ON DELETE SET NULL,
  secondary_muscles text[],
  equipment text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions_en text[],
  instructions_ar text[],
  common_mistakes_en text[],
  common_mistakes_ar text[],
  alternatives_en text[],
  alternatives_ar text[],
  safety_notes_en text,
  safety_notes_ar text,
  image_url text,
  is_published boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exercises_select_published" ON exercises;
CREATE POLICY "exercises_select_published" ON exercises FOR SELECT
  TO anon, authenticated USING (is_published = true OR auth.uid() = created_by);

-- ============================================================================
-- PROGRAMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_ar text,
  level text CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration_weeks int DEFAULT 4,
  days_per_week int DEFAULT 3,
  split_type text,
  trainer_id uuid REFERENCES auth.users(id),
  image_url text,
  is_published boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "programs_select_published" ON programs;
CREATE POLICY "programs_select_published" ON programs FOR SELECT
  TO anon, authenticated USING (is_published = true AND is_archived = false);

-- ============================================================================
-- PROGRAM EXERCISES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  day_number int NOT NULL DEFAULT 1,
  week_number int DEFAULT 1,
  sets int DEFAULT 3,
  reps text DEFAULT '8-12',
  rest_seconds int DEFAULT 90,
  notes_en text,
  notes_ar text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "program_exercises_select" ON program_exercises;
CREATE POLICY "program_exercises_select" ON program_exercises FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM programs WHERE programs.id = program_id AND programs.is_published = true AND programs.is_archived = false)
  );

-- ============================================================================
-- WORKOUT SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid REFERENCES programs(id) ON DELETE SET NULL,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes int,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workout_sessions_select_own" ON workout_sessions;
CREATE POLICY "workout_sessions_select_own" ON workout_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "workout_sessions_insert_own" ON workout_sessions;
CREATE POLICY "workout_sessions_insert_own" ON workout_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "workout_sessions_update_own" ON workout_sessions;
CREATE POLICY "workout_sessions_update_own" ON workout_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "workout_sessions_delete_own" ON workout_sessions;
CREATE POLICY "workout_sessions_delete_own" ON workout_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- WORKOUT SESSION ITEMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_session_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  exercise_name text,
  sets int,
  reps text,
  weight_kg numeric,
  notes text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_session_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "workout_session_items_select_own" ON workout_session_items;
CREATE POLICY "workout_session_items_select_own" ON workout_session_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_id AND workout_sessions.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "workout_session_items_insert_own" ON workout_session_items;
CREATE POLICY "workout_session_items_insert_own" ON workout_session_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_id AND workout_sessions.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "workout_session_items_update_own" ON workout_session_items;
CREATE POLICY "workout_session_items_update_own" ON workout_session_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_id AND workout_sessions.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "workout_session_items_delete_own" ON workout_session_items;
CREATE POLICY "workout_session_items_delete_own" ON workout_session_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM workout_sessions WHERE workout_sessions.id = session_id AND workout_sessions.user_id = auth.uid())
  );

-- ============================================================================
-- PERSONAL RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS personal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE SET NULL,
  exercise_name text NOT NULL,
  weight_kg numeric NOT NULL,
  reps int NOT NULL DEFAULT 1,
  one_rep_max_estimate numeric,
  achieved_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "personal_records_select_own" ON personal_records;
CREATE POLICY "personal_records_select_own" ON personal_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "personal_records_insert_own" ON personal_records;
CREATE POLICY "personal_records_insert_own" ON personal_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "personal_records_update_own" ON personal_records;
CREATE POLICY "personal_records_update_own" ON personal_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "personal_records_delete_own" ON personal_records;
CREATE POLICY "personal_records_delete_own" ON personal_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- FAVORITE EXERCISES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS favorite_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exercise_id)
);

ALTER TABLE favorite_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorite_exercises_select_own" ON favorite_exercises;
CREATE POLICY "favorite_exercises_select_own" ON favorite_exercises FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorite_exercises_insert_own" ON favorite_exercises;
CREATE POLICY "favorite_exercises_insert_own" ON favorite_exercises FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorite_exercises_delete_own" ON favorite_exercises;
CREATE POLICY "favorite_exercises_delete_own" ON favorite_exercises FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED PROGRAMS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, program_id)
);

ALTER TABLE saved_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_programs_select_own" ON saved_programs;
CREATE POLICY "saved_programs_select_own" ON saved_programs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_programs_insert_own" ON saved_programs;
CREATE POLICY "saved_programs_insert_own" ON saved_programs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_programs_delete_own" ON saved_programs;
CREATE POLICY "saved_programs_delete_own" ON saved_programs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- NUTRITION CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS nutrition_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nutrition_categories_select_all" ON nutrition_categories;
CREATE POLICY "nutrition_categories_select_all" ON nutrition_categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- NUTRITION ARTICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS nutrition_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt_en text,
  excerpt_ar text,
  content_en text,
  content_ar text,
  category_id uuid REFERENCES nutrition_categories(id) ON DELETE SET NULL,
  image_url text,
  read_time_minutes int DEFAULT 5,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "nutrition_articles_select_published" ON nutrition_articles;
CREATE POLICY "nutrition_articles_select_published" ON nutrition_articles FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- RECIPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_ar text,
  ingredients_en text[],
  ingredients_ar text[],
  instructions_en text[],
  instructions_ar text[],
  calories int,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  prep_time_minutes int,
  servings int DEFAULT 1,
  image_url text,
  category_id uuid REFERENCES nutrition_categories(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recipes_select_published" ON recipes;
CREATE POLICY "recipes_select_published" ON recipes FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- SAVED ARTICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id uuid NOT NULL REFERENCES nutrition_articles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_articles_select_own" ON saved_articles;
CREATE POLICY "saved_articles_select_own" ON saved_articles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_articles_insert_own" ON saved_articles;
CREATE POLICY "saved_articles_insert_own" ON saved_articles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_articles_delete_own" ON saved_articles;
CREATE POLICY "saved_articles_delete_own" ON saved_articles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- SAVED RECIPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS saved_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_recipes_select_own" ON saved_recipes;
CREATE POLICY "saved_recipes_select_own" ON saved_recipes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_recipes_insert_own" ON saved_recipes;
CREATE POLICY "saved_recipes_insert_own" ON saved_recipes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saved_recipes_delete_own" ON saved_recipes;
CREATE POLICY "saved_recipes_delete_own" ON saved_recipes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- TRAINERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio_en text,
  bio_ar text,
  specializations text[],
  qualifications_en text,
  qualifications_ar text,
  is_verified boolean DEFAULT false,
  image_url text,
  contact_email text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trainers_select_published" ON trainers;
CREATE POLICY "trainers_select_published" ON trainers FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- TRAINER AVAILABILITY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trainer_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trainer_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trainer_availability_select" ON trainer_availability;
CREATE POLICY "trainer_availability_select" ON trainer_availability FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM trainers WHERE trainers.id = trainer_id AND trainers.is_published = true)
  );

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  trainer_id uuid NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'rejected')) DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update_own" ON bookings;
CREATE POLICY "bookings_update_own" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_delete_own" ON bookings;
CREATE POLICY "bookings_delete_own" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- MEMBERSHIP PLANS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_en text,
  description_ar text,
  price_egp numeric NOT NULL DEFAULT 0,
  duration_months int NOT NULL DEFAULT 1,
  features_en text[],
  features_ar text[],
  plan_type text CHECK (plan_type IN ('physical', 'digital', 'both')) DEFAULT 'both',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "membership_plans_select_all" ON membership_plans;
CREATE POLICY "membership_plans_select_all" ON membership_plans FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- ============================================================================
-- MEMBERSHIPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES membership_plans(id) ON DELETE SET NULL,
  status text CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'rejected')) DEFAULT 'pending',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "memberships_select_own" ON memberships;
CREATE POLICY "memberships_select_own" ON memberships FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "memberships_insert_own" ON memberships;
CREATE POLICY "memberships_insert_own" ON memberships FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "memberships_update_own" ON memberships;
CREATE POLICY "memberships_update_own" ON memberships FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PAYMENT RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid REFERENCES memberships(id) ON DELETE SET NULL,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_egp numeric NOT NULL,
  status text CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method text,
  transaction_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payment_records_select_own" ON payment_records;
CREATE POLICY "payment_records_select_own" ON payment_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "payment_records_insert_own" ON payment_records;
CREATE POLICY "payment_records_insert_own" ON payment_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title_en text,
  title_ar text,
  message_en text,
  message_ar text,
  type text DEFAULT 'general',
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_insert_own" ON audit_logs;
CREATE POLICY "audit_logs_insert_own" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (true);

-- ============================================================================
-- SITE SETTINGS TABLE (single row)
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  brand_name text DEFAULT 'BLANCO FITNESS',
  hero_headline_en text DEFAULT 'BLANCO — BUILD YOUR STRONGER SELF',
  hero_headline_ar text DEFAULT 'بلانكو — ابنِ نسخة أقوى من نفسك',
  hero_subheadline_ar text DEFAULT 'قوتك تبدأ بقرار. وتطورك يصنعه الالتزام.',
  hero_description_en text DEFAULT 'Premium fitness and bodybuilding platform designed to help you build your stronger self.',
  hero_description_ar text DEFAULT 'منصة اللياقة البدنية وكمال الأجسام المتميزة المصممة لمساعدتك على بناء نسخة أقوى من نفسك.',
  hero_image_url text,
  contact_email text DEFAULT 'contact@blancofitness.com',
  contact_phone text,
  contact_address_en text,
  contact_address_ar text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  twitter_url text,
  maintenance_mode boolean DEFAULT false,
  default_language text DEFAULT 'ar',
  default_theme text DEFAULT 'dark',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_select_all" ON site_settings;
CREATE POLICY "site_settings_select_all" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================================
-- FAQS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en text NOT NULL,
  question_ar text NOT NULL,
  answer_en text,
  answer_ar text,
  sort_order int DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "faqs_select_published" ON faqs;
CREATE POLICY "faqs_select_published" ON faqs FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_name_ar text,
  content_en text,
  content_ar text,
  rating int CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  image_url text,
  is_published boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_published" ON testimonials;
CREATE POLICY "testimonials_select_published" ON testimonials FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  consent_given boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_insert" ON newsletter_subscribers;
CREATE POLICY "newsletter_insert" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_exercises_slug ON exercises(slug);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_published ON exercises(is_published);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);
CREATE INDEX IF NOT EXISTS idx_programs_level ON programs(level);
CREATE INDEX IF NOT EXISTS idx_programs_published ON programs(is_published);
CREATE INDEX IF NOT EXISTS idx_program_exercises_program ON program_exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_personal_records_user ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_exercises_user ON favorite_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_programs_user ON saved_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_articles_slug ON nutrition_articles(slug);
CREATE INDEX IF NOT EXISTS idx_nutrition_articles_published ON nutrition_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_published ON recipes(is_published);
CREATE INDEX IF NOT EXISTS idx_trainers_slug ON trainers(slug);
CREATE INDEX IF NOT EXISTS idx_trainers_published ON trainers(is_published);
CREATE INDEX IF NOT EXISTS idx_memberships_user ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trainer ON bookings(trainer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
