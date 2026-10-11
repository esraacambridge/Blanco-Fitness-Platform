import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Dumbbell, Heart } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { EmptyState, LoadingSpinner } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Exercise, MuscleGroup } from '@/types';

export function ExerciseLibraryPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [muscleFilter, setMuscleFilter] = useState(searchParams.get('muscle') || '');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const isAr = lang === 'ar';

  useEffect(() => {
    supabase.from('muscle_groups').select('*').order('sort_order').then(({ data }) => {
      if (data) setMuscleGroups(data as MuscleGroup[]);
    });
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('favorite_exercises').select('exercise_id').eq('user_id', user.id);
    if (data) setFavorites(new Set(data.map(f => f.exercise_id)));
  }, [user]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const loadExercises = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('exercises').select('*, muscle_group:muscle_groups(*)').eq('is_published', true);

    if (search) {
      query = query.or(`name_en.ilike.%${search}%,name_ar.ilike.%${search}%`);
    }
    if (muscleFilter) {
      const group = muscleGroups.find(g => g.slug === muscleFilter);
      if (group) query = query.eq('muscle_group_id', group.id);
    }
    if (difficultyFilter) {
      query = query.eq('difficulty', difficultyFilter);
    }
    if (equipmentFilter) {
      query = query.contains('equipment', [equipmentFilter]);
    }

    const { data } = await query.order('name_en').limit(60);
    setExercises(data as Exercise[] || []);
    setLoading(false);
  }, [search, muscleFilter, difficultyFilter, equipmentFilter, muscleGroups]);

  useEffect(() => { loadExercises(); }, [loadExercises]);

  useEffect(() => {
    const muscle = searchParams.get('muscle');
    if (muscle) setMuscleFilter(muscle);
  }, [searchParams]);

  const toggleFavorite = async (exerciseId: string) => {
    if (!user) return;
    if (favorites.has(exerciseId)) {
      await supabase.from('favorite_exercises').delete().eq('user_id', user.id).eq('exercise_id', exerciseId);
      setFavorites(prev => { const next = new Set(prev); next.delete(exerciseId); return next; });
    } else {
      await supabase.from('favorite_exercises').insert({ user_id: user.id, exercise_id: exerciseId });
      setFavorites(prev => new Set(prev).add(exerciseId));
    }
  };

  const handleMuscleChange = (value: string) => {
    setMuscleFilter(value);
    if (value) setSearchParams({ muscle: value });
    else setSearchParams({});
  };

  return (
    <div className="container-blanco py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">
          {isAr ? 'مكتبة التمارين' : 'Exercise Library'}
        </h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted max-w-2xl mx-auto">
          {isAr ? 'تمارين مفصلة مع تعليمات كاملة وإرشادات سلامة لكل مجموعة عضلية' : 'Detailed exercises with full instructions and safety guidance for every muscle group'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-5 w-5 text-blanco-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('exercise.searchPlaceholder')}
            className="input-blanco ps-10"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={muscleFilter} onChange={(e) => handleMuscleChange(e.target.value)}>
            <option value="">{t('exercise.filterByMuscle')}</option>
            {muscleGroups.map(g => (
              <option key={g.id} value={g.slug}>{isAr ? g.name_ar : g.name_en}</option>
            ))}
          </Select>
          <Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            <option value="">{t('exercise.filterByDifficulty')}</option>
            <option value="beginner">{t('difficulty.beginner')}</option>
            <option value="intermediate">{t('difficulty.intermediate')}</option>
            <option value="advanced">{t('difficulty.advanced')}</option>
          </Select>
          <Select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
            <option value="">{t('exercise.filterByEquipment')}</option>
            <option value="barbell">Barbell</option>
            <option value="dumbbells">Dumbbells</option>
            <option value="cable-machine">Cable Machine</option>
            <option value="bodyweight">Bodyweight</option>
            <option value="bench">Bench</option>
          </Select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : exercises.length === 0 ? (
        <EmptyState icon={Dumbbell} title={t('common.noResults')} description={isAr ? 'جرب تعديل البحث أو الفلاتر' : 'Try adjusting your search or filters'} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise, i) => (
            <div key={exercise.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <Card hover className="h-full group">
                <div className="p-5 relative">
                  {user && (
                    <button
                      onClick={() => toggleFavorite(exercise.id)}
                      className="absolute top-4 end-4 p-2 rounded-lg bg-blanco-secondary/80 hover:bg-blanco-elevated transition-all"
                    >
                      <Heart className={`h-4 w-4 ${favorites.has(exercise.id) ? 'fill-red-500 text-red-500' : 'text-blanco-muted'}`} />
                    </button>
                  )}
                  <Link to={`/exercises/${exercise.slug}`}>
                    <h3 className="font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors pe-10">
                      {isAr ? exercise.name_ar : exercise.name_en}
                    </h3>
                    <p className="text-xs text-blanco-muted mt-1">
                      {exercise.muscle_group ? (isAr ? exercise.muscle_group.name_ar : exercise.muscle_group.name_en) : ''}
                    </p>
                    <p className="text-sm text-blanco-muted mt-3 line-clamp-2">
                      {isAr ? exercise.description_ar : exercise.description_en}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      {exercise.difficulty && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          exercise.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          exercise.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {t(`difficulty.${exercise.difficulty}`)}
                        </span>
                      )}
                      {exercise.equipment && exercise.equipment.length > 0 && (
                        <span className="px-2 py-1 rounded text-xs bg-blanco-secondary text-blanco-muted">
                          {exercise.equipment[0]}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
