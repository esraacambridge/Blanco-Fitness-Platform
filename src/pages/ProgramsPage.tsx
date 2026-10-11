import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Dumbbell, Calendar } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingSpinner } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Program, Difficulty } from '@/types';

const PROGRAM_IMAGE = 'https://images.pexels.com/photos/931321/pexels-photo-931321.jpeg?auto=compress&cs=tinysrgb&w=940';

export function ProgramsPage() {
  const { t, lang } = useI18n();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('');
  const isAr = lang === 'ar';

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('programs').select('*').eq('is_published', true).eq('is_archived', false);
      if (levelFilter) query = query.eq('level', levelFilter);
      const { data } = await query.order('created_at');
      setPrograms(data as Program[] || []);
      setLoading(false);
    }
    load();
  }, [levelFilter]);

  return (
    <div className="container-blanco py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">
          {isAr ? 'البرامج التدريبية' : 'Training Programs'}
        </h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted max-w-2xl mx-auto">
          {isAr ? 'برامج تدريبية احترافية مصممة لجميع المستويات' : 'Professional training programs designed for all levels'}
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {['', 'beginner', 'intermediate', 'advanced'].map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              levelFilter === level
                ? 'bg-blanco-gold text-blanco-black'
                : 'bg-blanco-elevated text-blanco-muted hover:text-blanco-white'
            }`}
          >
            {level ? t(`difficulty.${level}`) : t('common.all')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : programs.length === 0 ? (
        <EmptyState icon={Dumbbell} title={t('common.noResults')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <Link key={program.id} to={`/programs/${program.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card hover className="h-full overflow-hidden group">
                <div className="relative h-48 overflow-hidden bg-blanco-secondary">
                  <img src={program.image_url || PROGRAM_IMAGE} alt={isAr ? program.title_ar : program.title_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blanco-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${program.level === 'beginner' ? 'bg-green-500/20 text-green-400' : program.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t(`difficulty.${program.level}`)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-blanco-white mb-2 group-hover:text-blanco-gold transition-colors">{isAr ? program.title_ar : program.title_en}</h3>
                  <p className="text-sm text-blanco-muted line-clamp-2 mb-3">{isAr ? program.description_ar : program.description_en}</p>
                  <div className="flex items-center gap-4 text-xs text-blanco-muted">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {program.duration_weeks} {t('common.weeks')}</span>
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {program.days_per_week} {t('common.days')}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
