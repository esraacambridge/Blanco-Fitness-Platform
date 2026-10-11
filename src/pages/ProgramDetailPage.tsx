import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Activity, Dumbbell, Bookmark } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback';
import type { Program, ProgramExercise } from '@/types';

export function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [exercises, setExercises] = useState<ProgramExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const { data: prog } = await supabase.from('programs').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
      if (prog) {
        setProgram(prog as Program);
        const { data: exs } = await supabase
          .from('program_exercises')
          .select('*, exercise:exercises(*, muscle_group:muscle_groups(*))')
          .eq('program_id', prog.id)
          .order('day_number').order('sort_order');
        setExercises(exs as ProgramExercise[] || []);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  useEffect(() => {
    async function checkSaved() {
      if (!user || !program) return;
      const { data } = await supabase.from('saved_programs').select('id').eq('user_id', user.id).eq('program_id', program.id).maybeSingle();
      setIsSaved(!!data);
    }
    checkSaved();
  }, [user, program]);

  const toggleSave = async () => {
    if (!user || !program) return;
    if (isSaved) {
      await supabase.from('saved_programs').delete().eq('user_id', user.id).eq('program_id', program.id);
      setIsSaved(false);
    } else {
      await supabase.from('saved_programs').insert({ user_id: user.id, program_id: program.id });
      setIsSaved(true);
    }
  };

  if (loading) return <div className="container-blanco py-20"><LoadingSpinner size="lg" /></div>;
  if (!program) return (
    <div className="container-blanco py-20">
      <EmptyState icon={Dumbbell} title={isAr ? 'البرنامج غير موجود' : 'Program not found'} action={<Link to="/programs"><Button variant="outline">{t('common.back')}</Button></Link>} />
    </div>
  );

  const days = [...new Set(exercises.map(e => e.day_number))].sort((a, b) => a - b);

  return (
    <div className="container-blanco py-10 max-w-4xl">
      <Link to="/programs" className="inline-flex items-center gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors mb-6">
        <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /> {t('common.back')}
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <span className={`inline-block px-3 py-1 rounded text-xs font-medium mb-3 ${program.level === 'beginner' ? 'bg-green-500/20 text-green-400' : program.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
            {t(`difficulty.${program.level}`)}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white">{isAr ? program.title_ar : program.title_en}</h1>
          <p className="text-sm text-blanco-muted mt-3 max-w-2xl">{isAr ? program.description_ar : program.description_en}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-blanco-muted">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-blanco-gold" /> {program.duration_weeks} {t('common.weeks')}</span>
            <span className="flex items-center gap-1"><Activity className="h-4 w-4 text-blanco-gold" /> {program.days_per_week} {t('common.days')}</span>
            {program.split_type && <span className="flex items-center gap-1"><Dumbbell className="h-4 w-4 text-blanco-gold" /> {program.split_type}</span>}
          </div>
        </div>
        {user && (
          <Button variant={isSaved ? 'outline' : 'gold'} size="sm" onClick={toggleSave}>
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-blanco-gold text-blanco-gold' : ''}`} />
            {isSaved ? (isAr ? 'محفوظ' : 'Saved') : (isAr ? 'حفظ' : 'Save')}
          </Button>
        )}
      </div>

      {days.length === 0 ? (
        <EmptyState icon={Dumbbell} title={isAr ? 'لا توجد تمارين في هذا البرنامج بعد' : 'No exercises in this program yet'} />
      ) : (
        <div className="space-y-6">
          {days.map(day => (
            <Card key={day} className="p-5">
              <h2 className="font-semibold text-blanco-gold mb-4">{isAr ? `اليوم ${day}` : `Day ${day}`}</h2>
              <div className="space-y-3">
                {exercises.filter(e => e.day_number === day).map((pe) => (
                  <div key={pe.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-blanco-secondary">
                    <div className="flex-1">
                      {pe.exercise ? (
                        <Link to={`/exercises/${pe.exercise.slug}`} className="text-sm font-medium text-blanco-white hover:text-blanco-gold transition-colors">
                          {isAr ? pe.exercise.name_ar : pe.exercise.name_en}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-blanco-white">{pe.exercise_name || '-'}</span>
                      )}
                      {(isAr ? pe.notes_ar : pe.notes_en) && (
                        <p className="text-xs text-blanco-muted mt-1">{isAr ? pe.notes_ar : pe.notes_en}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-blanco-muted flex-shrink-0">
                      <span>{pe.sets} {t('common.sets')}</span>
                      <span>{pe.reps} {t('common.reps')}</span>
                      <span>{pe.rest_seconds}{t('common.seconds')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-4 mt-6 border-yellow-500/20 bg-yellow-500/5">
        <p className="text-xs text-blanco-muted">
          {isAr
            ? 'تنبيه: هذه الإرشادات التدريبية هي معلومات عامة ولا تغني عن استشارة مدرب مؤهل أو أخصائي طبي. تدرّج بذكاء واستمع لجسدك.'
            : 'Disclaimer: These training guidelines are general information and do not replace consulting a qualified trainer or medical professional. Progress wisely and listen to your body.'}
        </p>
      </Card>
    </div>
  );
}
