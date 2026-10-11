import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PublicLayout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { ExerciseLibraryPage } from '@/pages/ExerciseLibraryPage';
import { ExerciseDetailPage } from '@/pages/ExerciseDetailPage';
import { ProgramsPage } from '@/pages/ProgramsPage';
import { ProgramDetailPage } from '@/pages/ProgramDetailPage';
import { NutritionPage } from '@/pages/NutritionPage';
import { NutritionDetailPage } from '@/pages/NutritionDetailPage';
import { TrainersPage } from '@/pages/TrainersPage';
import { TrainerDetailPage } from '@/pages/TrainerDetailPage';
import { MembershipPage } from '@/pages/MembershipPage';
import { ContactPage } from '@/pages/ContactPage';
import { FAQPage } from '@/pages/FAQPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public pages with navbar + footer */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/exercises" element={<ExerciseLibraryPage />} />
                <Route path="/exercises/:slug" element={<ExerciseDetailPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/programs/:slug" element={<ProgramDetailPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/nutrition/:slug" element={<NutritionDetailPage />} />
                <Route path="/trainers" element={<TrainersPage />} />
                <Route path="/trainers/:slug" element={<TrainerDetailPage />} />
                <Route path="/membership" element={<MembershipPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
                <Route path="/terms" element={<LegalPage type="terms" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="/login" element={<LoginPage />} />
              {/* Hidden admin dashboard; access remains restricted to admin accounts. */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
