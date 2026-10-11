import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, AlertTriangle, Dumbbell, Target, Wrench, Gauge, ListChecks, XCircle, Repeat, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback';
import type { Exercise } from '@/types';

export function ExerciseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [related, setRelated] = useState<Exercise[]>([]);
  const isAr = lang === 'ar';

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase
        .from('exercises')
        .select('*, muscle_group:muscle_groups(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (data) {
        setExercise(data as Exercise);
        if (data.muscle_group_id) {
          const { data: relatedData } = await supabase
            .from('exercises')
            .select('*, muscle_group:muscle_groups(*)')
            .eq('muscle_group_id', data.muscle_group_id)
            .eq('is_published', true)
            .neq('id', data.id)
            .limit(4);
          setRelated(relatedData as Exercise[] || []);
        }
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    async function checkFav() {
      if (!user || !exercise) return;
      const { data } = await supabase
        .from('favorite_exercises')
        .select('id')
        .eq('user_id', user.id)
        .eq('exercise_id', exercise.id)
        .maybeSingle();
      setIsFavorite(!!data);
    }
    checkFav();
  }, [user, exercise]);

  const toggleFavorite = async () => {
    if (!user || !exercise) return;
    if (isFavorite) {
      await supabase.from('favorite_exercises').delete().eq('user_id', user.id).eq('exercise_id', exercise.id);
      setIsFavorite(false);
    } else {
      await supabase.from('favorite_exercises').insert({ user_id: user.id, exercise_id: exercise.id });
      setIsFavorite(true);
    }
  };

  if (loading) return <div className="container-blanco py-20"><LoadingSpinner size="lg" /></div>;
  if (!exercise) return (
    <div className="container-blanco py-20">
      <EmptyState icon={Dumbbell} title={isAr ? 'التمرين غير موجود' : 'Exercise not found'} action={<Link to="/exercises"><Button variant="outline">{t('common.back')}</Button></Link>} />
    </div>
  );

  const instructions = isAr ? exercise.instructions_ar : exercise.instructions_en;
  const mistakes = isAr ? exercise.common_mistakes_ar : exercise.common_mistakes_en;
  const alternatives = isAr ? exercise.alternatives_ar : exercise.alternatives_en;
  const safetyNotes = isAr ? exercise.safety_notes_ar : exercise.safety_notes_en;
  const description = isAr ? exercise.description_ar : exercise.description_en;

  return (
    <div className="container-blanco py-10 max-w-4xl">
      <Link to="/exercises" className="inline-flex items-center gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors mb-6">
        <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /> {t('common.back')}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white">
            {isAr ? exercise.name_ar : exercise.name_en}
          </h1>
          {exercise.muscle_group && (
            <Link to={`/exercises?muscle=${exercise.muscle_group.slug}`} className="text-sm text-blanco-gold hover:underline mt-2 inline-block">
              {isAr ? exercise.muscle_group.name_ar : exercise.muscle_group.name_en}
            </Link>
          )}
          <p className="text-sm text-blanco-muted mt-3 max-w-2xl">{description}</p>
        </div>
        {user && (
          <Button variant={isFavorite ? 'outline' : 'gold'} size="sm" onClick={toggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            {isFavorite ? t('exercise.removeFromFavorites') : t('exercise.addToFavorites')}
          </Button>
        )}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <InfoCard icon={Target} label={t('exercise.targetMuscles')} value={exercise.muscle_group ? (isAr ? exercise.muscle_group.name_ar : exercise.muscle_group.name_en) : '-'} />
        <InfoCard icon={Gauge} label={t('exercise.difficulty')} value={exercise.difficulty ? t(`difficulty.${exercise.difficulty}`) : '-'} />
        <InfoCard icon={Wrench} label={t('exercise.equipment')} value={exercise.equipment?.join(', ') || '-'} />
        <InfoCard icon={Dumbbell} label={isAr ? 'العضلات الثانوية' : 'Secondary Muscles'} value={exercise.secondary_muscles?.join(', ') || '-'} />
      </div>

      {/* Instructions */}
      {instructions && instructions.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blanco-white mb-4">
            <ListChecks className="h-5 w-5 text-blanco-gold" /> {t('exercise.instructions')}
          </h2>
          <ol className="space-y-3">
            {instructions.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-blanco-muted">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blanco-gold/20 text-blanco-gold text-xs font-bold flex items-center justify-center">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Common Mistakes */}
      {mistakes && mistakes.length > 0 && (
        <Card className="p-6 mb-6 border-red-500/20">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blanco-white mb-4">
            <XCircle className="h-5 w-5 text-red-400" /> {t('exercise.commonMistakes')}
          </h2>
          <ul className="space-y-2">
            {mistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blanco-muted">
                <span className="text-red-400 mt-1">•</span> {mistake}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Safety Notes */}
      {safetyNotes && (
        <Card className="p-6 mb-6 border-yellow-500/20 bg-yellow-500/5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blanco-white mb-3">
            <ShieldCheck className="h-5 w-5 text-yellow-400" /> {t('exercise.safetyNotes')}
          </h2>
          <p className="text-sm text-blanco-muted">{safetyNotes}</p>
        </Card>
      )}

      {/* Alternatives */}
      {alternatives && alternatives.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-blanco-white mb-4">
            <Repeat className="h-5 w-5 text-blanco-gold" /> {t('exercise.alternatives')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {alternatives.map((alt, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-blanco-secondary text-sm text-blanco-muted border border-blanco-elevated">{alt}</span>
            ))}
          </div>
        </Card>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-blanco-white mb-4">{t('exercise.relatedExercises')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((ex) => (
              <Link key={ex.id} to={`/exercises/${ex.slug}`}>
                <Card hover className="p-4 group h-full">
                  <h3 className="text-sm font-medium text-blanco-white group-hover:text-blanco-gold transition-colors">
                    {isAr ? ex.name_ar : ex.name_en}
                  </h3>
                  <p className="text-xs text-blanco-muted mt-1">
                    {ex.muscle_group ? (isAr ? ex.muscle_group.name_ar : ex.muscle_group.name_en) : ''}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-blanco-gold" />
        <span className="text-xs text-blanco-muted">{label}</span>
      </div>
      <p className="text-sm font-medium text-blanco-white">{value}</p>
    </Card>
  );
}
