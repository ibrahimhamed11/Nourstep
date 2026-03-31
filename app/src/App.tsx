import { useState, useEffect, lazy, Suspense } from 'react';
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

/** Minimal placeholder for lazy sections */
const SectionFallback = () => <div className="min-h-[40vh]" />;

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
      <div dir={dir} className={`min-h-screen bg-navy text-lightblue overflow-x-hidden ${fontClass}`}>
        <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
        <Hero lang={lang} />

        {/* Split Suspense boundaries so visible sections load independently */}
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
    </LazyMotion>
  );
}

export default App;
