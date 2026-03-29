import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import type { Lang, Theme } from './types';

// Lazy load below-the-fold sections
const About = lazy(() => import('./components/About'));
const Problems = lazy(() => import('./components/Problems'));
const TargetUsers = lazy(() => import('./components/TargetUsers'));
const Features = lazy(() => import('./components/Features'));
const MobileApp = lazy(() => import('./components/MobileApp'));
const Countdown = lazy(() => import('./components/Countdown'));
const Footer = lazy(() => import('./components/Footer'));

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
    <div dir={dir} className={`min-h-screen bg-navy text-lightblue overflow-x-hidden ${fontClass}`}>
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      <Hero lang={lang} />
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <About lang={lang} />
        <Problems lang={lang} />
        <TargetUsers lang={lang} />
        <Features lang={lang} />
        <MobileApp lang={lang} />
        <Countdown lang={lang} />
        <Footer lang={lang} theme={theme} />
      </Suspense>
    </div>
  );
}

export default App;
