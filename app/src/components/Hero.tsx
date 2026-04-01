import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { ArrowDown, CheckCircle } from 'lucide-react';
import type { Lang, I18n } from '../types';
import { fontSize, textColor, ctaPrimaryStyle, ctaSecondaryStyle } from '../design-tokens';

/* ── Typewriter ── */
function useTypeOnce(text: string, speed = 50, startDelay = 600) {
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCharIndex(0);
    setDone(false);
    const delayTimer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setCharIndex(i);
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
    }, startDelay);
    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed: text.slice(0, charIndex), done };
}

interface HeroContent {
  badge: string;
  titleStatic: string;
  highlightWord: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  trustSignups: string;
  trustFree: string;
}

const content: I18n<HeroContent> = {
  en: {
    badge: 'Launching June 12, 2026',
    titleStatic: 'Where Education Meets',
    highlightWord: 'Innovation',
    subtitle:
      'The all-in-one ecosystem that unites teachers, students, and parents — powered by AI insights, live progress tracking, and smart tools that transform how learning happens.',
    cta1: 'Join the Waitlist',
    cta2: 'Discover More',
    trustSignups: '60+ early signups',
    trustFree: 'Free for educators',
  },
  ar: {
    badge: 'الإطلاق في ١٢ يونيو 2026',
    titleStatic: 'حيث يلتقي التعليم',
    highlightWord: 'بالابتكار',
    subtitle:
      'المنظومة المتكاملة التي توحّد المعلمين والطلاب وأولياء الأمور — مدعومة برؤى الذكاء الاصطناعي، ومتابعة لحظية للتقدّم، وأدوات ذكية تُحدث نقلة نوعية في تجربة التعلّم.',
    cta1: 'انضم لقائمة الانتظار',
    cta2: 'اكتشف المزيد',
    trustSignups: 'أكثر من ٦٠+ مسجل مبكر',
    trustFree: 'مجاني للمعلمين',
  },
};

export default function Hero({ lang }: { lang: Lang }) {
  const t = content[lang];
  const { displayed, done } = useTypeOnce(t.highlightWord, lang === 'ar' ? 55 : 45, 800);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* BG — one subtle radial, no multiple orbs */}
      <div className="absolute inset-0 dark:block hidden bg-gradient-to-b from-navy via-[#081840] to-navy" />
      <div className="absolute inset-0 dark:hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(27,79,216,0.08),transparent)]" />
      <div className="absolute inset-0 dark:hidden bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(91,196,255,0.04),transparent)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] hidden dark:block bg-royal/6 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 w-full pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-royal/8 dark:bg-bright/8 border border-royal/15 dark:border-bright/15 text-xs font-semibold text-royal dark:text-sky tracking-wide shadow-sm shadow-royal/5 dark:shadow-bright/5">
              <span className="w-1.5 h-1.5 rounded-full bg-royal dark:bg-sky" />
              {t.badge}
            </span>
          </m.div>

          {/* Title */}
          <m.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`font-heading font-extrabold tracking-tight ${textColor.heading} leading-[1.08] ${
              lang === 'ar'
                ? fontSize.heroTitle.ar
                : fontSize.heroTitle.en
            }`}
          >
            <span className="block">{t.titleStatic}</span>
            <span className="block mt-1.5 md:mt-2.5">
              <span className="text-gradient inline-block min-w-[2ch]">{displayed}</span>
              {!done && (
                <span className="inline-block w-[2px] h-[0.72em] bg-royal dark:bg-sky/70 align-baseline ms-0.5 rounded-sm animate-[blink_1s_steps(2)_infinite]" />
              )}
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.5 }}
            className={`mt-4 md:mt-5 ${fontSize.bodyLg} ${textColor.muted} leading-[1.7] max-w-lg`}
          >
            {t.subtitle}
          </m.p>

          {/* CTAs */}
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mt-7 flex flex-col sm:flex-row gap-3 justify-center w-full sm:w-auto"
          >
            <a
              href="#countdown"
              className={ctaPrimaryStyle}
            >
              {t.cta1}
              <span className="text-white/60 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-150">→</span>
            </a>
            <a
              href="#about"
              className={ctaSecondaryStyle}
            >
              {t.cta2}
            </a>
          </m.div>

          {/* Trust — clean, minimal */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.85 }}
            className={`mt-8 flex items-center gap-4 ${fontSize.small} ${textColor.subtle}`}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-success/60" />
              {t.trustSignups}
            </span>
            <span className="w-px h-3 bg-border/60" />
            <span className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-success/60" />
              {t.trustFree}
            </span>
          </m.div>
        </div>
      </div>

      {/* Scroll hint */}
      <m.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity"
      >
        <m.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} className="text-muted" />
        </m.div>
      </m.a>
    </section>
  );
}
