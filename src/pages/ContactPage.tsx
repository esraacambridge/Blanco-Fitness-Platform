import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Feedback';
import { Card } from '@/components/ui/Card';

export function ContactPage() {
  const { t, lang } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const isAr = lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { setStatus('error'); return; }
    setStatus('success');
    setName(''); setEmail(''); setMessage('');
  };

  return (
    <div className="container-blanco py-10 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-blanco-white uppercase tracking-wide">{t('nav.contact')}</h1>
        <div className="gold-divider mt-3 max-w-xs mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20"><Mail className="h-5 w-5 text-blanco-gold" /></div>
            <div><p className="text-xs text-blanco-muted">{t('auth.email')}</p><p className="text-sm text-blanco-white">contact@blancofitness.com</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20"><Phone className="h-5 w-5 text-blanco-gold" /></div>
            <div><p className="text-xs text-blanco-muted">{isAr ? 'الهاتف' : 'Phone'}</p><p className="text-sm text-blanco-muted">{isAr ? 'يُضاف قريباً' : 'To be added'}</p></div>
          </Card>
          <Card className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20"><MapPin className="h-5 w-5 text-blanco-gold" /></div>
            <div><p className="text-xs text-blanco-muted">{isAr ? 'العنوان' : 'Address'}</p><p className="text-sm text-blanco-muted">{isAr ? 'يُضاف قريباً' : 'To be added'}</p></div>
          </Card>
        </div>
        <Card className="p-6">
          {status === 'success' ? (
            <Alert type="success" message={isAr ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!'} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label={isAr ? 'الاسم' : 'Name'} value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Textarea label={isAr ? 'الرسالة' : 'Message'} value={message} onChange={(e) => setMessage(e.target.value)} required />
              {status === 'error' && <Alert type="error" message={isAr ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'} />}
              <Button type="submit" variant="gold" className="w-full"><Send className="h-4 w-4" /> {isAr ? 'إرسال' : 'Send'}</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
