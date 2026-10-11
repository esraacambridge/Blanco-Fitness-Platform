import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { Trainer } from '@/types';

export function TrainersPage() {
  const { t, lang } = useI18n();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  useEffect(() => {
    supabase.from('trainers').select('*').eq('is_published', true).order('created_at').then(({ data }) => {
      setTrainers(data as Trainer[] || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-blanco py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">
          {isAr ? 'المدربون' : 'Trainers'}
        </h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted max-w-2xl mx-auto">
          {isAr ? 'مدربون معتمدون لمساعدتك في رحلتك' : 'Certified trainers to guide your journey'}
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : trainers.length === 0 ? (
        <EmptyState icon={Shield} title={t('common.noResults')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer, i) => (
            <Link key={trainer.id} to={`/trainers/${trainer.slug}`} className="block animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <Card hover className="h-full text-center group overflow-hidden">
                <div className="relative h-56 overflow-hidden bg-blanco-elevated">
                  <img src={trainer.image_url || 'https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=940'} alt={isAr ? trainer.name_ar : trainer.name_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  {trainer.is_verified && <div className="absolute top-3 right-3 p-1.5 rounded-full bg-blanco-gold/90"><Shield className="h-3 w-3 text-blanco-black" /></div>}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-blanco-white group-hover:text-blanco-gold transition-colors">{isAr ? trainer.name_ar : trainer.name_en}</h3>
                  <p className="text-sm text-blanco-muted mt-2 line-clamp-2">{isAr ? trainer.bio_ar : trainer.bio_en}</p>
                  <div className="flex flex-wrap gap-1 justify-center mt-3">
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
  );
}
