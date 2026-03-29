import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Problems from './components/Problems';
import TargetUsers from './components/TargetUsers';
import Features from './components/Features';
import MobileApp from './components/MobileApp';
import Countdown from './components/Countdown';
import Footer from './components/Footer';
import type { Lang, Theme } from './types';

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
      <About lang={lang} />
      <Problems lang={lang} />
      <TargetUsers lang={lang} />
      <Features lang={lang} />
      <MobileApp lang={lang} />
      <Countdown lang={lang} />
      <Footer lang={lang} theme={theme} />
    </div>
  );
}

export default App;
