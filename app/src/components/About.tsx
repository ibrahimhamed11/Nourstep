import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Users, BookOpen, GraduationCap, BarChart3 } from 'lucide-react';
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
    badge: 'عن نور ستيب',
    title: 'تمكين منظومة التعليم بالكامل',
    description:
      'نور ستيب ليست مجرد منصة — إنها حركة تعليمية. نُمكّن المعلمين والمراكز التعليمية من الوصول إلى تحليلات ذكية، ومتابعة تقدّم الطلاب في الوقت الفعلي، وأدوات فعّالة لتطوير الدورات وبناء سمعة مهنية قوية وتحقيق أثر تعليمي دائم.',
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

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="relative max-w-sm mx-auto">
              <div className="absolute -inset-4 hidden dark:block bg-gradient-to-br from-royal/30 to-bright/20 rounded-3xl blur-xl" />
              <div className="absolute -inset-4 dark:hidden bg-gradient-to-br from-royal/10 to-bright/10 rounded-3xl blur-xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-border p-10 bg-gradient-to-br from-[#0C1A4A] to-[#081338] dark:from-card-dark dark:to-[#0A1440] dark:shadow-black/30 shadow-royal/10">
                {/* Icon grid instead of logo */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { Icon: GraduationCap, color: 'from-bright to-sky', label: lang === 'ar' ? 'تعليم' : 'Learn' },
                    { Icon: BarChart3, color: 'from-sky to-success', label: lang === 'ar' ? 'تحليل' : 'Analyze' },
                    { Icon: Users, color: 'from-success to-warning', label: lang === 'ar' ? 'تواصل' : 'Connect' },
                    { Icon: BookOpen, color: 'from-warning to-bright', label: lang === 'ar' ? 'نمو' : 'Grow' },
                  ].map(({ Icon, color, label }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 * i, duration: 0.4 }}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon size={22} className="text-white" />
                      </div>
                      <span className="text-xs font-semibold text-sky/80">{label}</span>
                    </motion.div>
                  ))}
                </div>
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
            <p className="text-lg md:text-xl text-muted leading-relaxed mb-10 max-w-lg">
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
