import { motion } from 'framer-motion';
import { Smartphone, Bell, Zap, Shield, Globe, Fingerprint, CalendarClock } from 'lucide-react';
import type { Lang, I18n } from '../types';

interface AppFeature {
  icon: typeof Smartphone;
  text: string;
}

interface MobileAppContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  iosLabel: string;
  androidLabel: string;
  comingSoon: string;
  features: AppFeature[];
}

const content: I18n<MobileAppContent> = {
  en: {
    badge: 'Mobile Experience',
    title: 'Your Classroom in',
    titleHighlight: 'Your Pocket',
    subtitle:
      'خطوة للنور is built mobile-first. A beautifully crafted native app for iOS and Android that keeps teachers, students, and parents connected — anytime, anywhere.',
    iosLabel: 'App Store',
    androidLabel: 'Google Play',
    comingSoon: 'Coming Soon',
    features: [
      { icon: Bell, text: 'Instant push notifications for grades, homework & messages' },
      { icon: Zap, text: 'Lightning-fast performance with offline access to lessons' },
      { icon: Shield, text: 'End-to-end encryption & secure data storage' },
      { icon: Fingerprint, text: 'Biometric login — Face ID & fingerprint support' },
      { icon: CalendarClock, text: 'Smart scheduling with automatic reminders for classes, exams & deadlines' },
      { icon: Globe, text: 'Full Arabic & English support with RTL interface' },
    ],
  },
  ar: {
    badge: 'تجربة الموبايل',
    title: 'فصلك الدراسي في',
    titleHighlight: 'جيبك',
    subtitle:
      'خطوة للنور مبنية للموبايل أولاً. تطبيق أصلي أنيق لنظامي iOS و Android يُبقي المعلمين والطلاب وأولياء الأمور على تواصل — في أي وقت ومن أي مكان.',
    iosLabel: 'App Store',
    androidLabel: 'Google Play',
    comingSoon: 'قريبًا',
    features: [
      { icon: Bell, text: 'إشعارات فورية للدرجات والواجبات والرسائل' },
      { icon: Zap, text: 'أداء فائق السرعة مع وصول للدروس بدون إنترنت' },
      { icon: Shield, text: 'تشفير شامل وتخزين بيانات آمن' },
      { icon: Fingerprint, text: 'تسجيل دخول بالبصمة — دعم Face ID وبصمة الإصبع' },
      { icon: CalendarClock, text: 'جدولة ذكية مع تذكيرات تلقائية للحصص والاختبارات والمواعيد النهائية' },
      { icon: Globe, text: 'دعم كامل للعربية والإنجليزية مع واجهة RTL' },
    ],
  },
};

/* ── Apple & Google Play SVG icons ── */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.395 13l2.302-2.492zM5.864 2.658L16.8 9.001l-2.302 2.302L5.864 2.658z" />
    </svg>
  );
}

/* ── Phone mockup ── */
function PhoneMockup() {
  return (
    <div className="relative w-[260px] h-[520px] mx-auto">
      {/* Phone frame */}
      <div className="absolute inset-0 rounded-[3rem] border-[3px] border-royal/20 dark:border-border/40 bg-gradient-to-b from-white to-slate-50 dark:from-card-dark dark:to-navy shadow-2xl shadow-royal/15 dark:shadow-royal/10 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-100 dark:bg-darkblue rounded-b-2xl z-10" />

        {/* Screen content */}
        <div className="absolute inset-[3px] rounded-[2.7rem] overflow-hidden bg-gradient-to-b from-royal/10 via-white to-slate-50 dark:from-royal/20 dark:via-navy dark:to-darkblue">
          {/* Status bar */}
          <div className="flex justify-between items-center px-8 pt-10 pb-2">
            <div className="w-6 h-1 bg-royal/20 dark:bg-white/30 rounded-full" />
            <div className="flex gap-1">
              <div className="w-3 h-1 bg-royal/20 dark:bg-white/30 rounded-full" />
              <div className="w-3 h-1 bg-royal/20 dark:bg-white/30 rounded-full" />
              <div className="w-3 h-1 bg-royal/20 dark:bg-white/30 rounded-full" />
            </div>
          </div>

          {/* App header */}
          <div className="px-6 pt-4 pb-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-royal to-bright mx-auto mb-3 flex items-center justify-center shadow-lg shadow-royal/20">
              <span className="text-white font-extrabold text-lg">خ</span>
            </div>
            <div className="text-royal dark:text-white/90 text-[11px] font-bold">خطوة للنور</div>
          </div>

          {/* Mock cards */}
          <div className="px-4 space-y-2.5 mt-2">
            <div className="bg-royal/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-royal/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-sky/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded bg-sky/60" />
                </div>
                <div className="h-2 w-16 bg-royal/15 dark:bg-white/20 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-royal/8 dark:bg-white/10 rounded-full" />
                <div className="h-1.5 w-3/4 bg-royal/8 dark:bg-white/10 rounded-full" />
              </div>
            </div>

            <div className="bg-royal/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-royal/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded bg-success/60" />
                </div>
                <div className="h-2 w-20 bg-royal/15 dark:bg-white/20 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 bg-success/15 dark:bg-success/10 rounded-xl" />
                <div className="h-8 flex-1 bg-bright/15 dark:bg-bright/10 rounded-xl" />
                <div className="h-8 flex-1 bg-warning/15 dark:bg-warning/10 rounded-xl" />
              </div>
            </div>

            <div className="bg-royal/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-royal/10 dark:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-warning/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded bg-warning/60" />
                </div>
                <div className="h-2 w-14 bg-royal/15 dark:bg-white/20 rounded-full" />
              </div>
              <div className="h-1.5 bg-bright/40 dark:bg-bright/30 rounded-full w-2/3" />
            </div>
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-around items-center bg-royal/5 dark:bg-white/5 backdrop-blur rounded-2xl py-3 border border-royal/10 dark:border-white/10">
            <div className="w-5 h-5 rounded bg-bright/50 dark:bg-bright/40" />
            <div className="w-5 h-5 rounded bg-royal/15 dark:bg-white/20" />
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-royal to-bright shadow-md shadow-royal/30" />
            <div className="w-5 h-5 rounded bg-royal/15 dark:bg-white/20" />
            <div className="w-5 h-5 rounded bg-royal/15 dark:bg-white/20" />
          </div>
        </div>
      </div>

      {/* Glow behind phone */}
      <div className="absolute -inset-8 bg-gradient-to-b from-royal/10 via-bright/5 to-sky/3 dark:from-royal/20 dark:via-bright/10 dark:to-sky/5 rounded-full blur-3xl -z-10" />
    </div>
  );
}

export default function MobileApp({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="mobile-app" className="relative py-24 md:py-32 px-4 bg-surface dark:bg-navy overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-bright/5 dark:bg-bright/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-royal/5 dark:bg-royal/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-royal/10 dark:bg-bright/10 text-royal dark:text-bright border border-royal/20 dark:border-bright/20 mb-6">
              <Smartphone size={14} />
              {t.badge}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mb-4">
              {t.title}{' '}
              <span className="text-gradient">{t.titleHighlight}</span>
            </h2>

            <p className="text-muted text-lg leading-relaxed mb-10 max-w-lg">
              {t.subtitle}
            </p>

            {/* Feature list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {t.features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.35 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-royal/5 dark:hover:bg-card-dark/50 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-royal/8 dark:bg-bright/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-royal dark:text-bright" />
                    </div>
                    <span className="text-sm text-muted leading-relaxed">{feat.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Store buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {/* iOS Button */}
              <div className="relative group">
                <button
                  disabled
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-heading dark:bg-white text-white dark:text-navy font-bold text-sm border-2 border-heading/80 dark:border-white/80 opacity-90 cursor-not-allowed transition-all duration-300"
                >
                  <AppleIcon className="opacity-80" />
                  <div className="text-start leading-tight">
                    <div className="text-[10px] font-medium opacity-60 uppercase tracking-wide">
                      {t.comingSoon}
                    </div>
                    <div className="text-sm font-bold -mt-0.5">{t.iosLabel}</div>
                  </div>
                </button>
              </div>

              {/* Android Button */}
              <div className="relative group">
                <button
                  disabled
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-royal to-bright text-white font-bold text-sm border-2 border-bright/30 opacity-90 cursor-not-allowed transition-all duration-300"
                >
                  <PlayStoreIcon className="opacity-90" />
                  <div className="text-start leading-tight">
                    <div className="text-[10px] font-medium opacity-70 uppercase tracking-wide">
                      {t.comingSoon}
                    </div>
                    <div className="text-sm font-bold -mt-0.5">{t.androidLabel}</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
