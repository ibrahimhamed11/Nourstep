import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

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
    <section id="about" className="relative py-20 md:py-28 px-6 bg-surface dark:bg-darkblue">
      <div className="max-w-5xl mx-auto">
        {/* Two-column: text left, stats right — not centered everything */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Text — takes more space */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-3"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-royal dark:text-sky/70 mb-3">
              {lang === 'ar' ? 'عن خطوة للنور' : 'About NourStep'}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-heading leading-snug">
              {t.title}
            </h2>
            <p className="mt-5 text-[15px] text-muted leading-[1.75] max-w-xl">
              {t.description}
            </p>
          </motion.div>

          {/* Stats — vertical stack on the side */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {t.stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: lang === 'ar' ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.35 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-navy/50 dark:bg-navy/40 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-royal/8 dark:bg-bright/8 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-royal dark:text-bright" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
