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
    title: 'Empowering Education Ecosystem',
    description:
      'NourStep empowers teachers and learning centers with smart insights, real-time student tracking, and tools to grow courses and reputation.',
    stats: [
      { icon: Users, value: 'All-in-One', label: 'Unified Platform' },
      { icon: TrendingUp, value: 'Real-Time', label: 'Progress Tracking' },
      { icon: Lightbulb, value: 'AI-Powered', label: 'Smart Insights' },
    ],
  },
  ar: {
    badge: 'عن نور ستيب',
    title: 'تمكين منظومة التعليم',
    description:
      'تُمكّن نور ستيب المعلمين والمراكز التعليمية من الوصول إلى رؤى ذكية، متابعة تقدم الطلاب مباشرة، وأدوات لتنمية الدورات التعليمية وبناء سمعة قوية.',
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bright/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-bright/10 text-sky border border-bright/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4">
            {t.title}
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="relative max-w-sm mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-br from-royal/30 to-bright/20 rounded-3xl blur-xl" />
              <div className="relative bg-card-dark rounded-3xl overflow-hidden shadow-xl shadow-black/30 border border-bright/15 p-8">
                <img
                  src="/logo_no_bg.png"
                  alt="NourStep App"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <p className="text-lg md:text-xl text-lightblue/70 leading-relaxed mb-10">
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
                    className="card-dark p-5 text-center"
                  >
                    <div className="w-11 h-11 rounded-xl bg-bright/10 flex items-center justify-center mx-auto mb-3">
                      <Icon size={20} className="text-bright" />
                    </div>
                    <p className="text-base font-bold text-white">{stat.value}</p>
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
