import { useI18n } from '@/contexts/I18nContext';
import { Card } from '@/components/ui/Card';

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { lang } = useI18n();
  const isAr = lang === 'ar';

  const content = type === 'privacy' ? {
    title: isAr ? 'سياسة الخصوصية' : 'Privacy Policy',
    sections: isAr ? [
      { h: 'مقدمة', p: 'تحترم بلانكو فيتنس خصوصيتك وتلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك.' },
      { h: 'البيانات التي نجمعها', p: 'نجمع الاسم، البريد الإلكتروني، ومعلومات اللياقة البدنية التي تقدمها طوعاً. لا نطلب معلومات حساسة مثل أرقام البطاقات البنكية.' },
      { h: 'استخدام البيانات', p: 'تُستخدم بياناتك لتقديم خدماتنا وتحسين تجربتك وإرسال الإشعارات المتعلقة بحسابك. لا نشارك بياناتك مع أطراف ثالثة دون موافقتك.' },
      { h: 'أمان البيانات', p: 'نستخدم تشفيراً قياسياً وسياسات أمان صارمة. كل مستخدم يمكنه الوصول إلى بياناته فقط.' },
      { h: 'حقوقك', p: 'يمكنك الوصول إلى بياناتك وتعديلها أو طلب حذفها في أي وقت من لوحة التحكم أو بالتواصل معنا.' },
    ] : [
      { h: 'Introduction', p: 'BLANCO FITNESS respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and protect your information.' },
      { h: 'Data We Collect', p: 'We collect your name, email, and fitness information you voluntarily provide. We do not request sensitive information like credit card numbers.' },
      { h: 'Data Usage', p: 'Your data is used to provide our services, improve your experience, and send account-related notifications. We do not share your data with third parties without your consent.' },
      { h: 'Data Security', p: 'We use industry-standard encryption and strict security policies. Each user can only access their own data.' },
      { h: 'Your Rights', p: 'You can access, modify, or request deletion of your data at any time from your dashboard or by contacting us.' },
    ],
  } : {
    title: isAr ? 'الشروط والأحكام' : 'Terms & Conditions',
    sections: isAr ? [
      { h: 'قبول الشروط', p: 'باستخدامك لمنصة بلانكو فيتنس، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام المنصة.' },
      { h: 'الخدمات', p: 'توفر بلانكو مكتبة تمارين وبرامج تدريبية ومحتوى تغذية. هذه الإرشادات هي معلومات عامة ولا تغني عن استشارة مدرب مؤهل أو أخصائي طبي.' },
      { h: 'المسؤولية', p: 'أنت مسؤول عن صحتك ومراجعة طبيبك قبل بدء أي برنامج تدريبي. بلانكو غير مسؤولة عن أي إصادات قد تحدث.' },
      { h: 'العضوية', p: 'العضوية قابلة للإلغاء في أي وقت. المدفوعات تتم مراجعتها يدوياً حتى يتم ربط نظام الدفع.' },
      { h: 'الملكية الفكرية', p: 'جميع المحتويات على المنصة ملك لبلانكو فيتنس ولا يجوز نسخها أو إعادة استخدامها دون إذن.' },
    ] : [
      { h: 'Acceptance of Terms', p: 'By using BLANCO FITNESS platform, you agree to these terms and conditions. If you do not agree, please do not use the platform.' },
      { h: 'Services', p: 'BLANCO provides an exercise library, training programs, and nutrition content. These guidelines are general information and do not replace consulting a qualified trainer or medical professional.' },
      { h: 'Liability', p: 'You are responsible for your health and should consult your doctor before starting any training program. BLANCO is not liable for any injuries that may occur.' },
      { h: 'Membership', p: 'Membership can be cancelled at any time. Payments are reviewed manually until the payment gateway is connected.' },
      { h: 'Intellectual Property', p: 'All content on the platform is owned by BLANCO FITNESS and may not be copied or reused without permission.' },
    ],
  };

  return (
    <div className="container-blanco py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-blanco-white text-center mb-2">{content.title}</h1>
      <div className="gold-divider max-w-xs mx-auto mb-8" />
      <div className="space-y-4">
        {content.sections.map((s, i) => (
          <Card key={i} className="p-5">
            <h2 className="font-semibold text-blanco-gold mb-2">{i+1}. {s.h}</h2>
            <p className="text-sm text-blanco-muted">{s.p}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
