import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import type { Lang, I18n } from '../types';

interface HeroContent {
  badge: string;
  title1: string;
  titleHighlight: string;
  title2: string;
  subtitle: string;
  cta1: string;
  cta2: string;
}

const content: I18n<HeroContent> = {
  en: {
    badge: '🚀 Launching June 12, 2026',
    title1: 'Step Into',
    titleHighlight: 'Smarter',
    title2: 'Learning',
    subtitle: 'Connect teachers, students, and parents in one seamless ecosystem. The all-in-one education platform built for the future.',
    cta1: 'Get Early Access',
    cta2: 'Learn More',
  },
  ar: {
    badge: '🚀 الإطلاق في 12 يونيو 2026',
    title1: 'خطوة نحو',
    titleHighlight: 'تعليم',
    title2: 'أذكى',
    subtitle: 'ربط المعلمين والطلاب وأولياء الأمور في نظام واحد سلس وسهل الاستخدام. المنصة التعليمية الشاملة المبنية للمستقبل.',
    cta1: 'سجّل مبكراً',
    cta2: 'اعرف المزيد',
  },
};

export default function Hero({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-darkblue to-navy" />

      {/* Glowing orbs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-royal/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-bright/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-darkblue/40 rounded-full blur-3xl" />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, #3D8BFF 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-start max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal/15 border border-bright/20 text-sm font-medium text-sky mb-8"
            >
              <Sparkles size={14} className="text-sky" />
              {t.badge}
            </motion.div>

            <h1 className={`font-heading font-extrabold leading-[1.1] tracking-tight text-white ${
              lang === 'ar' ? 'text-4xl md:text-5xl xl:text-6xl' : 'text-5xl md:text-6xl xl:text-7xl'
            }`}>
              {t.title1}{' '}
              <span className="text-gradient">{t.titleHighlight}</span>
              <br />
              {t.title2}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-lightblue/70 leading-relaxed max-w-lg">
              {t.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#countdown"
                className="px-8 py-4 rounded-2xl font-semibold text-white bg-royal hover:bg-bright transition-all duration-300 shadow-lg shadow-royal/30 hover:shadow-bright/30 hover:-translate-y-0.5 text-center"
              >
                {t.cta1}
              </a>
              <a
                href="#about"
                className="px-8 py-4 rounded-2xl font-semibold text-lightblue bg-card-dark border border-bright/15 hover:border-bright/30 hover:bg-darkblue transition-all duration-300 text-center"
              >
                {t.cta2}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {['🧑‍🏫', '👩‍🎓', '👨‍👩‍👧', '🏫'].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-card-dark border-2 border-navy flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                {lang === 'ar' ? 'أكثر من 1000+ مسجل مبكر' : '1000+ early signups'}
              </p>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="flex-1 flex justify-center items-center"
          >
            <div className="relative">
              {/* Glow behind logo */}
              <div className="absolute -inset-8 bg-gradient-to-br from-royal/30 to-bright/20 rounded-[2rem] blur-2xl" />

              <div className="relative bg-card-dark rounded-[2rem] p-6 shadow-2xl shadow-black/30 border border-bright/15 animate-pulse-glow">
                <img
                  src="/logo_no_bg.png"
                  alt="NourStep Platform"
                  className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain animate-float"
                />
              </div>

              {/* Floating badge cards */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 lg:-right-12 bg-card-dark rounded-2xl shadow-lg shadow-black/30 border border-bright/15 px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-success/15 flex items-center justify-center text-success text-sm">✓</div>
                <div>
                  <p className="text-xs font-bold text-white">{lang === 'ar' ? 'تتبع لحظي' : 'Real-Time'}</p>
                  <p className="text-[10px] text-muted">{lang === 'ar' ? 'متابعة مباشرة' : 'Live Tracking'}</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 lg:-left-12 bg-card-dark rounded-2xl shadow-lg shadow-black/30 border border-bright/15 px-4 py-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-sky/15 flex items-center justify-center text-sky text-sm">🤖</div>
                <div>
                  <p className="text-xs font-bold text-white">{lang === 'ar' ? 'ذكاء اصطناعي' : 'AI Powered'}</p>
                  <p className="text-[10px] text-muted">{lang === 'ar' ? 'مساعد ذكي' : 'Smart Assistant'}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="block"
        >
          <ArrowDown size={22} className="text-muted" />
        </motion.a>
      </motion.div>
    </section>
  );
}
