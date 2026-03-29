import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

interface StatItem { icon: LucideIcon; value: string; label: string }

interface AboutContent {
  badge: string;
  title: string;
  description: string;
  stats: StatItem[];
}

const content: I18n<AboutContent> = {
  en: {
    badge: 'About NourStep',
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
    badge: 'عن خطوة للنور',
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
    <section id="about" className="relative py-24 md:py-32 px-4 bg-darkblue">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-royal/10 dark:bg-bright/10 text-royal dark:text-sky border border-royal/20 dark:border-bright/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mt-4">
            {t.title}
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-12 text-center max-w-2xl mx-auto">
              {t.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {t.stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="card-dark p-5 text-center group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-bright/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={20} className="text-bright" />
                    </div>
                    <p className="text-base font-bold text-heading">{stat.value}</p>
                    <p className="text-xs text-muted mt-0.5">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
