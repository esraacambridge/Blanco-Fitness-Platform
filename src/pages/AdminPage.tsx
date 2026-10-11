import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Dumbbell, BookOpen, CreditCard, UserCircle,
  FileText, Settings as SettingsIcon, LogOut, Shield, TrendingUp, Plus, Edit, Trash2, ImagePlus, Star, Award
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { LoadingSpinner, EmptyState, Alert } from '@/components/ui/Feedback';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Logo } from '@/components/Logo';
import type { Profile, Exercise, Program, MembershipPlan, Membership, NutritionArticle, FAQ, SiteSettings, Trainer, Transformation, Testimonial, Award as AwardType } from '@/types';

type AdminTab = 'overview' | 'users' | 'exercises' | 'programs' | 'nutrition' | 'trainers' | 'memberships' | 'plans' | 'transformations' | 'testimonials' | 'awards' | 'content' | 'settings';

async function uploadSiteImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
    throw new Error('Please choose an image smaller than 5 MB.');
  }
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `site/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('site-media').upload(path, file, { contentType: file.type, cacheControl: '3600' });
  if (error) throw new Error('Image upload failed.');
  return supabase.storage.from('site-media').getPublicUrl(path).data.publicUrl;
}

export function AdminPage() {
  const { t, lang } = useI18n();
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const isAr = lang === 'ar';

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/" replace />;
  if (role !== 'admin' && role !== 'super_admin') return <Navigate to="/" replace />;

  const tabs: { key: AdminTab; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: t('admin.overview'), icon: LayoutDashboard },
    { key: 'users', label: t('admin.users'), icon: Users },
    { key: 'exercises', label: t('admin.exercises'), icon: Dumbbell },
    { key: 'programs', label: t('admin.programs'), icon: TrendingUp },
    { key: 'nutrition', label: t('admin.nutrition'), icon: BookOpen },
    { key: 'trainers', label: isAr ? 'المدربون' : 'Trainers', icon: UserCircle },
    { key: 'memberships', label: t('admin.memberships'), icon: CreditCard },
    { key: 'plans', label: isAr ? 'خطط العضوية' : 'Membership Plans', icon: CreditCard },
    { key: 'transformations', label: isAr ? 'التحولات' : 'Transformations', icon: ImagePlus },
    { key: 'testimonials', label: isAr ? 'الشهادات' : 'Testimonials', icon: Star },
    { key: 'awards', label: isAr ? 'الأوسمة' : 'Awards', icon: Award },
    { key: 'content', label: t('admin.content'), icon: FileText },
    { key: 'settings', label: t('admin.settings'), icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-blanco-black flex">
      <aside className="w-64 bg-blanco-secondary border-e border-blanco-elevated flex flex-col fixed h-full z-40 hidden md:flex">
        <div className="p-4 border-b border-blanco-elevated">
          <Logo size="sm" />
          <div className="mt-2 flex items-center gap-2 px-2">
            <Shield className="h-3 w-3 text-blanco-gold" />
            <span className="text-xs text-blanco-gold font-medium uppercase tracking-wider">{t('admin.title')}</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(tabItem => (
            <button key={tabItem.key} onClick={() => setTab(tabItem.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === tabItem.key ? 'bg-blanco-gold/10 text-blanco-gold border border-blanco-gold/20' : 'text-blanco-muted hover:text-blanco-white hover:bg-blanco-elevated'}`}>
              <tabItem.icon className="h-4 w-4 flex-shrink-0" /> {tabItem.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-blanco-elevated space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blanco-muted hover:text-blanco-white hover:bg-blanco-elevated transition-all">
            <UserCircle className="h-4 w-4" /> {isAr ? 'العودة للموقع' : 'Back to site'}
          </Link>
          <button onClick={async () => { await signOut(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blanco-muted hover:text-red-400 hover:bg-blanco-elevated transition-all">
            <LogOut className="h-4 w-4" /> {t('nav.signout')}
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ms-64 p-6">
        <div className="md:hidden mb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-1">
            {tabs.map(tabItem => (
              <button key={tabItem.key} onClick={() => setTab(tabItem.key)} className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === tabItem.key ? 'bg-blanco-gold/10 text-blanco-gold' : 'text-blanco-muted'}`}>
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-blanco-white mb-6">{tabs.find(tb => tb.key === tab)?.label}</h1>

        {tab === 'overview' && <AdminOverview isAr={isAr} />}
        {tab === 'users' && <AdminUsers isAr={isAr} />}
        {tab === 'exercises' && <AdminExercises isAr={isAr} />}
        {tab === 'programs' && <AdminPrograms isAr={isAr} />}
        {tab === 'nutrition' && <AdminNutrition isAr={isAr} />}
        {tab === 'trainers' && <AdminTrainers isAr={isAr} />}
        {tab === 'memberships' && <AdminMemberships isAr={isAr} />}
        {tab === 'plans' && <AdminPlans isAr={isAr} />}
        {tab === 'transformations' && <AdminTransformations isAr={isAr} />}
        {tab === 'testimonials' && <AdminTestimonials isAr={isAr} />}
        {tab === 'awards' && <AdminAwards isAr={isAr} />}
        {tab === 'content' && <AdminContent isAr={isAr} />}
        {tab === 'settings' && <AdminSettings isAr={isAr} />}
      </main>
    </div>
  );
}

function AdminOverview({ isAr }: { isAr: boolean }) {
  const [stats, setStats] = useState({ users: 0, activeMemberships: 0, pendingApps: 0, exercises: 0, programs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersRes, activeRes, pendingRes, exRes, progRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('exercises').select('id', { count: 'exact', head: true }),
        supabase.from('programs').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        users: usersRes.count || 0,
        activeMemberships: activeRes.count || 0,
        pendingApps: pendingRes.count || 0,
        exercises: exRes.count || 0,
        programs: progRes.count || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: isAr ? 'إجمالي المستخدمين' : 'Total Users', value: stats.users, icon: Users },
    { label: isAr ? 'العضويات النشطة' : 'Active Memberships', value: stats.activeMemberships, icon: CreditCard },
    { label: isAr ? 'الطلبات المعلقة' : 'Pending Applications', value: stats.pendingApps, icon: FileText },
    { label: isAr ? 'التمارين' : 'Exercises', value: stats.exercises, icon: Dumbbell },
    { label: isAr ? 'البرامج' : 'Programs', value: stats.programs, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blanco-gold/10 border border-blanco-gold/20"><c.icon className="h-5 w-5 text-blanco-gold" /></div>
              <div><p className="text-xs text-blanco-muted">{c.label}</p><p className="text-2xl font-bold text-blanco-white">{c.value}</p></div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h3 className="font-semibold text-blanco-white mb-2">{isAr ? 'ملاحظة' : 'Note'}</h3>
        <p className="text-sm text-blanco-muted">{isAr ? 'جميع الإحصائيات من قاعدة بيانات حقيقية. البيانات الأولية للتطوير موضحة بوضوح.' : 'All statistics are from real database queries. Development seed data is clearly identified.'}</p>
      </Card>
    </div>
  );
}

function AdminUsers({ isAr }: { isAr: boolean }) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setUsers(data as Profile[] || []);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()) || (u.full_name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="p-5">
      <Input placeholder={isAr ? 'بحث...' : 'Search...'} value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState icon={Users} title={isAr ? 'لا يوجد مستخدمون' : 'No users'} /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-blanco-muted text-xs border-b border-blanco-elevated">
              <th className="text-start py-2 px-3">{isAr ? 'الاسم' : 'Name'}</th>
              <th className="text-start py-2 px-3">{isAr ? 'البريد' : 'Email'}</th>
              <th className="text-start py-2 px-3">{isAr ? 'الهاتف' : 'Phone'}</th>
              <th className="text-start py-2 px-3">{isAr ? 'الحالة' : 'Status'}</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-blanco-secondary hover:bg-blanco-secondary/50">
                  <td className="py-2 px-3 text-blanco-white">{u.full_name || '-'}</td>
                  <td className="py-2 px-3 text-blanco-muted">{u.email}</td>
                  <td className="py-2 px-3 text-blanco-muted">{u.phone || '-'}</td>
                  <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-xs ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{u.is_active ? (isAr ? 'نشط' : 'Active') : (isAr ? 'موقوف' : 'Suspended')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function AdminExercises({ isAr }: { isAr: boolean }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', difficulty: 'beginner', is_published: true, description_en: '', description_ar: '' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    supabase.from('exercises').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setExercises(data as Exercise[] || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editId) {
      await supabase.from('exercises').update(form).eq('id', editId);
    } else {
      await supabase.from('exercises').insert(form);
    }
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ name_en: '', name_ar: '', slug: '', difficulty: 'beginner', is_published: true, description_en: '', description_ar: '' });
    load();
  };

  const handleEdit = (ex: Exercise) => {
    setEditId(ex.id);
    setForm({ name_en: ex.name_en, name_ar: ex.name_ar, slug: ex.slug, difficulty: ex.difficulty || 'beginner', is_published: ex.is_published, description_en: ex.description_en || '', description_ar: ex.description_ar || '' });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('exercises').delete().eq('id', deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-blanco-muted">{exercises.length} {isAr ? 'تمرين' : 'exercises'}</p>
        <Button variant="gold" size="sm" onClick={() => { setShowForm(!showForm); setEditId(null); }}><Plus className="h-4 w-4" /> {isAr ? 'إضافة تمرين' : 'Add Exercise'}</Button>
      </div>
      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label={isAr ? 'الاسم (إنجليزي)' : 'Name (EN)'} value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} required />
              <Input label={isAr ? 'الاسم (عربي)' : 'Name (AR)'} value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              <Select label={isAr ? 'المستوى' : 'Difficulty'} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</option>
                <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
                <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
              </Select>
            </div>
            <Textarea label={isAr ? 'الوصف (إنجليزي)' : 'Description (EN)'} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
            <Textarea label={isAr ? 'الوصف (عربي)' : 'Description (AR)'} value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} />
            <label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 text-blanco-gold" /> {isAr ? 'منشور' : 'Published'}</label>
            <div className="flex gap-2"><Button type="submit" variant="gold" loading={saving}>{isAr ? 'حفظ' : 'Save'}</Button><Button variant="ghost" onClick={() => { setShowForm(false); setEditId(null); }}>{isAr ? 'إلغاء' : 'Cancel'}</Button></div>
          </form>
        </Card>
      )}
      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map(ex => (
            <Card key={ex.id} className="p-4">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-medium text-blanco-white">{isAr ? ex.name_ar : ex.name_en}</p><p className="text-xs text-blanco-muted mt-1">{ex.difficulty}</p></div>
                <span className={`px-2 py-0.5 rounded text-xs ${ex.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{ex.is_published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(ex)} className="p-2 rounded-lg bg-blanco-secondary text-blanco-muted hover:text-blanco-gold transition-all"><Edit className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(ex.id)} className="p-2 rounded-lg bg-blanco-secondary text-blanco-muted hover:text-red-400 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title={isAr ? 'تأكيد الحذف' : 'Confirm Delete'} message={isAr ? 'هل أنت متأكد من حذف هذا التمرين؟' : 'Are you sure you want to delete this exercise?'} danger confirmText={isAr ? 'حذف' : 'Delete'} />
    </div>
  );
}

function AdminPrograms({ isAr }: { isAr: boolean }) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title_en: '', title_ar: '', slug: '', description_en: '', description_ar: '', level: 'beginner', duration_weeks: 4, days_per_week: 3, image_url: '', is_published: true, is_archived: false });

  const load = () => { supabase.from('programs').select('*').order('created_at', { ascending: false }).then(({ data }) => { setPrograms(data as Program[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ title_en: '', title_ar: '', slug: '', description_en: '', description_ar: '', level: 'beginner', duration_weeks: 4, days_per_week: 3, image_url: '', is_published: true, is_archived: false }); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); const result = editing ? await supabase.from('programs').update({ ...form, duration_weeks: Number(form.duration_weeks), days_per_week: Number(form.days_per_week) }).eq('id', editing) : await supabase.from('programs').insert({ ...form, duration_weeks: Number(form.duration_weeks), days_per_week: Number(form.days_per_week) }); if (!result.error) { reset(); load(); } };
  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4"><Card className="p-5"><form onSubmit={save} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label="Title (EN)" value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} required /><Input label="Title (AR)" value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} required /><Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /><Select label={isAr ? 'المستوى' : 'Level'} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></Select><Input label={isAr ? 'الأسابيع' : 'Weeks'} type="number" value={form.duration_weeks} onChange={e => setForm({ ...form, duration_weeks: Number(e.target.value) })} /><Input label={isAr ? 'الأيام أسبوعياً' : 'Days per week'} type="number" value={form.days_per_week} onChange={e => setForm({ ...form, days_per_week: Number(e.target.value) })} /><Textarea label="Description (EN)" value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} /><Textarea label="Description (AR)" value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} /><div><label className="mt-2 inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{isAr ? 'رفع صورة' : 'Upload image'}<input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) void uploadSiteImage(file).then(url => setForm(current => ({ ...current, image_url: url }))); }} /></label></div></div><div className="flex gap-4 text-sm text-blanco-muted"><label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.is_archived} onChange={e => setForm({ ...form, is_archived: e.target.checked })} /> Archived</label></div><div className="flex gap-2"><Button type="submit" variant="gold">{editing ? 'Update' : 'Add program'}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>Cancel</Button>}</div></form></Card><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{programs.map(p => <Card key={p.id} className="p-4"><p className="text-sm font-medium text-blanco-white">{isAr ? p.title_ar : p.title_en}</p><p className="text-xs text-blanco-muted mt-1">{p.level} · {p.duration_weeks} {isAr ? 'أسابيع' : 'weeks'}</p><span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${p.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{p.is_published ? 'Published' : 'Draft'}</span><div className="flex gap-2 mt-4"><Button size="sm" variant="ghost" onClick={() => { setEditing(p.id); setForm({ title_en: p.title_en, title_ar: p.title_ar, slug: p.slug, description_en: p.description_en || '', description_ar: p.description_ar || '', level: p.level || 'beginner', duration_weeks: p.duration_weeks, days_per_week: p.days_per_week, image_url: p.image_url || '', is_published: p.is_published, is_archived: p.is_archived }); }}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={async () => { await supabase.from('programs').delete().eq('id', p.id); load(); }}><Trash2 className="h-4 w-4" /></Button></div></Card>)}</div></div>;
}

function AdminNutrition({ isAr }: { isAr: boolean }) {
  const [articles, setArticles] = useState<NutritionArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('nutrition_articles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setArticles(data as NutritionArticle[] || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map(a => (
        <Card key={a.id} className="p-4">
          <p className="text-sm font-medium text-blanco-white">{isAr ? a.title_ar : a.title_en}</p>
          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${a.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{a.is_published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}</span>
          <div className="flex gap-2 mt-4"><Button size="sm" variant="ghost" onClick={async () => { const next = !a.is_published; await supabase.from('nutrition_articles').update({ is_published: next }).eq('id', a.id); setArticles(current => current.map(item => item.id === a.id ? { ...item, is_published: next } : item)); }}>{a.is_published ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'نشر' : 'Publish')}</Button><Button size="sm" variant="ghost" onClick={async () => { await supabase.from('nutrition_articles').delete().eq('id', a.id); setArticles(current => current.filter(item => item.id !== a.id)); }}><Trash2 className="h-4 w-4" /></Button></div>
        </Card>
      ))}
    </div>
  );
}

function AdminTrainers({ isAr }: { isAr: boolean }) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', bio_en: '', bio_ar: '', image_url: '', contact_email: '', is_verified: false, is_published: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    supabase.from('trainers').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setTrainers(data as Trainer[] || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({ name_en: '', name_ar: '', slug: '', bio_en: '', bio_ar: '', image_url: '', contact_email: '', is_verified: false, is_published: true });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = editing
      ? await supabase.from('trainers').update(form).eq('id', editing)
      : await supabase.from('trainers').insert(form);
    setSaving(false);
    if (!result.error) { reset(); load(); }
  };

  const edit = (trainer: Trainer) => setForm({
    name_en: trainer.name_en, name_ar: trainer.name_ar, slug: trainer.slug,
    bio_en: trainer.bio_en || '', bio_ar: trainer.bio_ar || '', image_url: trainer.image_url || '',
    contact_email: trainer.contact_email || '', is_verified: trainer.is_verified, is_published: trainer.is_published,
  });

  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4">
    <Card className="p-5">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={isAr ? 'الاسم بالإنجليزية' : 'Name (EN)'} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} required />
          <Input label={isAr ? 'الاسم بالعربية' : 'Name (AR)'} value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
          <Input label={isAr ? 'البريد' : 'Email'} type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
          <Textarea label={isAr ? 'نبذة بالإنجليزية' : 'Bio (EN)'} value={form.bio_en} onChange={e => setForm({ ...form, bio_en: e.target.value })} />
          <Textarea label={isAr ? 'نبذة بالعربية' : 'Bio (AR)'} value={form.bio_ar} onChange={e => setForm({ ...form, bio_ar: e.target.value })} />
          <div><label className="mt-2 inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{isAr ? 'رفع صورة' : 'Upload image'}<input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) void uploadSiteImage(file).then(url => setForm(current => ({ ...current, image_url: url }))); }} /></label></div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-blanco-muted">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_verified} onChange={e => setForm({ ...form, is_verified: e.target.checked })} /> {isAr ? 'موثق' : 'Verified'}</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> {isAr ? 'منشور' : 'Published'}</label>
        </div>
        <div className="flex gap-2"><Button type="submit" variant="gold" loading={saving}>{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة' : 'Add')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div>
      </form>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map(trainer => <Card key={trainer.id} className="p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="font-medium text-blanco-white">{isAr ? trainer.name_ar : trainer.name_en}</p><p className="text-xs text-blanco-muted mt-1">{trainer.slug}</p></div><span className={`px-2 py-0.5 rounded text-xs ${trainer.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{trainer.is_published ? 'Published' : 'Draft'}</span></div>
        <div className="flex gap-2 mt-4"><Button size="sm" variant="ghost" onClick={() => { setEditing(trainer.id); edit(trainer); }}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={async () => { await supabase.from('trainers').delete().eq('id', trainer.id); load(); }}><Trash2 className="h-4 w-4" /></Button></div>
      </Card>)}
    </div>
  </div>;
}

function AdminPlans({ isAr }: { isAr: boolean }) {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', slug: '', description_en: '', description_ar: '', price_egp: 0, duration_months: 1, plan_type: 'both', is_active: true, sort_order: 0 });
  const [loading, setLoading] = useState(true);

  const load = () => { supabase.from('membership_plans').select('*').order('sort_order').then(({ data }) => { setPlans(data as MembershipPlan[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ name_en: '', name_ar: '', slug: '', description_en: '', description_ar: '', price_egp: 0, duration_months: 1, plan_type: 'both', is_active: true, sort_order: 0 }); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); const payload = { ...form, price_egp: Number(form.price_egp), duration_months: Number(form.duration_months), sort_order: Number(form.sort_order) }; const result = editing ? await supabase.from('membership_plans').update(payload).eq('id', editing) : await supabase.from('membership_plans').insert(payload); if (!result.error) { reset(); load(); } };
  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4"><Card className="p-5"><form onSubmit={save} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label={isAr ? 'اسم الخطة بالإنجليزية' : 'Name (EN)'} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} required /><Input label={isAr ? 'اسم الخطة بالعربية' : 'Name (AR)'} value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} required /><Input label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required /><Input label={isAr ? 'السعر بالجنيه' : 'Price (EGP)'} type="number" value={form.price_egp} onChange={e => setForm({ ...form, price_egp: Number(e.target.value) })} /><Input label={isAr ? 'المدة بالشهور' : 'Duration (months)'} type="number" value={form.duration_months} onChange={e => setForm({ ...form, duration_months: Number(e.target.value) })} /><Input label={isAr ? 'الترتيب' : 'Sort order'} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /><Textarea label={isAr ? 'الوصف بالعربية' : 'Description (AR)'} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} /><Textarea label={isAr ? 'الوصف بالإنجليزية' : 'Description (EN)'} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} /></div><label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> {isAr ? 'نشطة' : 'Active'}</label><div className="flex gap-2"><Button type="submit" variant="gold">{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة' : 'Add')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div></form></Card><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{plans.map(plan => <Card key={plan.id} className="p-4"><p className="font-medium text-blanco-white">{isAr ? plan.name_ar : plan.name_en}</p><p className="text-sm text-blanco-gold mt-2">{plan.price_egp} EGP / {plan.duration_months} mo</p><div className="flex gap-2 mt-4"><Button size="sm" variant="ghost" onClick={() => { setEditing(plan.id); setForm({ name_en: plan.name_en, name_ar: plan.name_ar, slug: plan.slug, description_en: plan.description_en || '', description_ar: plan.description_ar || '', price_egp: plan.price_egp, duration_months: plan.duration_months, plan_type: plan.plan_type, is_active: plan.is_active, sort_order: plan.sort_order }); }}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={async () => { await supabase.from('membership_plans').delete().eq('id', plan.id); load(); }}><Trash2 className="h-4 w-4" /></Button></div></Card>)}</div></div>;
}

function AdminMemberships({ isAr }: { isAr: boolean }) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    supabase.from('memberships').select('*, plan:membership_plans(*), profile:profiles(email, full_name)').order('created_at', { ascending: false }).then(({ data }) => {
      setMemberships(data as Membership[] || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('memberships').update({ status }).eq('id', id);
    load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-blanco-muted text-xs border-b border-blanco-elevated">
          <th className="text-start py-2 px-3">{isAr ? 'العضو' : 'Member'}</th>
          <th className="text-start py-2 px-3">{isAr ? 'الخطة' : 'Plan'}</th>
          <th className="text-start py-2 px-3">{isAr ? 'الحالة' : 'Status'}</th>
          <th className="text-start py-2 px-3">{isAr ? 'إجراءات' : 'Actions'}</th>
        </tr></thead>
        <tbody>
          {memberships.map(m => (
            <tr key={m.id} className="border-b border-blanco-secondary">
              <td className="py-2 px-3 text-blanco-white">{(m as any).profile?.email || '-'}</td>
              <td className="py-2 px-3 text-blanco-muted">{isAr ? m.plan?.name_ar : m.plan?.name_en}</td>
              <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded text-xs ${m.status === 'active' ? 'bg-green-500/20 text-green-400' : m.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blanco-elevated text-blanco-muted'}`}>{m.status}</span></td>
              <td className="py-2 px-3">
                <select value={m.status} onChange={(e) => updateStatus(m.id, e.target.value)} className="bg-blanco-secondary text-blanco-white text-xs rounded px-2 py-1 border border-blanco-elevated">
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminContent({ isAr }: { isAr: boolean }) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ question_en: '', question_ar: '', answer_en: '', answer_ar: '', sort_order: 0, is_published: true });

  const load = () => { supabase.from('faqs').select('*').order('sort_order').then(({ data }) => { setFaqs(data as FAQ[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ question_en: '', question_ar: '', answer_en: '', answer_ar: '', sort_order: 0, is_published: true }); };
  const save = async (event: React.FormEvent) => { event.preventDefault(); const payload = { ...form, sort_order: Number(form.sort_order) }; const result = editing ? await supabase.from('faqs').update(payload).eq('id', editing) : await supabase.from('faqs').insert(payload); if (!result.error) { reset(); load(); } };
  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4"><Card className="p-5"><form onSubmit={save} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label="Question (EN)" value={form.question_en} onChange={e => setForm({ ...form, question_en: e.target.value })} required /><Input label="Question (AR)" value={form.question_ar} onChange={e => setForm({ ...form, question_ar: e.target.value })} required /><Textarea label="Answer (EN)" value={form.answer_en} onChange={e => setForm({ ...form, answer_en: e.target.value })} /><Textarea label="Answer (AR)" value={form.answer_ar} onChange={e => setForm({ ...form, answer_ar: e.target.value })} /></div><label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> {isAr ? 'منشور' : 'Published'}</label><div className="flex gap-2"><Button type="submit" variant="gold">{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة سؤال' : 'Add FAQ')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div></form></Card><Card className="p-5"><h3 className="font-semibold text-blanco-white mb-4">{isAr ? 'الأسئلة الشائعة' : 'FAQs'}</h3><div className="space-y-2">{faqs.map(f => <div key={f.id} className="p-3 rounded-lg bg-blanco-secondary flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-blanco-white">{isAr ? f.question_ar : f.question_en}</p><p className="text-xs text-blanco-muted mt-1">{isAr ? f.answer_ar : f.answer_en}</p></div><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => { setEditing(f.id); setForm({ question_en: f.question_en, question_ar: f.question_ar, answer_en: f.answer_en || '', answer_ar: f.answer_ar || '', sort_order: f.sort_order, is_published: f.is_published }); }}><Edit className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={async () => { await supabase.from('faqs').delete().eq('id', f.id); setFaqs(current => current.filter(item => item.id !== f.id)); }}><Trash2 className="h-4 w-4" /></Button></div></div>)}</div></Card></div>;
}

function AdminTransformations({ isAr }: { isAr: boolean }) {
  const [items, setItems] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name_en: '', name_ar: '', before_image_url: '', after_image_url: '', caption_en: '', caption_ar: '', duration_weeks: 0, weight_before_kg: 0, weight_after_kg: 0, is_published: false, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => { supabase.from('transformations').select('*').order('sort_order').then(({ data }) => { setItems(data as Transformation[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ name_en: '', name_ar: '', before_image_url: '', after_image_url: '', caption_en: '', caption_ar: '', duration_weeks: 0, weight_before_kg: 0, weight_after_kg: 0, is_published: false, sort_order: 0 }); };

  const handleUpload = async (file: File, field: 'before_image_url' | 'after_image_url') => {
    try { const url = await uploadSiteImage(file); setForm(current => ({ ...current, [field]: url })); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.'); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.before_image_url || !form.after_image_url) { setError(isAr ? 'يجب رفع صورتين قبل وبعد' : 'Both before and after images are required'); return; }
    setSaving(true); setError('');
    const payload = { ...form, duration_weeks: form.duration_weeks || null, weight_before_kg: form.weight_before_kg || null, weight_after_kg: form.weight_after_kg || null, sort_order: Number(form.sort_order) };
    const result = editing ? await supabase.from('transformations').update(payload).eq('id', editing) : await supabase.from('transformations').insert(payload);
    setSaving(false);
    if (result.error) { setError(isAr ? 'تعذر الحفظ' : 'Could not save'); return; }
    reset(); load();
  };

  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4">
    {error && <Alert type="error" message={error} />}
    <Card className="p-5">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={isAr ? 'الاسم بالإنجليزية' : 'Name (EN)'} value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} required />
          <Input label={isAr ? 'الاسم بالعربية' : 'Name (AR)'} value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
          <Input label={isAr ? 'المدة بالأسابيع' : 'Duration (weeks)'} type="number" value={form.duration_weeks} onChange={e => setForm({ ...form, duration_weeks: Number(e.target.value) })} />
          <Input label={isAr ? 'الترتيب' : 'Sort order'} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <Input label={isAr ? 'الوزن قبل (كجم)' : 'Weight before (kg)'} type="number" value={form.weight_before_kg} onChange={e => setForm({ ...form, weight_before_kg: Number(e.target.value) })} />
          <Input label={isAr ? 'الوزن بعد (كجم)' : 'Weight after (kg)'} type="number" value={form.weight_after_kg} onChange={e => setForm({ ...form, weight_after_kg: Number(e.target.value) })} />
          <Textarea label={isAr ? 'تعليق بالإنجليزية' : 'Caption (EN)'} value={form.caption_en} onChange={e => setForm({ ...form, caption_en: e.target.value })} />
          <Textarea label={isAr ? 'تعليق بالعربية' : 'Caption (AR)'} value={form.caption_ar} onChange={e => setForm({ ...form, caption_ar: e.target.value })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-blanco-line p-4 space-y-3">
            <p className="text-sm font-medium text-blanco-white">{isAr ? 'صورة قبل' : 'Before image'}</p>
            {form.before_image_url && <img src={form.before_image_url} alt="Before" className="h-40 w-full rounded-lg object-cover" />}
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{isAr ? 'رفع صورة قبل' : 'Upload before'}<input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) void handleUpload(file, 'before_image_url'); }} /></label>
          </div>
          <div className="rounded-xl border border-blanco-line p-4 space-y-3">
            <p className="text-sm font-medium text-blanco-white">{isAr ? 'صورة بعد' : 'After image'}</p>
            {form.after_image_url && <img src={form.after_image_url} alt="After" className="h-40 w-full rounded-lg object-cover" />}
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{isAr ? 'رفع صورة بعد' : 'Upload after'}<input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) void handleUpload(file, 'after_image_url'); }} /></label>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> {isAr ? 'منشور' : 'Published'}</label>
        <div className="flex gap-2"><Button type="submit" variant="gold" loading={saving}>{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة تحول' : 'Add transformation')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div>
      </form>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => <Card key={item.id} className="p-4">
        <div className="flex gap-2 mb-3">
          <img src={item.before_image_url} alt="Before" className="h-24 w-1/2 rounded-lg object-cover" />
          <img src={item.after_image_url} alt="After" className="h-24 w-1/2 rounded-lg object-cover" />
        </div>
        <p className="font-medium text-blanco-white">{isAr ? (item.name_ar || item.name_en) : item.name_en}</p>
        {item.duration_weeks && <p className="text-xs text-blanco-muted mt-1">{item.duration_weeks} {isAr ? 'أسابيع' : 'weeks'}</p>}
        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.is_published ? 'Published' : 'Draft'}</span>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => { setEditing(item.id); setForm({ name_en: item.name_en, name_ar: item.name_ar || '', before_image_url: item.before_image_url, after_image_url: item.after_image_url, caption_en: item.caption_en || '', caption_ar: item.caption_ar || '', duration_weeks: item.duration_weeks || 0, weight_before_kg: item.weight_before_kg || 0, weight_after_kg: item.weight_after_kg || 0, is_published: item.is_published, sort_order: item.sort_order }); }}><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('transformations').delete().eq('id', item.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </Card>)}
    </div>
  </div>;
}

function AdminTestimonials({ isAr }: { isAr: boolean }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ author_name: '', author_name_ar: '', content_en: '', content_ar: '', rating: 5, image_url: '', is_published: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => { supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => { setItems(data as Testimonial[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ author_name: '', author_name_ar: '', content_en: '', content_ar: '', rating: 5, image_url: '', is_published: true, sort_order: 0 }); };

  const handleUpload = async (file: File) => {
    setUploading(true); setError('');
    try { const url = await uploadSiteImage(file); setForm(current => ({ ...current, image_url: url })); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, rating: Number(form.rating), sort_order: Number(form.sort_order) };
    const result = editing ? await supabase.from('testimonials').update(payload).eq('id', editing) : await supabase.from('testimonials').insert(payload);
    setSaving(false);
    if (result.error) { setError(result.error.message); return; }
    reset(); load();
  };

  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4">
    {error && <Alert type="error" message={error} />}
    <Card className="p-5">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={isAr ? 'الاسم بالإنجليزية' : 'Author (EN)'} value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} required />
          <Input label={isAr ? 'الاسم بالعربية' : 'Author (AR)'} value={form.author_name_ar} onChange={e => setForm({ ...form, author_name_ar: e.target.value })} />
          <Input label={isAr ? 'التقييم (1-5)' : 'Rating (1-5)'} type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
          <Input label={isAr ? 'الترتيب' : 'Sort order'} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <Textarea label={isAr ? 'المحتوى بالإنجليزية' : 'Content (EN)'} value={form.content_en} onChange={e => setForm({ ...form, content_en: e.target.value })} />
          <Textarea label={isAr ? 'المحتوى بالعربية' : 'Content (AR)'} value={form.content_ar} onChange={e => setForm({ ...form, content_ar: e.target.value })} />
        </div>
        <div className="rounded-xl border border-blanco-line p-4 space-y-3">
          <p className="text-sm font-medium text-blanco-white">{isAr ? 'صورة الشخص' : 'Person image'}</p>
          {form.image_url && <img src={form.image_url} alt="Preview" className="h-32 w-32 rounded-full object-cover" />}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة' : 'Upload image')}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void handleUpload(file); }} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> {isAr ? 'منشور' : 'Published'}</label>
        <div className="flex gap-2"><Button type="submit" variant="gold" loading={saving}>{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة شهادة' : 'Add testimonial')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div>
      </form>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => <Card key={item.id} className="p-4">
        <div className="flex items-start gap-3">
          {item.image_url && <img src={item.image_url} alt={item.author_name} className="h-12 w-12 rounded-full object-cover flex-shrink-0" />}
          <div><p className="font-medium text-blanco-white">{isAr ? (item.author_name_ar || item.author_name) : item.author_name}</p>
          <div className="flex gap-0.5 mt-1">{[...Array(5)].map((_, idx) => <Star key={idx} className={`h-3 w-3 ${idx < item.rating ? 'text-blanco-gold fill-blanco-gold' : 'text-blanco-muted'}`} />)}</div></div>
        </div>
        <p className="text-xs text-blanco-muted mt-2 line-clamp-3">{isAr ? (item.content_ar || item.content_en) : item.content_en}</p>
        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.is_published ? 'Published' : 'Draft'}</span>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => { setEditing(item.id); setForm({ author_name: item.author_name, author_name_ar: item.author_name_ar || '', content_en: item.content_en || '', content_ar: item.content_ar || '', rating: item.rating, image_url: item.image_url || '', is_published: item.is_published, sort_order: item.sort_order }); }}><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('testimonials').delete().eq('id', item.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </Card>)}
    </div>
  </div>;
}

function AdminAwards({ isAr }: { isAr: boolean }) {
  const [items, setItems] = useState<AwardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '', is_published: true, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const load = () => { supabase.from('awards').select('*').order('sort_order').then(({ data }) => { setItems(data as AwardType[] || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const reset = () => { setEditing(null); setForm({ title_en: '', title_ar: '', description_en: '', description_ar: '', image_url: '', is_published: true, sort_order: 0 }); };

  const handleUpload = async (file: File) => {
    setUploading(true); setError('');
    try { const url = await uploadSiteImage(file); setForm(current => ({ ...current, image_url: url })); }
    catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.'); }
    finally { setUploading(false); }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, sort_order: Number(form.sort_order) };
    const result = editing ? await supabase.from('awards').update(payload).eq('id', editing) : await supabase.from('awards').insert(payload);
    setSaving(false);
    if (result.error) { setError(result.error.message); return; }
    reset(); load();
  };

  if (loading) return <LoadingSpinner />;
  return <div className="space-y-4">
    {error && <Alert type="error" message={error} />}
    <Card className="p-5">
      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={isAr ? 'العنوان بالإنجليزية' : 'Title (EN)'} value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} required />
          <Input label={isAr ? 'العنوان بالعربية' : 'Title (AR)'} value={form.title_ar} onChange={e => setForm({ ...form, title_ar: e.target.value })} />
          <Textarea label={isAr ? 'الوصف بالإنجليزية' : 'Description (EN)'} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} />
          <Textarea label={isAr ? 'الوصف بالعربية' : 'Description (AR)'} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })} />
          <Input label={isAr ? 'الترتيب' : 'Sort order'} type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </div>
        <div className="rounded-xl border border-blanco-line p-4 space-y-3">
          <p className="text-sm font-medium text-blanco-white">{isAr ? 'صورة الشهادة' : 'Award image'}</p>
          {form.image_url && <img src={form.image_url} alt="Preview" className="h-40 w-full max-w-xs rounded-lg object-cover" />}
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-blanco-gold"><ImagePlus className="h-4 w-4" />{uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة' : 'Upload image')}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void handleUpload(file); }} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> {isAr ? 'منشور' : 'Published'}</label>
        <div className="flex gap-2"><Button type="submit" variant="gold" loading={saving}>{editing ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة وسام' : 'Add award')}</Button>{editing && <Button type="button" variant="ghost" onClick={reset}>{isAr ? 'إلغاء' : 'Cancel'}</Button>}</div>
      </form>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => <Card key={item.id} className="p-4">
        {item.image_url && <img src={item.image_url} alt={item.title_en} className="h-32 w-full rounded-lg object-cover mb-3" />}
        <p className="font-medium text-blanco-white">{isAr ? (item.title_ar || item.title_en) : item.title_en}</p>
        <p className="text-xs text-blanco-muted mt-1 line-clamp-2">{isAr ? (item.description_ar || item.description_en) : item.description_en}</p>
        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{item.is_published ? 'Published' : 'Draft'}</span>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => { setEditing(item.id); setForm({ title_en: item.title_en, title_ar: item.title_ar || '', description_en: item.description_en || '', description_ar: item.description_ar || '', image_url: item.image_url || '', is_published: item.is_published, sort_order: item.sort_order }); }}><Edit className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={async () => { await supabase.from('awards').delete().eq('id', item.id); load(); }}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </Card>)}
    </div>
  </div>;
}

function AdminSettings({ isAr }: { isAr: boolean }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => setSettings(data as SiteSettings));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError('');
    const { error: saveError } = await supabase.from('site_settings').update({
      brand_name: settings.brand_name,
      hero_headline_en: settings.hero_headline_en,
      hero_headline_ar: settings.hero_headline_ar,
      hero_subheadline_ar: settings.hero_subheadline_ar,
      hero_description_en: settings.hero_description_en,
      hero_description_ar: settings.hero_description_ar,
      hero_image_url: settings.hero_image_url,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address_en: settings.contact_address_en,
      contact_address_ar: settings.contact_address_ar,
      facebook_url: settings.facebook_url,
      instagram_url: settings.instagram_url,
      youtube_url: settings.youtube_url,
      twitter_url: settings.twitter_url,
      maintenance_mode: settings.maintenance_mode,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
    setSaving(false);
    if (saveError) { setError(isAr ? 'تعذر حفظ الإعدادات.' : 'Could not save settings.'); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImage = async (file: File) => {
    if (!settings) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadSiteImage(file);
      setSettings({ ...settings, hero_image_url: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed.');
    } finally { setUploading(false); }
  };

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setSettings(current => current ? { ...current, [key]: value } : current);
  if (!settings) return <LoadingSpinner />;

  return <Card className="p-6">
    {saved && <div className="mb-4"><Alert type="success" message={isAr ? 'تم الحفظ بنجاح' : 'Saved successfully'} /></div>}
    {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
    <form onSubmit={handleSave} className="space-y-5">
      <Input label={isAr ? 'اسم الموقع' : 'Brand name'} value={settings.brand_name} onChange={e => update('brand_name', e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label={isAr ? 'عنوان الصفحة بالإنجليزية' : 'Hero headline (EN)'} value={settings.hero_headline_en} onChange={e => update('hero_headline_en', e.target.value)} /><Input label={isAr ? 'عنوان الصفحة بالعربية' : 'Hero headline (AR)'} value={settings.hero_headline_ar} onChange={e => update('hero_headline_ar', e.target.value)} /></div>
      <Input label={isAr ? 'العنوان الفرعي' : 'Hero subheadline'} value={settings.hero_subheadline_ar} onChange={e => update('hero_subheadline_ar', e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Textarea label={isAr ? 'وصف الصفحة بالإنجليزية' : 'Description (EN)'} value={settings.hero_description_en} onChange={e => update('hero_description_en', e.target.value)} /><Textarea label={isAr ? 'وصف الصفحة بالعربية' : 'Description (AR)'} value={settings.hero_description_ar} onChange={e => update('hero_description_ar', e.target.value)} /></div>
      <div className="rounded-xl border border-blanco-line p-4 space-y-3"><p className="text-sm font-medium text-blanco-white">{isAr ? 'صورة الواجهة' : 'Hero image'}</p>{settings.hero_image_url && <img src={settings.hero_image_url} alt="Hero preview" className="h-32 w-full rounded-lg object-cover" />}<label className="inline-flex items-center gap-2 cursor-pointer btn-outline"><ImagePlus className="h-4 w-4" />{uploading ? (isAr ? 'جاري الرفع...' : 'Uploading...') : (isAr ? 'رفع صورة' : 'Upload image')}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; if (file) void handleImage(file); }} /></label></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label={isAr ? 'بريد التواصل' : 'Contact email'} value={settings.contact_email} onChange={e => update('contact_email', e.target.value)} /><Input label={isAr ? 'هاتف التواصل' : 'Contact phone'} value={settings.contact_phone || ''} onChange={e => update('contact_phone', e.target.value)} /><Textarea label={isAr ? 'العنوان بالعربية' : 'Address (AR)'} value={settings.contact_address_ar || ''} onChange={e => update('contact_address_ar', e.target.value)} /><Textarea label={isAr ? 'العنوان بالإنجليزية' : 'Address (EN)'} value={settings.contact_address_en || ''} onChange={e => update('contact_address_en', e.target.value)} /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Input label="Facebook URL" value={settings.facebook_url || ''} onChange={e => update('facebook_url', e.target.value)} /><Input label="Instagram URL" value={settings.instagram_url || ''} onChange={e => update('instagram_url', e.target.value)} /><Input label="YouTube URL" value={settings.youtube_url || ''} onChange={e => update('youtube_url', e.target.value)} /><Input label="Twitter URL" value={settings.twitter_url || ''} onChange={e => update('twitter_url', e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm text-blanco-muted"><input type="checkbox" checked={settings.maintenance_mode} onChange={e => update('maintenance_mode', e.target.checked)} /> {isAr ? 'وضع الصيانة' : 'Maintenance mode'}</label>
      <Button type="submit" variant="gold" loading={saving}>{isAr ? 'حفظ كل الإعدادات' : 'Save all settings'}</Button>
    </form>
  </Card>;
}
