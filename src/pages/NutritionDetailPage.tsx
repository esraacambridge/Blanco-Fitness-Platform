import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Flame, Beef, Wheat, Droplet, Leaf, BookOpen } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback';
import type { NutritionArticle, Recipe } from '@/types';

export function NutritionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const [item, setItem] = useState<NutritionArticle | Recipe | null>(null);
  const [type, setType] = useState<'article' | 'recipe'>('article');
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const { data: article } = await supabase.from('nutrition_articles').select('*, category:nutrition_categories(*)').eq('slug', slug).eq('is_published', true).maybeSingle();
      if (article) { setItem(article as NutritionArticle); setType('article'); setLoading(false); return; }
      const { data: recipe } = await supabase.from('recipes').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
      if (recipe) { setItem(recipe as Recipe); setType('recipe'); }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="container-blanco py-20"><LoadingSpinner size="lg" /></div>;
  if (!item) return (
    <div className="container-blanco py-20">
      <EmptyState icon={BookOpen} title={isAr ? 'غير موجود' : 'Not found'} action={<Link to="/nutrition"><Button variant="outline">{t('common.back')}</Button></Link>} />
    </div>
  );

  if (type === 'recipe') {
    const recipe = item as Recipe;
    const ingredients = isAr ? recipe.ingredients_ar : recipe.ingredients_en;
    const instructions = isAr ? recipe.instructions_ar : recipe.instructions_en;
    return (
      <div className="container-blanco py-10 max-w-3xl">
        <Link to="/nutrition" className="inline-flex items-center gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors mb-6">
          <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /> {t('common.back')}
        </Link>
        <h1 className="font-display text-3xl font-bold text-blanco-white mb-3">{isAr ? recipe.title_ar : recipe.title_en}</h1>
        <p className="text-sm text-blanco-muted mb-6">{isAr ? recipe.description_ar : recipe.description_en}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {recipe.calories && <Macro icon={Flame} label={t('misc.calories')} value={`${recipe.calories}`} />}
          {recipe.protein_g && <Macro icon={Beef} label={t('misc.protein')} value={`${recipe.protein_g}g`} />}
          {recipe.carbs_g && <Macro icon={Wheat} label={t('misc.carbs')} value={`${recipe.carbs_g}g`} />}
          {recipe.fat_g && <Macro icon={Droplet} label={t('misc.fat')} value={`${recipe.fat_g}g`} />}
        </div>
        <div className="flex items-center gap-4 mb-6 text-sm text-blanco-muted">
          {recipe.prep_time_minutes && <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-blanco-gold" /> {recipe.prep_time_minutes} {t('common.min')}</span>}
          <span className="flex items-center gap-1"><Users className="h-4 w-4 text-blanco-gold" /> {recipe.servings} {t('misc.servings')}</span>
        </div>
        {ingredients && ingredients.length > 0 && (
          <Card className="p-5 mb-6">
            <h2 className="font-semibold text-blanco-white mb-4">{t('misc.ingredients')}</h2>
            <ul className="space-y-2">{ingredients.map((ing, i) => <li key={i} className="flex items-start gap-2 text-sm text-blanco-muted"><span className="text-blanco-gold mt-1">•</span> {ing}</li>)}</ul>
          </Card>
        )}
        {instructions && instructions.length > 0 && (
          <Card className="p-5 mb-6">
            <h2 className="font-semibold text-blanco-white mb-4">{t('misc.instructions')}</h2>
            <ol className="space-y-3">{instructions.map((step, i) => <li key={i} className="flex items-start gap-3 text-sm text-blanco-muted"><span className="flex-shrink-0 h-5 w-5 rounded-full bg-blanco-gold/20 text-blanco-gold text-xs font-bold flex items-center justify-center">{i+1}</span> {step}</li>)}</ol>
          </Card>
        )}
      </div>
    );
  }

  const article = item as NutritionArticle;
  return (
    <div className="container-blanco py-10 max-w-3xl">
      <Link to="/nutrition" className="inline-flex items-center gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors mb-6">
        <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /> {t('common.back')}
      </Link>
      {article.category && <span className="text-xs text-blanco-gold font-medium uppercase tracking-wider">{isAr ? article.category.name_ar : article.category.name_en}</span>}
      <h1 className="font-display text-3xl font-bold text-blanco-white mt-2 mb-3">{isAr ? article.title_ar : article.title_en}</h1>
      <p className="text-sm text-blanco-muted mb-6">{isAr ? article.excerpt_ar : article.excerpt_en}</p>
      <Card className="p-6">
        <div className="prose prose-invert max-w-none text-sm text-blanco-muted leading-relaxed whitespace-pre-wrap">
          {isAr ? article.content_ar : article.content_en}
        </div>
      </Card>
    </div>
  );
}

function Macro({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <Card className="p-3 text-center">
      <Icon className="h-4 w-4 text-blanco-gold mx-auto mb-1" />
      <p className="text-sm font-semibold text-blanco-white">{value}</p>
      <p className="text-xs text-blanco-muted">{label}</p>
    </Card>
  );
}


