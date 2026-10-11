export type UserRole = 'super_admin' | 'admin' | 'trainer' | 'member';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type MembershipStatus = 'pending' | 'active' | 'expired' | 'cancelled' | 'rejected';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';

export type Language = 'ar' | 'en';

export type Theme = 'dark' | 'light';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  full_name_ar: string | null;
  phone: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  fitness_goals: string | null;
  experience_level: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  target_weight_kg: number | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroup {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export interface Exercise {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  muscle_group_id: string | null;
  muscle_group?: MuscleGroup | null;
  secondary_muscles: string[] | null;
  equipment: string[] | null;
  difficulty: Difficulty | null;
  instructions_en: string[] | null;
  instructions_ar: string[] | null;
  common_mistakes_en: string[] | null;
  common_mistakes_ar: string[] | null;
  alternatives_en: string[] | null;
  alternatives_ar: string[] | null;
  safety_notes_en: string | null;
  safety_notes_ar: string | null;
  image_url: string | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  level: Difficulty | null;
  duration_weeks: number;
  days_per_week: number;
  split_type: string | null;
  trainer_id: string | null;
  image_url: string | null;
  is_published: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramExercise {
  id: string;
  program_id: string;
  exercise_id: string | null;
  exercise?: Exercise | null;
  exercise_name?: string | null;
  day_number: number;
  week_number: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes_en: string | null;
  notes_ar: string | null;
  sort_order: number;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id: string | null;
  session_date: string;
  duration_minutes: number | null;
  notes: string | null;
  completed: boolean;
  created_at: string;
}

export interface WorkoutSessionItem {
  id: string;
  session_id: string;
  exercise_id: string | null;
  exercise_name: string | null;
  sets: number | null;
  reps: string | null;
  weight_kg: number | null;
  notes: string | null;
  sort_order: number;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string | null;
  exercise_name: string;
  weight_kg: number;
  reps: number;
  one_rep_max_estimate: number | null;
  achieved_date: string;
  notes: string | null;
}

export interface FavoriteExercise {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise?: Exercise | null;
}

export interface SavedProgram {
  id: string;
  user_id: string;
  program_id: string;
  program?: Program | null;
}

export interface NutritionCategory {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  sort_order: number;
}

export interface NutritionArticle {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  content_en: string | null;
  content_ar: string | null;
  category_id: string | null;
  category?: NutritionCategory | null;
  image_url: string | null;
  read_time_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  ingredients_en: string[] | null;
  ingredients_ar: string[] | null;
  instructions_en: string[] | null;
  instructions_ar: string[] | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  prep_time_minutes: number | null;
  servings: number;
  image_url: string | null;
  category_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  user_id: string | null;
  name_en: string;
  name_ar: string;
  slug: string;
  bio_en: string | null;
  bio_ar: string | null;
  specializations: string[] | null;
  qualifications_en: string | null;
  qualifications_ar: string | null;
  is_verified: boolean;
  image_url: string | null;
  contact_email: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  description_en: string | null;
  description_ar: string | null;
  price_egp: number;
  duration_months: number;
  features_en: string[] | null;
  features_ar: string[] | null;
  plan_type: string;
  is_active: boolean;
  sort_order: number;
}

export interface Membership {
  id: string;
  user_id: string;
  plan_id: string;
  plan?: MembershipPlan | null;
  status: MembershipStatus;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  membership_id: string | null;
  user_id: string;
  amount_egp: number;
  status: PaymentStatus;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title_en: string | null;
  title_ar: string | null;
  message_en: string | null;
  message_ar: string | null;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  brand_name: string;
  hero_headline_en: string;
  hero_headline_ar: string;
  hero_subheadline_ar: string;
  hero_description_en: string;
  hero_description_ar: string;
  hero_image_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  contact_address_en: string | null;
  contact_address_ar: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  twitter_url: string | null;
  maintenance_mode: boolean;
  default_language: string;
  default_theme: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string | null;
  answer_ar: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_name_ar: string | null;
  content_en: string | null;
  content_ar: string | null;
  rating: number;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
}

export interface Transformation {
  id: string;
  name_en: string;
  name_ar: string | null;
  before_image_url: string;
  after_image_url: string;
  caption_en: string | null;
  caption_ar: string | null;
  duration_weeks: number | null;
  weight_before_kg: number | null;
  weight_after_kg: number | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  consent_given: boolean;
  created_at: string;
}

export interface Award {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  image_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}
