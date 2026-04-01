import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LazyMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import type { Lang, Theme } from './types';

// Load framer-motion features lazily (domAnimation is lighter than domMax)
const loadFeatures = () => import('framer-motion').then((mod) => mod.domAnimation);

// Lazy load below-the-fold sections
const About = lazy(() => import('./components/About'));
const Problems = lazy(() => import('./components/Problems'));
const TargetUsers = lazy(() => import('./components/TargetUsers'));
const Features = lazy(() => import('./components/Features'));
const MobileApp = lazy(() => import('./components/MobileApp'));
const Countdown = lazy(() => import('./components/Countdown'));
const Footer = lazy(() => import('./components/Footer'));

// Lazy load auth pages
const LoginPage = lazy(() => import('./components/auth/LoginPage'));
const RegisterTypePage = lazy(() => import('./components/auth/RegisterTypePage'));
const RegisterPage = lazy(() => import('./components/auth/RegisterPage'));
const ConfirmAccountPage = lazy(() => import('./components/auth/ConfirmAccountPage'));
const ForgotPasswordPage = lazy(() => import('./components/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./components/auth/ResetPasswordPage'));
const BusinessPage = lazy(() => import('./components/BusinessPage'));
const ModuleDetailPage = lazy(() => import('./components/ModuleDetailPage'));
const RoadmapPage = lazy(() => import('./components/RoadmapPage'));
const TasksPage = lazy(() => import('./modules/tasks/TasksPage'));

/** Minimal placeholder for lazy sections */
const SectionFallback = () => <div className="min-h-[30vh]" />;

export type { Lang, Theme };

function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nourstep-theme') as Theme | null;
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nourstep-theme', theme);
  }, [theme]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? 'font-arabic' : 'font-body';

  return (
    <LazyMotion features={loadFeatures} strict>
      <Routes>
        {/* ── Auth Routes ── */}
        <Route
          path="/auth/login"
          element={
            <Suspense fallback={<SectionFallback />}>
              <LoginPage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />
        <Route
          path="/auth/register"
          element={
            <Suspense fallback={<SectionFallback />}>
              <RegisterTypePage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />
        <Route
          path="/auth/register/:role"
          element={
            <Suspense fallback={<SectionFallback />}>
              <RegisterPage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />
        <Route
          path="/auth/confirm"
          element={
            <Suspense fallback={<SectionFallback />}>
              <ConfirmAccountPage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <Suspense fallback={<SectionFallback />}>
              <ForgotPasswordPage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <Suspense fallback={<SectionFallback />}>
              <ResetPasswordPage lang={lang} theme={theme} setLang={setLang} setTheme={setTheme} />
            </Suspense>
          }
        />

        {/* ── Business Docs Route ── */}
        <Route
          path="/business"
          element={
            <Suspense fallback={<SectionFallback />}>
              <BusinessPage />
            </Suspense>
          }
        />

        {/* ── Module Detail Route ── */}
        <Route
          path="/business/modules/:moduleId"
          element={
            <Suspense fallback={<SectionFallback />}>
              <ModuleDetailPage />
            </Suspense>
          }
        />

        {/* ── Roadmap / Sprint Tracker Route ── */}
        <Route
          path="/roadmap"
          element={
            <Suspense fallback={<SectionFallback />}>
              <div dir="ltr" className="font-body">
                <RoadmapPage />
              </div>
            </Suspense>
          }
        />

        {/* ── Tasks Module Route ── */}
        <Route
          path="/tasks"
          element={
            <Suspense fallback={<SectionFallback />}>
              <TasksPage />
            </Suspense>
          }
        />

        {/* ── Landing Page (default) ── */}
        <Route
          path="*"
          element={
            <div dir={dir} className={`min-h-screen bg-navy text-lightblue overflow-x-hidden ${fontClass}`}>
              <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
              <Hero lang={lang} />

              <Suspense fallback={<SectionFallback />}>
                <About lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Problems lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <TargetUsers lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Features lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <MobileApp lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Countdown lang={lang} />
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <Footer lang={lang} theme={theme} />
              </Suspense>
            </div>
          }
        />
      </Routes>
    </LazyMotion>
  );
}

export default App;
