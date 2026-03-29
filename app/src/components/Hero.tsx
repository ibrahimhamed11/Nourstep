import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle, GraduationCap, BookOpen, Users, School, Sparkles } from 'lucide-react';
import type { Lang, I18n } from '../types';

/* ─────────────────── Typewriter — types once then stops ─────────────────── */
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
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed: text.slice(0, charIndex), done };
}

/* ─────────────────── Content ─────────────────── */
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

/* ─────────────────── Animation Variants ─────────────────── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' as const },
  },
});

/* ─────────────────── Component ─────────────────── */
export default function Hero({ lang }: { lang: Lang }) {
  const t = content[lang];
  const { displayed, done } = useTypeOnce(t.highlightWord, lang === 'ar' ? 55 : 45, 800);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-navy via-darkblue to-navy" />
      <div className="absolute inset-0 dark:hidden bg-gradient-to-b from-royal/[0.03] via-transparent to-sky/[0.03]" />

      {/* Glowing orbs — dark only */}
      <div className="absolute top-20 right-[10%] w-72 h-72 hidden dark:block bg-royal/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 hidden dark:block bg-bright/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] hidden dark:block bg-darkblue/40 rounded-full blur-3xl" />

      {/* Dot patterns */}
      <div
        className="absolute inset-0 hidden dark:block opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #3D8BFF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute inset-0 dark:hidden opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #1B4FD8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 w-full py-32 md:py-40">
        <div className="flex flex-col items-center text-center gap-0">

          {/* Badge */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="visible"
            className="mb-10 md:mb-12"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-royal/10 dark:bg-royal/15 border border-royal/20 dark:border-bright/20 text-sm font-semibold text-royal dark:text-sky backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-royal dark:bg-sky" />
              </span>
              {t.badge}
            </span>
          </motion.div>

          {/* Title with typewriter */}
          <motion.h1
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="visible"
            className={`font-heading font-extrabold tracking-tight text-heading leading-[1.12] ${
              lang === 'ar'
                ? 'text-[2.5rem] md:text-5xl xl:text-6xl'
                : 'text-[2.75rem] sm:text-5xl md:text-6xl xl:text-7xl'
            }`}
          >
            <span className="block">{t.titleStatic}</span>
            <span className="block mt-3 md:mt-5">
              <span className="text-gradient inline-block min-w-[3ch]">
                {displayed}
              </span>
              {!done && (
                <span className="inline-block w-[3px] h-[0.8em] bg-bright dark:bg-sky align-baseline ms-1 rounded-sm animate-[blink_1s_steps(2)_infinite]" />
              )}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp(0.35)}
            initial="hidden"
            animate="visible"
            className="mt-8 md:mt-10 text-base sm:text-lg md:text-xl text-muted leading-relaxed md:leading-[1.85] max-w-2xl"
          >
            {t.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp(0.55)}
            initial="hidden"
            animate="visible"
            className="mt-12 md:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center w-full sm:w-auto"
          >
            <a
              href="#countdown"
              className="group relative inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-royal to-bright hover:from-bright hover:to-sky shadow-lg shadow-royal/25 hover:shadow-bright/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">{t.cta1}</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                →
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-bright to-sky opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#about"
              className="group inline-flex items-center justify-center gap-2 px-9 py-4 rounded-2xl font-semibold text-lightblue bg-card-dark border border-border hover:border-bright/40 hover:bg-darkblue hover:text-heading transition-all duration-300"
            >
              {t.cta2}
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp(0.75)}
            initial="hidden"
            animate="visible"
            className="mt-14 md:mt-16 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-center"
          >
            {/* Signups */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {(
                  [
                    { Icon: GraduationCap, color: 'text-bright' },
                    { Icon: BookOpen, color: 'text-sky' },
                    { Icon: Users, color: 'text-success' },
                    { Icon: School, color: 'text-warning' },
                  ] as const
                ).map(({ Icon, color }, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-card-dark border-2 border-navy flex items-center justify-center shadow-sm"
                  >
                    <Icon size={14} className={color} />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted font-medium">{t.trustSignups}</p>
            </div>

            <div className="hidden sm:block w-px h-5 bg-border" />

            {/* Free */}
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-success" />
              <p className="text-sm text-muted font-medium">{t.trustFree}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="block text-muted/50 hover:text-muted transition-colors"
        >
          <ArrowDown size={20} />
        </motion.a>
      </motion.div>
    </section>
  );
}
