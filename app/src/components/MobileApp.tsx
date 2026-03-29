import { motion } from 'framer-motion';
import { Smartphone, Bell, Zap, Shield, Globe, Fingerprint, CalendarClock } from 'lucide-react';
import type { Lang, I18n } from '../types';

interface AppFeature {
  icon: typeof Smartphone;
  text: string;
}

interface MobileAppContent {
  eyebrow: string;
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
    eyebrow: 'Mobile App',
    title: 'Your Classroom in',
    titleHighlight: 'Your Pocket',
    subtitle:
      'A beautifully crafted native app for iOS and Android that keeps everyone connected — anytime, anywhere.',
    iosLabel: 'App Store',
    androidLabel: 'Google Play',
    comingSoon: 'Coming Soon',
    features: [
      { icon: Bell, text: 'Push notifications for grades, homework & messages' },
      { icon: Zap, text: 'Fast performance with offline access' },
      { icon: Shield, text: 'End-to-end encryption' },
      { icon: Fingerprint, text: 'Biometric login support' },
      { icon: CalendarClock, text: 'Smart scheduling with reminders' },
      { icon: Globe, text: 'Full Arabic & English support' },
    ],
  },
  ar: {
    eyebrow: 'تطبيق الموبايل',
    title: 'فصلك الدراسي في',
    titleHighlight: 'جيبك',
    subtitle:
      'تطبيق أصلي أنيق لنظامي iOS و Android يُبقي الجميع على تواصل — في أي وقت ومن أي مكان.',
    iosLabel: 'App Store',
    androidLabel: 'Google Play',
    comingSoon: 'قريبًا',
    features: [
      { icon: Bell, text: 'إشعارات فورية للدرجات والواجبات' },
      { icon: Zap, text: 'أداء سريع مع وصول بدون إنترنت' },
      { icon: Shield, text: 'تشفير شامل للبيانات' },
      { icon: Fingerprint, text: 'تسجيل دخول بالبصمة' },
      { icon: CalendarClock, text: 'جدولة ذكية مع تذكيرات' },
      { icon: Globe, text: 'دعم كامل للعربية والإنجليزية' },
    ],
  },
};

/* Phone mockup — simplified */
function PhoneMockup() {
  return (
    <div className="relative w-[220px] h-[440px] mx-auto">
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-border/30 bg-gradient-to-b from-surface to-navy/30 dark:from-card-dark dark:to-navy shadow-xl shadow-royal/5 dark:shadow-black/20 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-surface dark:bg-darkblue rounded-b-xl" />

        {/* Screen */}
        <div className="absolute inset-[2px] rounded-[2.4rem] overflow-hidden bg-gradient-to-b from-royal/5 to-surface dark:from-royal/10 dark:to-navy">
          <div className="px-5 pt-10">
            {/* App icon */}
            <div className="w-10 h-10 rounded-xl bg-royal mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">خ</span>
            </div>
            <div className="text-center text-[10px] font-semibold text-heading/60 mb-4">خطوة للنور</div>

            {/* Skeleton cards */}
            <div className="space-y-2.5">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-3 rounded-xl bg-navy/20 dark:bg-white/[0.03] border border-border/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-md bg-royal/10" />
                    <div className="h-1.5 w-14 bg-heading/10 rounded-full" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-heading/5 rounded-full" />
                    <div className="h-1.5 w-3/5 bg-heading/5 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tab bar */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-around py-2.5 bg-navy/10 dark:bg-white/[0.03] rounded-xl border border-border/10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-4 h-4 rounded ${i === 0 ? 'bg-royal/30' : 'bg-heading/8'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Store icon SVGs */
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.395 13l2.302-2.492zM5.864 2.658L16.8 9.001l-2.302 2.302L5.864 2.658z" />
    </svg>
  );
}

export default function MobileApp({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="mobile-app" className="relative py-20 md:py-28 px-6 bg-surface dark:bg-navy overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="order-2 lg:order-1"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-royal dark:text-bright/60 mb-3">
              {t.eyebrow}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-heading mb-3">
              {t.title}{' '}
              <span className="text-gradient">{t.titleHighlight}</span>
            </h2>
            <p className="text-[15px] text-muted leading-[1.7] mb-8 max-w-md">{t.subtitle}</p>

            {/* Feature checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {t.features.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.3 }}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-royal/[0.03] dark:hover:bg-bright/[0.03] transition-colors"
                  >
                    <Icon size={14} className="text-royal/50 dark:text-bright/40 shrink-0" />
                    <span className="text-[13px] text-muted">{feat.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                disabled
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-heading/90 dark:bg-white/90 text-white dark:text-navy text-sm font-semibold opacity-80 cursor-not-allowed"
              >
                <AppleIcon />
                <div className="text-start leading-tight">
                  <div className="text-[9px] font-medium opacity-50 uppercase">{t.comingSoon}</div>
                  <div className="text-sm font-bold -mt-0.5">{t.iosLabel}</div>
                </div>
              </button>
              <button
                disabled
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-royal text-white text-sm font-semibold opacity-80 cursor-not-allowed"
              >
                <PlayStoreIcon />
                <div className="text-start leading-tight">
                  <div className="text-[9px] font-medium opacity-50 uppercase">{t.comingSoon}</div>
                  <div className="text-sm font-bold -mt-0.5">{t.androidLabel}</div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
