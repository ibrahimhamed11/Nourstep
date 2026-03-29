import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Problems from './components/Problems';
import TargetUsers from './components/TargetUsers';
import Features from './components/Features';
import Countdown from './components/Countdown';
import Footer from './components/Footer';
import type { Lang } from './types';

export type { Lang };

function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? 'font-arabic' : 'font-body';

  return (
    <div dir={dir} className={`min-h-screen bg-navy text-lightblue overflow-x-hidden ${fontClass}`}>
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Problems lang={lang} />
      <TargetUsers lang={lang} />
      <Features lang={lang} />
      <Countdown lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}

export default App;
