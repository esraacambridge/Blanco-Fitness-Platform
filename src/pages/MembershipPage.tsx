import { useEffect, useState } from 'react';
import { Award, Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert, EmptyState, LoadingSpinner } from '@/components/ui/Feedback';
import { SkeletonCard } from '@/components/ui/Skeleton';
import type { MembershipPlan, Membership } from '@/types';

export function MembershipPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [existingMembership, setExistingMembership] = useState<Membership | null>(null);
  const isAr = lang === 'ar';

  useEffect(() => {
    supabase.from('membership_plans').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      setPlans(data as MembershipPlan[] || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('memberships').select('*, plan:membership_plans(*)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle().then(({ data }) => {
        setExistingMembership(data as Membership | null);
      });
    }
  }, [user]);

  const handleApply = async (planId: string) => {
    if (!user) return;
    setApplying(planId);
    setStatus('idle');
    const { data, error } = await supabase.from('memberships').insert({
      user_id: user.id, plan_id: planId, status: 'pending',
    }).select('*, plan:membership_plans(*)').maybeSingle();
    if (error) {
      setStatus('error');
      setMessage(error.message);
    } else {
      setStatus('success');
      setMessage(isAr ? 'تم تقديم طلب العضوية بنجاح. سيتم مراجعة طلبك قريباً.' : 'Membership application submitted successfully. Your application will be reviewed soon.');
      setExistingMembership(data as Membership);
    }
    setApplying(null);
  };

  return (
    <div className="container-blanco py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">{t('membership.choosePlan')}</h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
        <p className="mt-4 text-sm text-blanco-muted max-w-2xl mx-auto">{t('section.membershipDesc')}</p>
      </div>

      {status === 'success' && <div className="max-w-2xl mx-auto mb-6"><Alert type="success" message={message} /></div>}
      {status === 'error' && <div className="max-w-2xl mx-auto mb-6"><Alert type="error" message={message} /></div>}

      {existingMembership && (
        <Card className="p-5 mb-8 max-w-2xl mx-auto border-blanco-gold/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm text-blanco-muted">{isAr ? 'عضويتك الحالية' : 'Your current membership'}</p>
              <p className="font-semibold text-blanco-white">{isAr ? existingMembership.plan?.name_ar : existingMembership.plan?.name_en}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              existingMembership.status === 'active' ? 'bg-green-500/20 text-green-400' :
              existingMembership.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              existingMembership.status === 'expired' ? 'bg-red-500/20 text-red-400' :
              'bg-blanco-elevated text-blanco-muted'
            }`}>
              {t(`membership.status.${existingMembership.status}`)}
            </span>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : plans.length === 0 ? (
        <EmptyState icon={Award} title={t('common.noResults')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const isPopular = i === 1;
            return (
              <div key={plan.id} className={`relative animate-fade-in-up ${isPopular ? 'md:-translate-y-4' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                {isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"><span className="px-4 py-1 rounded-full bg-blanco-gold text-blanco-black text-xs font-semibold">{t('membership.popular')}</span></div>}
                <Card className={`h-full p-6 ${isPopular ? 'border-blanco-gold/50 shadow-gold' : ''}`}>
                  <h3 className="font-display text-xl font-bold text-blanco-white text-center">{isAr ? plan.name_ar : plan.name_en}</h3>
                  <p className="text-sm text-blanco-muted text-center mt-1 mb-4">{isAr ? plan.description_ar : plan.description_en}</p>
                  <div className="text-center mb-6">
                    <span className="font-display text-4xl font-bold text-blanco-gold">{plan.price_egp}</span>
                    <span className="text-sm text-blanco-muted"> {t('misc.egp')}</span>
                    <span className="text-sm text-blanco-muted"> / {plan.duration_months} {plan.duration_months > 1 ? t('common.months') : t('common.month')}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {(isAr ? plan.features_ar : plan.features_en)?.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-blanco-muted">
                        <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded-full bg-blanco-gold/20 flex items-center justify-center"><Check className="h-2.5 w-2.5 text-blanco-gold" /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {user ? (
                    <Button variant={isPopular ? 'gold' : 'outline'} className="w-full" loading={applying === plan.id} disabled={!!existingMembership} onClick={() => handleApply(plan.id)}>
                      {existingMembership ? (isAr ? 'تم التقديم' : 'Applied') : t('membership.apply')}
                    </Button>
                  ) : null}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <Card className="p-4 mt-8 max-w-2xl mx-auto border-yellow-500/20 bg-yellow-500/5">
        <p className="text-xs text-blanco-muted text-center">
          {isAr ? 'تنبيه: نظام الدفع غير متصل حالياً. سيتم مراجعة طلبات العضوية يدوياً من قبل الإدارة. سيتم التواصل معك لإتمام الدفع.' : 'Notice: Payment gateway is not connected yet. Membership applications will be reviewed manually by administration. You will be contacted to complete payment.'}
        </p>
      </Card>
    </div>
  );
}
