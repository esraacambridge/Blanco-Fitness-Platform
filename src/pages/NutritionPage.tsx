import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, UtensilsCrossed, Clock } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Input';
import type { NutritionArticle, Recipe, NutritionCategory } from '@/types';

export function NutritionPage() {
  const { t, lang } = useI18n();
  const [articles, setArticles] = useState<NutritionArticle[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<NutritionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'articles' | 'recipes'>('articles');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const isAr = lang === 'ar';

  useEffect(() => {
    supabase.from('nutrition_categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as NutritionCategory[]);
    });
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (tab === 'articles') {
        let q = supabase.from('nutrition_articles').select('*, category:nutrition_categories(*)').eq('is_published', true);
        if (search) q = q.or(`title_en.ilike.%${search}%,title_ar.ilike.%${search}%`);
        if (categoryFilter) q = q.eq('category_id', categoryFilter);
        const { data } = await q.order('created_at', { ascending: false });
        setArticles(data as NutritionArticle[] || []);
      } else {
        let q = supabase.from('recipes').select('*').eq('is_published', true);
        if (search) q = q.or(`title_en.ilike.%${search}%,title_ar.ilike.%${search}%`);
        const { data } = await q.order('created_at', { ascending: false });
        setRecipes(data as Recipe[] || []);
      }
      setLoading(false);
    }
    load();
  }, [tab, search, categoryFilter]);

  return (
    <div className="container-blanco py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">
          {isAr ? 'مركز التغذية' : 'Nutrition Center'}
        </h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted max-w-2xl mx-auto">
          {isAr ? 'مقالات تعليمية ووصفات صحية لدعم أهدافك' : 'Educational articles and healthy recipes to support your goals'}
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-6">
        <button onClick={() => setTab('articles')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'articles' ? 'bg-blanco-gold text-blanco-black' : 'bg-blanco-elevated text-blanco-muted hover:text-blanco-white'}`}>
          <BookOpen className="h-4 w-4 inline me-2" /> {isAr ? 'مقالات' : 'Articles'}
        </button>
        <button onClick={() => setTab('recipes')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'recipes' ? 'bg-blanco-gold text-blanco-black' : 'bg-blanco-elevated text-blanco-muted hover:text-blanco-white'}`}>
          <UtensilsCrossed className="h-4 w-4 inline me-2" /> {isAr ? 'وصفات' : 'Recipes'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-5 w-5 text-blanco-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? 'بحث...' : 'Search...'} className="input-blanco ps-10" />
        </div>
        {tab === 'articles' && (
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">{t('common.all')}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{isAr ? c.name_ar : c.name_en}</option>)}
          </Select>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : tab === 'articles' ? (
        articles.length === 0 ? <EmptyState icon={BookOpen} title={t('common.noResults')} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Link key={article.id} to={`/nutrition/${article.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Card hover className="h-full group">
                  <div className="p-5">
                    {article.category && <span className="text-xs text-blanco-gold font-medium uppercase tracking-wider">{isAr ? article.category.name_ar : article.category.name_en}</span>}
                    <h3 className="font-semibold text-blanco-white mt-2 group-hover:text-blanco-gold transition-colors line-clamp-2">{isAr ? article.title_ar : article.title_en}</h3>
                    <p className="text-sm text-blanco-muted mt-2 line-clamp-3">{isAr ? article.excerpt_ar : article.excerpt_en}</p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-blanco-muted"><Clock className="h-3 w-3" /> {article.read_time_minutes} {t('common.min')}</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        recipes.length === 0 ? <EmptyState icon={UtensilsCrossed} title={t('common.noResults')} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              <Link key={recipe.id} to={`/nutrition/recipe/${recipe.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <Card hover className="h-full group">
                  <div className="p-5">
                    <h3 className="font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors">{isAr ? recipe.title_ar : recipe.title_en}</h3>
                    <p className="text-sm text-blanco-muted mt-2 line-clamp-2">{isAr ? recipe.description_ar : recipe.description_en}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-blanco-muted">
                      {recipe.calories && <span>{recipe.calories} {t('misc.calories')}</span>}
                      {recipe.protein_g && <span>{recipe.protein_g}g {t('misc.protein')}</span>}
                      {recipe.prep_time_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.prep_time_minutes}{t('common.min')}</span>}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
