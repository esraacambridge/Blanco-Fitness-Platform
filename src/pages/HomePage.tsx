import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dumbbell, Heart, BookOpen, Users, ChevronLeft, ChevronRight,
  Star, Plus, Minus, Send, ArrowRight, Sparkles, TrendingUp,
  Activity, Zap, Award, Shield
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert, EmptyState, LoadingSpinner } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Program, Exercise, Trainer, MembershipPlan, FAQ as FAQType, Testimonial, MuscleGroup, NutritionArticle, SiteSettings, Transformation, Award as AwardType } from '@/types';

const HERO_IMAGE = '/public/esraa.png';
const PROGRAM_IMAGE = 'https://images.pexels.com/photos/896058/pexels-photo-896058.jpeg?auto=compress&cs=tinysrgb&w=940';

export function HomePage() {
  const { t, lang } = useI18n();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [articles, setArticles] = useState<NutritionArticle[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [transformationIndex, setTransformationIndex] = useState(0);
  const [transformationSide, setTransformationSide] = useState<'before' | 'after'>('before');
  const transformationTouchStart = useRef<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [
          programsRes, exercisesRes, muscleRes, trainersRes,
          articlesRes, plansRes, faqsRes, testimonialsRes, transformationsRes, awardsRes, settingsRes
        ] = await Promise.all([
          supabase.from('programs').select('*').eq('is_published', true).eq('is_archived', false).limit(4),
          supabase.from('exercises').select('*, muscle_group:muscle_groups(*)').eq('is_published', true).limit(6),
          supabase.from('muscle_groups').select('*').order('sort_order'),
          supabase.from('trainers').select('*').eq('is_published', true).limit(3),
          supabase.from('nutrition_articles').select('*, category:nutrition_categories(*)').eq('is_published', true).limit(3),
          supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('faqs').select('*').eq('is_published', true).order('sort_order'),
          supabase.from('testimonials').select('*').eq('is_published', true).order('sort_order'),
          supabase.from('transformations').select('*').eq('is_published', true).order('sort_order').limit(6),
          supabase.from('awards').select('*').eq('is_published', true).order('sort_order'),
          supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        ]);

        if (programsRes.data) setPrograms(programsRes.data as Program[]);
        if (exercisesRes.data) setExercises(exercisesRes.data as Exercise[]);
        if (muscleRes.data) setMuscleGroups(muscleRes.data as MuscleGroup[]);
        if (trainersRes.data) setTrainers(trainersRes.data as Trainer[]);
        if (articlesRes.data) setArticles(articlesRes.data as NutritionArticle[]);
        if (plansRes.data) setPlans(plansRes.data as MembershipPlan[]);
        if (faqsRes.data) setFaqs(faqsRes.data as FAQType[]);
        if (testimonialsRes.data) setTestimonials(testimonialsRes.data as Testimonial[]);
        if (transformationsRes.data) setTransformations(transformationsRes.data as Transformation[]);
        if (awardsRes.data) setAwards(awardsRes.data as AwardType[]);
        if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (location.hash === '#transformations' && transformations.length > 0) {
      window.setTimeout(() => document.getElementById('transformations')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [location.hash, transformations.length]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError('');

    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterError(lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
      setNewsletterStatus('error');
      return;
    }
    if (!newsletterConsent) {
      setNewsletterError(lang === 'ar' ? 'يرجى الموافقة على تلقي النشرة البريدية' : 'Please consent to receive the newsletter');
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('loading');
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: newsletterEmail, consent_given: true });

    if (insertError) {
      if (insertError.code === '23505') {
        setNewsletterStatus('success');
        setNewsletterEmail('');
      } else {
        setNewsletterError(insertError.message);
        setNewsletterStatus('error');
      }
    } else {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    }
  };

  const isAr = lang === 'ar';
  const activeTransformation = transformations[transformationIndex];

  const changeTransformation = (direction: -1 | 1) => {
    if (transformations.length === 0) return;
    setTransformationIndex((current) => (current + direction + transformations.length) % transformations.length);
    setTransformationSide('before');
  };

  const changeTransformationSide = (direction: -1 | 1) => {
    if (direction === 1 && transformationSide === 'before') {
      setTransformationSide('after');
    } else if (direction === -1 && transformationSide === 'after') {
      setTransformationSide('before');
    } else {
      changeTransformation(direction);
    }
  };

  const handleTransformationTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    transformationTouchStart.current = event.touches[0]?.clientX ?? null;
  };

  const handleTransformationTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = transformationTouchStart.current;
    const end = event.changedTouches[0]?.clientX;
    transformationTouchStart.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < 40) return;
    changeTransformationSide(end < start ? 1 : -1);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={settings?.hero_image_url || HERO_IMAGE}
            alt="BLANCO Fitness Hero"
            className="w-full h-full object-cover scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blanco-black/80 via-blanco-black/70 to-blanco-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-blanco-black/80 to-transparent" />
          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>

        {/* Gold radial glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-radial pointer-events-none" />

        <div className="relative container-blanco z-10 text-center py-20">
          <div className="animate-fade-in-down">
            <div className="section-badge">
              <Sparkles className="h-4 w-4 text-blanco-gold" />
              <span>
                {isAr ? 'منصة اللياقة المتميزة' : 'Premium Fitness Platform'}
              </span>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blanco-white leading-tight animate-fade-in-up max-w-4xl mx-auto text-balance mt-6">
            {isAr ? (
              <>
                <span className="text-gradient-gold text-glow-gold">بلانكو</span> — ابنِ نسخة أقوى من نفسك
              </>
            ) : (
              <>
                <span className="text-gradient-gold text-glow-gold">BLANCO</span> — BUILD YOUR STRONGER SELF
              </>
            )}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-blanco-gold font-arabic font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            قوتك تبدأ بقرار. وتطورك يصنعه الالتزام.
          </p>

          <p className="mt-4 text-sm md:text-base text-blanco-muted max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {isAr
              ? 'منصة اللياقة البدنية وكمال الأجسام المتميزة المصممة لمساعدتك على بناء نسخة أقوى من نفسك.'
              : 'Premium fitness and bodybuilding platform designed to help you build your stronger self.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button variant="gold" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.start')} <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <Link to="/programs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('hero.cta.explore')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-blanco-secondary border-y border-blanco-gold/10">
        <div className="container-blanco py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Dumbbell, value: '24+', label: isAr ? 'تمرين مفصل' : 'Detailed Exercises' },
              { icon: TrendingUp, value: '4', label: isAr ? 'برامج تدريبية' : 'Training Programs' },
              { icon: Users, value: '3', label: isAr ? 'مدربون معتمدون' : 'Certified Trainers' },
              { icon: Award, value: '3', label: isAr ? 'خطط عضوية' : 'Membership Plans' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex p-3 rounded-xl bg-blanco-elevated border border-blanco-gold/20 mb-3 transition-all duration-300 group-hover:border-blanco-gold/50 group-hover:shadow-gold">
                  <stat.icon className="h-6 w-6 text-blanco-gold" />
                </div>
                <p className="font-display text-3xl font-bold text-blanco-white transition-colors duration-300 group-hover:text-blanco-gold">{stat.value}</p>
                <p className="text-xs text-blanco-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20">
        <div className="container-blanco">
          <SectionHeader title={t('section.featuredPrograms')} description={t('section.featuredProgramsDesc')} />
          {error && <Alert type="error" message={error} />}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : programs.length === 0 ? (
            <EmptyState icon={Dumbbell} title={t('common.noResults')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program, i) => (
                <Link key={program.id} to={`/programs/${program.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Card hover className="h-full overflow-hidden group">
                    <div className="relative h-48 overflow-hidden bg-blanco-secondary">
                      <img
                        src={program.image_url || PROGRAM_IMAGE}
                        alt={isAr ? program.title_ar : program.title_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blanco-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          program.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          program.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {t(`difficulty.${program.level}`)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-blanco-white mb-2 group-hover:text-blanco-gold transition-colors">
                        {isAr ? program.title_ar : program.title_en}
                      </h3>
                      <p className="text-sm text-blanco-muted line-clamp-2 mb-3">
                        {isAr ? program.description_ar : program.description_en}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-blanco-muted">
                        <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {program.duration_weeks} {t('common.weeks')}</span>
                        <span className="flex items-center gap-1"><Dumbbell className="h-3 w-3" /> {program.days_per_week} {t('common.days')}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/programs">
              <Button variant="outline">{t('common.viewAll')} <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Muscle Groups */}
      <section className="py-20 bg-blanco-secondary">
        <div className="container-blanco">
          <SectionHeader title={t('section.muscleGroups')} description={t('section.muscleGroupsDesc')} />
          {loading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {muscleGroups.map((group, i) => (
                <Link
                  key={group.id}
                  to={`/exercises?muscle=${group.slug}`}
                  className="group animate-scale-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <Card hover className="p-6 text-center h-full">
                    <div className="inline-flex p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20 mb-3 group-hover:bg-blanco-gold/20 group-hover:border-blanco-gold/40 group-hover:shadow-gold transition-all duration-300">
                      <Dumbbell className="h-6 w-6 text-blanco-gold" />
                    </div>
                    <p className="text-sm font-medium text-blanco-white group-hover:text-blanco-gold transition-colors">
                      {isAr ? group.name_ar : group.name_en}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Exercise Preview */}
      <section className="py-20">
        <div className="container-blanco">
          <SectionHeader title={t('section.exercisePreview')} description={t('section.exercisePreviewDesc')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : exercises.length === 0 ? (
            <EmptyState icon={Dumbbell} title={t('common.noResults')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise, i) => (
                <Link key={exercise.id} to={`/exercises/${exercise.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <Card hover className="h-full group">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors">
                            {isAr ? exercise.name_ar : exercise.name_en}
                          </h3>
                          <p className="text-xs text-blanco-muted mt-1">
                            {exercise.muscle_group ? (isAr ? exercise.muscle_group.name_ar : exercise.muscle_group.name_en) : ''}
                          </p>
                        </div>
                        {exercise.difficulty && (
                          <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                            exercise.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            exercise.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {t(`difficulty.${exercise.difficulty}`)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-blanco-muted line-clamp-2">
                        {isAr ? exercise.description_ar : exercise.description_en}
                      </p>
                      {exercise.equipment && exercise.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {exercise.equipment.slice(0, 3).map((eq, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blanco-secondary text-blanco-muted">{eq}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/exercises">
              <Button variant="outline">{t('common.viewAll')} <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trainers */}
      <section className="py-20 bg-blanco-secondary">
        <div className="container-blanco">
          <SectionHeader title={t('section.trainers')} description={t('section.trainersDesc')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : trainers.length === 0 ? (
            <EmptyState icon={Users} title={t('common.noResults')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trainers.map((trainer, i) => (
                <Link key={trainer.id} to={`/trainers/${trainer.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Card hover className="h-full text-center group overflow-hidden">
                    <div className="relative h-56 overflow-hidden bg-blanco-elevated">
                      <img
                        src={trainer.image_url || 'https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=940'}
                        alt={isAr ? trainer.name_ar : trainer.name_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blanco-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {trainer.is_verified && (
                        <div className="absolute top-3 right-3 p-1.5 rounded-full bg-blanco-gold/90 shadow-gold">
                          <Shield className="h-3 w-3 text-blanco-black" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors">
                        {isAr ? trainer.name_ar : trainer.name_en}
                      </h3>
                      <div className="flex flex-wrap gap-1 justify-center mt-2">
                        {trainer.specializations?.slice(0, 3).map((spec, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blanco-gold/10 text-blanco-gold border border-blanco-gold/20">{spec}</span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="py-20">
        <div className="container-blanco">
          <SectionHeader title={t('section.nutrition')} description={t('section.nutritionDesc')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('common.noResults')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <Link key={article.id} to={`/nutrition/${article.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Card hover className="h-full group">
                    <div className="p-5">
                      {article.category && (
                        <span className="text-xs text-blanco-gold font-medium uppercase tracking-wider">
                          {isAr ? article.category.name_ar : article.category.name_en}
                        </span>
                      )}
                      <h3 className="font-semibold text-blanco-white mt-2 group-hover:text-blanco-gold transition-colors line-clamp-2">
                        {isAr ? article.title_ar : article.title_en}
                      </h3>
                      <p className="text-sm text-blanco-muted mt-2 line-clamp-3">
                        {isAr ? article.excerpt_ar : article.excerpt_en}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-blanco-muted">
                        <span>{article.read_time_minutes} {t('common.min')}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/nutrition">
              <Button variant="outline">{t('common.viewAll')} <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 bg-blanco-secondary">
        <div className="container-blanco">
          <SectionHeader title={t('section.membership')} description={t('section.membershipDesc')} />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : plans.length === 0 ? (
            <EmptyState icon={Award} title={t('common.noResults')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => {
                const isPopular = i === 1;
                return (
                  <div key={plan.id} className={`relative animate-fade-in-up ${isPopular ? 'md:-translate-y-4' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="px-4 py-1 rounded-full bg-gold-gradient text-blanco-black text-xs font-semibold shadow-gold">
                          {t('membership.popular')}
                        </span>
                      </div>
                    )}
                    <Card className={`h-full p-6 ${isPopular ? 'border-blanco-gold/50 shadow-gold' : ''}`}>
                      <h3 className="font-display text-xl font-bold text-blanco-white text-center">
                        {isAr ? plan.name_ar : plan.name_en}
                      </h3>
                      <p className="text-sm text-blanco-muted text-center mt-1 mb-4">
                        {isAr ? plan.description_ar : plan.description_en}
                      </p>
                      <div className="text-center mb-6">
                        <span className="font-display text-4xl font-bold text-blanco-gold">{plan.price_egp}</span>
                        <span className="text-sm text-blanco-muted"> {t('misc.egp')}</span>
                        <span className="text-sm text-blanco-muted"> / {plan.duration_months} {plan.duration_months > 1 ? t('common.months') : t('common.month')}</span>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {(isAr ? plan.features_ar : plan.features_en)?.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-blanco-muted">
                            <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-blanco-gold/20 flex items-center justify-center">
                              <div className="h-1.5 w-1.5 rounded-full bg-blanco-gold" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link to="/signup" className="block">
                        <Button variant={isPopular ? 'gold' : 'outline'} className="w-full">{t('membership.apply')}</Button>
                      </Link>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="container-blanco">
            <SectionHeader title={t('section.testimonials')} description={t('section.testimonialsDesc')} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={testimonial.id} className="p-6 hover:border-blanco-gold/30 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.image_url ? (
                      <img src={testimonial.image_url} alt={isAr ? (testimonial.author_name_ar || testimonial.author_name) : testimonial.author_name} className="h-14 w-14 rounded-full object-cover border-2 border-blanco-gold/30" loading="lazy" />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blanco-gold/10 border-2 border-blanco-gold/30 flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-blanco-gold" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-blanco-white">{isAr ? (testimonial.author_name_ar || testimonial.author_name) : testimonial.author_name}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} className={`h-3 w-3 ${idx < testimonial.rating ? 'text-blanco-gold fill-blanco-gold' : 'text-blanco-muted'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-blanco-muted italic">"{isAr ? (testimonial.content_ar || testimonial.content_en) : testimonial.content_en}"</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Awards & Certifications */}
      {awards.length > 0 && (
        <section className="py-20 bg-blanco-secondary">
          <div className="container-blanco">
            <SectionHeader title={isAr ? 'الأوسمة والشهادات' : 'Awards & Certifications'} description={isAr ? 'إنجازات وشهادات تعكس تميز منصة بلانكو' : 'Achievements and certifications that reflect BLANCO excellence'} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {awards.map((award, i) => (
                <Card key={award.id} className="overflow-hidden hover:border-blanco-gold/40 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: `${i * 0.08}s` }}>
                  {award.image_url ? (
                    <div className="relative h-40 overflow-hidden bg-blanco-elevated">
                      <img src={award.image_url} alt={isAr ? (award.title_ar || award.title_en) : award.title_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-blanco-black/80 to-transparent" />
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-blanco-gold/90 shadow-gold">
                        <Award className="h-4 w-4 text-blanco-black" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center bg-blanco-elevated">
                      <Award className="h-12 w-12 text-blanco-gold/40" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors">{isAr ? (award.title_ar || award.title_en) : award.title_en}</h3>
                    {((isAr ? award.description_ar : award.description_en)) && (
                      <p className="text-xs text-blanco-muted mt-2 line-clamp-2">{isAr ? (award.description_ar || award.description_en) : award.description_en}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transformations (Before / After) */}
      {transformations.length > 0 && (
        <section id="transformations" className="py-20 scroll-mt-24">
          <div className="container-blanco">
            <SectionHeader title={isAr ? 'تحولات حقيقية' : 'Real Transformations'} description={isAr ? 'نتائج حقيقية من أعضاء بلانكو' : 'Real results from BLANCO members'} />
            {activeTransformation && (
              <div className="max-w-xl mx-auto" onTouchStart={handleTransformationTouchStart} onTouchEnd={handleTransformationTouchEnd}>
                <Card className="overflow-hidden animate-fade-in-up" hover>
                  <div className="relative h-[28rem] sm:h-[34rem] overflow-hidden bg-blanco-secondary">
                    <img
                      src={transformationSide === 'before' ? activeTransformation.before_image_url : activeTransformation.after_image_url}
                      alt={`${isAr ? 'صورة' : 'Transformation'} ${transformationSide}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blanco-black/90 to-transparent" />
                    <span className={`absolute top-4 ${isAr ? 'right-4' : 'left-4'} px-3 py-1.5 rounded-full text-xs font-semibold ${transformationSide === 'before' ? 'bg-blanco-black/80 text-blanco-white' : 'bg-blanco-gold text-blanco-black'}`}>
                      {transformationSide === 'before' ? (isAr ? 'قبل' : 'Before') : (isAr ? 'بعد' : 'After')}
                    </span>
                    <button type="button" onClick={() => changeTransformationSide(-1)} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} aria-label={isAr ? 'الصورة السابقة' : 'Previous image'} className="absolute top-1/2 left-3 -translate-y-1/2 z-10 rounded-full bg-blanco-black/70 p-4 sm:p-3 text-blanco-white hover:bg-blanco-gold hover:text-blanco-black transition-colors touch-manipulation">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" onClick={() => changeTransformationSide(1)} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} aria-label={isAr ? 'الصورة التالية' : 'Next image'} className="absolute top-1/2 right-3 -translate-y-1/2 z-10 rounded-full bg-blanco-black/70 p-4 sm:p-3 text-blanco-white hover:bg-blanco-gold hover:text-blanco-black transition-colors touch-manipulation">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <div className="absolute inset-x-0 bottom-5 text-center">
                      <h3 className="font-semibold text-lg text-blanco-white">{isAr ? (activeTransformation.name_ar || activeTransformation.name_en) : activeTransformation.name_en}</h3>
                      <div className="mt-3 flex justify-center gap-2">
                        {(['before', 'after'] as const).map((side) => (
                          <button key={side} type="button" onClick={() => setTransformationSide(side)} aria-label={side} className={`h-2 rounded-full transition-all ${transformationSide === side ? 'w-8 bg-blanco-gold' : 'w-2 bg-blanco-white/60'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <div className="flex items-center justify-center gap-4 text-xs text-blanco-muted">
                      {activeTransformation.duration_weeks && <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {activeTransformation.duration_weeks} {isAr ? 'أسابيع' : 'weeks'}</span>}
                      {activeTransformation.weight_before_kg && activeTransformation.weight_after_kg && <span>{activeTransformation.weight_before_kg}kg → {activeTransformation.weight_after_kg}kg</span>}
                    </div>
                    {activeTransformation.caption_en && <p className="text-sm text-blanco-muted mt-3">{isAr ? (activeTransformation.caption_ar || activeTransformation.caption_en) : activeTransformation.caption_en}</p>}
                  </div>
                </Card>
                <div className="mt-5 flex items-center justify-center gap-5">
                  <button type="button" onClick={() => changeTransformation(-1)} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} aria-label={isAr ? 'التحول السابق' : 'Previous transformation'} className="rounded-full border border-blanco-line p-4 sm:p-3 text-blanco-muted hover:border-blanco-gold hover:text-blanco-gold transition-colors touch-manipulation"><ChevronLeft className="h-5 w-5" /></button>
                  <span className="text-sm text-blanco-muted">{transformationIndex + 1} / {transformations.length}</span>
                  <button type="button" onClick={() => changeTransformation(1)} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()} aria-label={isAr ? 'التحول التالي' : 'Next transformation'} className="rounded-full border border-blanco-line p-4 sm:p-3 text-blanco-muted hover:border-blanco-gold hover:text-blanco-gold transition-colors touch-manipulation"><ChevronRight className="h-5 w-5" /></button>
                </div>
                <p className="mt-3 text-center text-xs text-blanco-muted">{isAr ? 'اسحب يميناً ويساراً لرؤية صور قبل وبعد' : 'Swipe left and right to view before and after'}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-blanco-secondary">
        <div className="container-blanco max-w-3xl">
          <SectionHeader title={t('section.faq')} description={t('section.faqDesc')} />
          {loading ? (
            <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
          ) : faqs.length === 0 ? (
            <EmptyState icon={BookOpen} title={t('common.noResults')} />
          ) : (
            <div className="space-y-3">
              {faqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden hover:border-blanco-gold/30 transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-start"
                  >
                    <span className="font-medium text-blanco-white text-sm">{isAr ? faq.question_ar : faq.question_en}</span>
                    {openFaq === faq.id ? <Minus className="h-4 w-4 text-blanco-gold flex-shrink-0" /> : <Plus className="h-4 w-4 text-blanco-gold flex-shrink-0" />}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-5 pb-5 text-sm text-blanco-muted animate-fade-in">
                      {isAr ? faq.answer_ar : faq.answer_en}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container-blanco max-w-2xl text-center">
          <SectionHeader title={t('section.newsletter')} description={t('section.newsletterDesc')} />
          {newsletterStatus === 'success' ? (
            <Alert type="success" message={isAr ? 'تم الاشتراك بنجاح! شكراً لك.' : 'Subscribed successfully! Thank you.'} />
          ) : (
            <form onSubmit={handleNewsletter} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('section.newsletterPlaceholder')}
                  className="input-blanco flex-1"
                  disabled={newsletterStatus === 'loading'}
                />
                <Button type="submit" variant="gold" loading={newsletterStatus === 'loading'}>
                  <Send className="h-4 w-4" /> {t('common.subscribe')}
                </Button>
              </div>
              <label className="flex items-center gap-2 justify-center text-sm text-blanco-muted">
                <input
                  type="checkbox"
                  checked={newsletterConsent}
                  onChange={(e) => setNewsletterConsent(e.target.checked)}
                  className="h-4 w-4 rounded border-blanco-elevated bg-blanco-secondary text-blanco-gold focus:ring-blanco-gold"
                />
                {isAr ? 'أوافق على تلقي النشرة البريدية' : 'I consent to receive the newsletter'}
              </label>
              {newsletterError && <Alert type="error" message={newsletterError} />}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center mb-10">
      <div className="inline-block">
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-blanco-white uppercase tracking-wide">{title}</h2>
        <div className="gold-divider mt-3" />
      </div>
      <p className="mt-4 text-sm md:text-base text-blanco-muted max-w-2xl mx-auto">{description}</p>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg className="h-6 w-6 text-blanco-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}
