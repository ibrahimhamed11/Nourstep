import { m } from 'framer-motion';
import { Lightbulb, TrendingUp, Users } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';
import { fontSize, textColor, spacing, eyebrowStyle, sectionHeadingStyle } from '../design-tokens';

interface StatItem { icon: LucideIcon; value: string; label: string }

interface AboutContent {
  title: string;
  description: string;
  stats: StatItem[];
}

const content: I18n<AboutContent> = {
  en: {
    title: 'Empowering the Education Ecosystem',
    description:
      'NourStep is more than a platform — it\'s a movement. We empower teachers and learning centers with intelligent analytics, real-time student progress tracking, and powerful tools to scale courses, strengthen reputations, and create lasting educational impact.',
    stats: [
      { icon: Users, value: 'All-in-One', label: 'Unified Platform' },
      { icon: TrendingUp, value: 'Real-Time', label: 'Progress Tracking' },
      { icon: Lightbulb, value: 'AI-Powered', label: 'Smart Insights' },
    ],
  },
  ar: {
    title: 'تمكين منظومة التعليم بالكامل',
    description:
      'خطوة للنور ليست مجرد منصة — إنها حركة تعليمية. نُمكّن المعلمين والمراكز التعليمية من الوصول إلى تحليلات ذكية، ومتابعة تقدّم الطلاب في الوقت الفعلي، وأدوات فعّالة لتطوير الدورات وبناء سمعة مهنية قوية وتحقيق أثر تعليمي دائم.',
    stats: [
      { icon: Users, value: 'منصة موحدة', label: 'الكل في مكان واحد' },
      { icon: TrendingUp, value: 'تتبع لحظي', label: 'متابعة التقدم' },
      { icon: Lightbulb, value: 'ذكاء اصطناعي', label: 'رؤى ذكية' },
    ],
  },
};

export default function About({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="about" className={`relative ${spacing.sectionY} ${spacing.sectionX} bg-surface dark:bg-darkblue`}>
      <div className={spacing.maxWidth}>
        {/* Two-column: text left, stats right — not centered everything */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">

          {/* Text — takes more space */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-3"
          >
            <p className={`${eyebrowStyle} ${textColor.eyebrow}`}>
              {lang === 'ar' ? 'عن خطوة للنور' : 'About NourStep'}
            </p>
            <h2 className={`${sectionHeadingStyle} leading-snug`}>
              {t.title}
            </h2>
            <p className={`mt-4 ${fontSize.body} ${textColor.muted} leading-[1.75] max-w-xl`}>
              {t.description}
            </p>
          </m.div>

          {/* Stats — vertical stack on the side */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {t.stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <m.div
                  key={i}
                  initial={{ opacity: 0, x: lang === 'ar' ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.35 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy/50 dark:bg-navy/40 border border-border/50 hover:border-royal/20 dark:hover:border-bright/20 hover:bg-navy/70 dark:hover:bg-navy/60 transition-all duration-300 hover:shadow-md hover:shadow-royal/5"
                >
                  <div className="w-10 h-10 rounded-lg bg-royal/8 dark:bg-bright/8 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-royal dark:text-bright" />
                  </div>
                  <div>
                    <p className={`${fontSize.statValue} ${textColor.heading} leading-tight`}>{stat.value}</p>
                    <p className={`${fontSize.statLabel} ${textColor.muted} mt-0.5`}>{stat.label}</p>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
