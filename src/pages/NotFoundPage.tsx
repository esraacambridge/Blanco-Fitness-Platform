import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-6xl md:text-8xl font-bold text-gradient-gold">404</h1>
      <p className="text-xl text-blanco-white mt-4">{isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}</p>
      <p className="text-sm text-blanco-muted mt-2 mb-6">{isAr ? 'عذراً، الصفحة التي تبحث عنها غير متوفرة' : 'Sorry, the page you are looking for is not available'}</p>
      <Link to="/"><Button variant="gold"><HomeIcon className="h-4 w-4" /> {isAr ? 'العودة للرئيسية' : 'Back to Home'}</Button></Link>
    </div>
  );
}
