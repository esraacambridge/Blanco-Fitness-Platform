import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Award } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner, EmptyState } from '@/components/ui/Feedback';
import type { Trainer, Program } from '@/types';

export function TrainerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase.from('trainers').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
      if (data) {
        setTrainer(data as Trainer);
        const { data: progs } = await supabase.from('programs').select('*').eq('trainer_id', (data as Trainer).user_id).eq('is_published', true);
        setPrograms(progs as Program[] || []);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="container-blanco py-20"><LoadingSpinner size="lg" /></div>;
  if (!trainer) return (
    <div className="container-blanco py-20">
      <EmptyState icon={Shield} title={isAr ? 'المدرب غير موجود' : 'Trainer not found'} action={<Link to="/trainers"><Button variant="outline">{t('common.back')}</Button></Link>} />
    </div>
  );

  return (
    <div className="container-blanco py-10 max-w-3xl">
      <Link to="/trainers" className="inline-flex items-center gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors mb-6">
        <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} /> {t('common.back')}
      </Link>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative h-48 w-48 rounded-xl overflow-hidden bg-blanco-elevated flex-shrink-0 mx-auto md:mx-0">
          <img src={trainer.image_url || 'https://images.pexels.com/photos/3912944/pexels-photo-3912944.jpeg?auto=compress&cs=tinysrgb&w=940'} alt={isAr ? trainer.name_ar : trainer.name_en} className="w-full h-full object-cover" />
          {trainer.is_verified && <div className="absolute top-2 right-2 p-1.5 rounded-full bg-blanco-gold/90"><Shield className="h-3 w-3 text-blanco-black" /></div>}
        </div>
        <div className="flex-1 text-center md:text-start">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-blanco-white">{isAr ? trainer.name_ar : trainer.name_en}</h1>
          <div className="flex flex-wrap gap-1 justify-center md:justify-start mt-3">
            {trainer.specializations?.map((spec, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blanco-gold/10 text-blanco-gold border border-blanco-gold/20">{spec}</span>
            ))}
          </div>
          <p className="text-sm text-blanco-muted mt-4">{isAr ? trainer.bio_ar : trainer.bio_en}</p>
          {(isAr ? trainer.qualifications_ar : trainer.qualifications_en) && (
            <div className="mt-4 p-3 rounded-lg bg-blanco-secondary border border-blanco-elevated">
              <p className="text-xs text-blanco-muted flex items-start gap-2"><Award className="h-4 w-4 text-blanco-gold flex-shrink-0 mt-0.5" /> {isAr ? trainer.qualifications_ar : trainer.qualifications_en}</p>
            </div>
          )}
          {trainer.contact_email && (
            <a href={`mailto:${trainer.contact_email}`} className="inline-flex items-center gap-2 mt-4 text-sm text-blanco-gold hover:underline">
              <Mail className="h-4 w-4" /> {trainer.contact_email}
            </a>
          )}
        </div>
      </div>
      {programs.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-blanco-white mb-4">{isAr ? 'برامج المدرب' : 'Trainer Programs'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map(prog => (
              <Link key={prog.id} to={`/programs/${prog.slug}`}>
                <Card hover className="p-4 group">
                  <h3 className="text-sm font-medium text-blanco-white group-hover:text-blanco-gold transition-colors">{isAr ? prog.title_ar : prog.title_en}</h3>
                  <p className="text-xs text-blanco-muted mt-1 line-clamp-1">{isAr ? prog.description_ar : prog.description_en}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
