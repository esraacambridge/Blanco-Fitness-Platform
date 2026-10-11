import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter, MessageCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Logo } from '@/components/Logo';

const WHATSAPP_NUMBER = '201126545452';
const WHATSAPP_DISPLAY = '01126545452';

export function Footer() {
  const { t, lang } = useI18n();

  const quickLinks = [
    { to: '/exercises', label: t('nav.exercises') },
    { to: '/programs', label: t('nav.programs') },
    { to: '/nutrition', label: t('nav.nutrition') },
    { to: '/membership', label: t('nav.membership') },
    { to: '/faq', label: t('nav.faq') },
  ];

  return (
    <footer className="relative bg-blanco-secondary border-t border-blanco-gold/10 mt-20 overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blanco-gold/50 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gold-radial opacity-50 pointer-events-none" />

      <div className="relative container-blanco py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-sm text-blanco-muted leading-relaxed">
              {lang === 'ar'
                ? 'منصة اللياقة البدنية المتميزة. ابنِ نسخة أقوى من نفسك مع برامج تدريبية احترافية وتمارين مفصلة وإرشادات تغذية.'
                : 'Premium fitness platform. Build your stronger self with professional training programs, detailed exercises, and nutrition guidance.'}
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-10 w-10 rounded-lg bg-blanco-elevated flex items-center justify-center text-blanco-muted hover:text-blanco-gold hover:border-blanco-gold/40 hover:shadow-gold border border-transparent transition-all duration-300 hover:-translate-y-0.5"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-blanco-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-gold-gradient" />
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 flex items-center gap-2 group">
                    <span className="h-px w-0 bg-blanco-gold transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-blanco-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-gold-gradient" />
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 group"
                >
                  <span className="p-1.5 rounded-lg bg-blanco-elevated group-hover:bg-green-500/20 transition-all">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  </span>
                  <span dir="ltr">WhatsApp: {WHATSAPP_DISPLAY}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300">
                <Mail className="h-4 w-4 mt-0.5 text-blanco-gold flex-shrink-0" />
                <span>contact@blancofitness.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-blanco-muted">
                <MapPin className="h-4 w-4 mt-0.5 text-blanco-gold flex-shrink-0" />
                <span>{lang === 'ar' ? 'يُضاف قريباً' : 'To be added'}</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-blanco-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-gold-gradient" />
              {t('footer.about')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 flex items-center gap-2 group"><span className="h-px w-0 bg-blanco-gold transition-all duration-300 group-hover:w-3" />{t('nav.about')}</Link></li>
              <li><Link to="/privacy-policy" className="text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 flex items-center gap-2 group"><span className="h-px w-0 bg-blanco-gold transition-all duration-300 group-hover:w-3" />{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 flex items-center gap-2 group"><span className="h-px w-0 bg-blanco-gold transition-all duration-300 group-hover:w-3" />{t('footer.terms')}</Link></li>
              <li><Link to="/contact" className="text-sm text-blanco-muted hover:text-blanco-gold transition-colors duration-300 flex items-center gap-2 group"><span className="h-px w-0 bg-blanco-gold transition-all duration-300 group-hover:w-3" />{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="accent-divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blanco-muted">
            © {new Date().getFullYear()} BLANCO FITNESS. {t('footer.rights')}.
          </p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs text-blanco-muted">
              {lang === 'ar' ? 'صُنع بشغف بواسطة' : 'Crafted with passion by'}
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blanco-gold hover:text-blanco-gold-light transition-colors flex items-center gap-2"
            >
              Adam Mohmed Atia
              <MessageCircle className="h-3.5 w-3.5 text-green-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
