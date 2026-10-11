import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Languages, User, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';

export function Navbar() {
  const { t, lang, toggleLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/exercises', label: t('nav.exercises') },
    { to: '/programs', label: t('nav.programs') },
    { to: '/nutrition', label: t('nav.nutrition') },
    { to: '/trainers', label: t('nav.trainers') },
    { to: '/membership', label: t('nav.membership') },
    { to: '/#transformations', label: lang === 'ar' ? 'قبل وبعد' : 'Before & After' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass border-b border-blanco-gold/10 py-2 shadow-card' : 'bg-transparent py-4'
    }`}>
      <nav className="container-blanco flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive ? 'text-blanco-gold' : 'text-blanco-muted hover:text-blanco-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-gold-gradient" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="p-2 rounded-lg text-blanco-muted hover:text-blanco-gold hover:bg-blanco-elevated transition-all duration-300"
            aria-label="Toggle language"
          >
            <Languages className="h-5 w-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-blanco-muted hover:text-blanco-gold hover:bg-blanco-elevated hover:rotate-12 transition-all duration-300"
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-blanco-elevated transition-all"
              >
                <div className="h-8 w-8 rounded-full bg-blanco-gold/20 flex items-center justify-center border border-blanco-gold/30">
                  <User className="h-4 w-4 text-blanco-gold" />
                </div>
                <ChevronDown className={`h-3 w-3 text-blanco-muted transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} w-56 card-elevated p-2 animate-scale-in shadow-card`}>
                  <div className="px-3 py-2 border-b border-blanco-line mb-1">
                    <p className="text-sm font-medium text-blanco-white truncate">{user.email}</p>
                    <p className="text-xs text-blanco-gold capitalize">{role}</p>
                  </div>
                      {(role === 'super_admin' || role === 'admin') && (
                    <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blanco-muted hover:text-blanco-white hover:bg-blanco-elevated transition-all">
                      <Shield className="h-4 w-4" /> {t('nav.admin')}
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blanco-muted hover:text-red-400 hover:bg-blanco-elevated transition-all">
                    <LogOut className="h-4 w-4" /> {t('nav.signout')}
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-blanco-muted hover:text-blanco-white hover:bg-blanco-elevated transition-all"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-blanco-gold/10 animate-fade-in-down">
          <div className="container-blanco py-4 space-y-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive ? 'text-blanco-gold bg-blanco-gold/10' : 'text-blanco-muted hover:text-blanco-white hover:bg-blanco-elevated'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
