import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert, LoadingSpinner } from '@/components/ui/Feedback';
import { Logo } from '@/components/Logo';

export function LoginPage() {
  const { t, lang } = useI18n();
  const { user, role, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blanco-black"><LoadingSpinner size="lg" /></div>;
  if (user && (role === 'admin' || role === 'super_admin')) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-blanco-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-radial pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blanco-gold/10 border border-blanco-gold/20">
            <Shield className="h-4 w-4 text-blanco-gold" />
            <span className="text-xs text-blanco-gold font-medium uppercase tracking-wider">
              {isAr ? 'لوحة التحكم' : 'Admin Panel'}
            </span>
          </div>
        </div>

        <div className="bg-blanco-secondary border border-blanco-line rounded-2xl p-8 shadow-2xl">
          <h1 className="font-display text-xl font-bold text-blanco-white text-center mb-1">
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p className="text-sm text-blanco-muted text-center mb-6">
            {isAr ? 'أدخل بياناتك للوصول إلى لوحة التحكم' : 'Enter your credentials to access the dashboard'}
          </p>

          {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={isAr ? 'البريد الإلكتروني' : 'Email'}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
            <div>
              <label className="block text-sm font-medium text-blanco-white mb-1.5">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input-blanco w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-blanco-muted hover:text-blanco-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gold" className="w-full" loading={submitting}>
              {isAr ? 'دخول' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-blanco-muted mt-6">
          {isAr ? 'الوصول مخصص للمسؤولين فقط' : 'Access restricted to administrators only'}
        </p>
      </div>
    </div>
  );
}
