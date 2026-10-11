import { Link } from 'react-router-dom';
import { Target, Eye, Zap, TrendingUp } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function AboutPage() {
  const { t, lang } = useI18n();
  const isAr = lang === 'ar';

  const values = [
    { icon: Target, title: isAr ? 'الانضباط' : 'Discipline', desc: isAr ? 'الالتزام بالتدريب والتغذية هو أساس كل تحول' : 'Commitment to training and nutrition is the foundation of every transformation' },
    { icon: TrendingUp, title: isAr ? 'التطور' : 'Progress', desc: isAr ? 'نؤمن بالتحسن المستمر والتدرج الذكي' : 'We believe in continuous improvement and smart progression' },
    { icon: Zap, title: isAr ? 'القوة' : 'Power', desc: isAr ? 'نبني الأجساد القوية والعقول الأقوى' : 'We build strong bodies and stronger minds' },
    { icon: Eye, title: isAr ? 'الشفافية' : 'Transparency', desc: isAr ? 'نقدم معلومات صادقة ومبنية على العلم' : 'We provide honest, science-based information' },
  ];

  return (
    <div className="container-blanco py-10 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">{isAr ? 'عن بلانكو' : 'About BLANCO'}</h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
      </div>
      <Card className="p-6 mb-8">
        <p className="text-sm text-blanco-muted leading-relaxed">
          {isAr
            ? 'بلانكو فيتنس هي منصة لياقة بدنية وكمال أجسام متميزة تأسست بمهمة واضحة: مساعدتك على بناء نسخة أقوى من نفسك. نجمع بين البرامج التدريبية العلمية، ومكتبة تمارين شاملة، وإرشادات تغذية موثوقة في تجربة رقمية متميزة. نؤمن أن القوة الحقيقية تبدأ بقرار، وأن التطور يصنعه الالتزام. سواء كنت مبتدئاً أو رياضياً متقدماً، بلانكو هي شريكك في رحلة التحول.'
            : 'BLANCO FITNESS is a premium fitness and bodybuilding platform founded with a clear mission: to help you build your stronger self. We combine science-based training programs, a comprehensive exercise library, and reliable nutrition guidance in a premium digital experience. We believe true strength starts with a decision, and progress is built by commitment. Whether you are a beginner or an advanced athlete, BLANCO is your partner in transformation.'}
        </p>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {values.map((val, i) => (
          <Card key={i} className="p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="inline-flex p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20 mb-3">
              <val.icon className="h-6 w-6 text-blanco-gold" />
            </div>
            <h3 className="font-semibold text-blanco-white mb-2">{val.title}</h3>
            <p className="text-sm text-blanco-muted">{val.desc}</p>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Link to="/signup"><Button variant="gold" size="lg">{t('hero.cta.start')}</Button></Link>
      </div>
    </div>
  );
}
