import { motion } from 'framer-motion';
import { Brain, BadgeCheck, BarChart3, BookOpenCheck, Gamepad2 } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

interface FeaturesContent {
  badge: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

const content: I18n<FeaturesContent> = {
  en: {
    badge: 'Key Features',
    title: 'Everything You Need',
    subtitle: 'Powerful tools designed to transform education.',
    features: [
      {
        icon: Brain,
        title: 'AI Teacher Insights & Study Buddy',
        description: 'Smart AI-powered analytics for teachers and a personal study assistant for students.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'Verified Teacher Profiles',
        description: 'Public teacher profiles with verified badges to build trust and credibility.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'Real-Time Parent Dashboards',
        description: 'Live dashboards for parents to monitor attendance, grades, and progress.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'Course Management & Live Sessions',
        description: 'Complete course creation tools with integrated live streaming and scheduling.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'Gamified Student Progress',
        description: 'Points, badges, and leaderboards to keep students motivated and engaged.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
    ],
  },
  ar: {
    badge: 'المميزات الأساسية',
    title: 'كل ما تحتاجه',
    subtitle: 'أدوات قوية مصممة لتحويل التعليم.',
    features: [
      {
        icon: Brain,
        title: 'رؤى ذكية ومساعد دراسي بالذكاء الاصطناعي',
        description: 'تحليلات ذكية مدعومة بالذكاء الاصطناعي للمعلمين ومساعد دراسي شخصي للطلاب.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'ملفات معلمين موثقة',
        description: 'ملفات شخصية عامة للمعلمين مع شارة التحقق لبناء الثقة والمصداقية.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'لوحات متابعة أولياء الأمور',
        description: 'لوحات متابعة في الوقت الفعلي لأولياء الأمور لمراقبة الحضور والدرجات والتقدم.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'إدارة الدورات والحصص المباشرة',
        description: 'أدوات إنشاء دورات متكاملة مع بث مباشر وجدولة مواعيد.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'تقدم الطلاب بطريقة ممتعة',
        description: 'نقاط وشارات ولوحات المتصدرين لتحفيز الطلاب وزيادة تفاعلهم.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
    ],
  },
};

export default function Features({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="features" className="relative py-24 md:py-32 px-4 bg-navy">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bright/15 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-bright/10 text-bright border border-bright/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4">
            {t.title}
          </h2>
          <p className="text-muted text-lg mt-4 max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {t.features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`card-dark p-7 group ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={feature.iconColor} />
                </div>

                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
