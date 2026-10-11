import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingSpinner } from '@/components/ui/Feedback';
import type { FAQ as FAQType } from '@/types';

export function FAQPage() {
  const { t, lang } = useI18n();
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    supabase.from('faqs').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      setFaqs(data as FAQType[] || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container-blanco py-10 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">{t('section.faq')}</h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted">{t('section.faqDesc')}</p>
      </div>
      {loading ? (
        <div className="flex justify-center"><LoadingSpinner size="lg" /></div>
      ) : faqs.length === 0 ? (
        <EmptyState icon={HelpCircle} title={t('common.noResults')} />
      ) : (
        <div className="space-y-3">
          {faqs.map(faq => (
            <Card key={faq.id} className="overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-5 text-start">
                <span className="font-medium text-blanco-white text-sm">{isAr ? faq.question_ar : faq.question_en}</span>
                {openFaq === faq.id ? <Minus className="h-4 w-4 text-blanco-gold flex-shrink-0" /> : <Plus className="h-4 w-4 text-blanco-gold flex-shrink-0" />}
              </button>
              {openFaq === faq.id && <div className="px-5 pb-5 text-sm text-blanco-muted animate-fade-in">{isAr ? faq.answer_ar : faq.answer_en}</div>}
            </Card>
          ))}
        </div>
      )}
      <div className="text-center mt-8">
        <Link to="/contact" className="text-sm text-blanco-gold hover:underline">{isAr ? 'لم تجد إجابتك؟ تواصل معنا' : "Didn't find your answer? Contact us"}</Link>
      </div>
    </div>
  );
}
