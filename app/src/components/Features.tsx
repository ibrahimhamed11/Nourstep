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
    title: 'Everything You Need, Nothing You Don\'t',
    subtitle: 'Powerful, intuitive tools designed to transform how education works — for teachers, students, parents, and centers.',
    features: [
      {
        icon: Brain,
        title: 'AI Teacher Insights & Study Buddy',
        description: 'Smart AI analytics help teachers identify struggling students early, while a personal study assistant guides learners through challenges.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'Verified Teacher Profiles',
        description: 'Professional public profiles with verified badges, ratings, and portfolios — building instant trust and credibility with parents.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'Real-Time Parent Dashboards',
        description: 'Beautiful live dashboards where parents see attendance, grades, homework status, and learning trends at a glance — no more guessing.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'Course Management & Live Sessions',
        description: 'End-to-end course creation with integrated scheduling, live streaming, recordings, assignments, and automated grading.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'Gamified Student Progress',
        description: 'XP points, achievement badges, streaks, and competitive leaderboards that turn learning into an engaging, rewarding experience.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
    ],
  },
  ar: {
    badge: 'المميزات الأساسية',
    title: 'كل ما تحتاجه، بلا تعقيدات',
    subtitle: 'أدوات قوية وسهلة الاستخدام مصممة لتغيير طريقة عمل التعليم — للمعلمين والطلاب وأولياء الأمور والمراكز.',
    features: [
      {
        icon: Brain,
        title: 'رؤى ذكية ومساعد دراسي بالذكاء الاصطناعي',
        description: 'تحليلات ذكية تساعد المعلمين على اكتشاف الطلاب المتعثرين مبكرًا، بينما يرشد المساعد الدراسي الشخصي المتعلمين خلال التحديات.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'ملفات معلمين موثّقة ومعتمدة',
        description: 'ملفات شخصية احترافية مع شارات توثيق وتقييمات ومحفظة أعمال — تبني ثقة فورية مع أولياء الأمور.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'لوحات متابعة حية لأولياء الأمور',
        description: 'لوحات متابعة أنيقة تعرض الحضور والدرجات وحالة الواجبات واتجاهات التعلّم بنظرة واحدة — لا مزيد من التخمين.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'إدارة الدورات والحصص المباشرة',
        description: 'إنشاء دورات متكامل مع جدولة مدمجة وبث مباشر وتسجيلات وواجبات وتصحيح آلي.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'تقدّم الطلاب بطريقة ممتعة وتفاعلية',
        description: 'نقاط خبرة وشارات إنجاز وسلاسل نجاح ولوحات متصدرين تحوّل التعلّم إلى تجربة مشوّقة ومحفّزة.',
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-royal/10 dark:bg-bright/10 text-royal dark:text-bright border border-royal/20 dark:border-bright/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mt-4">
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
                className={`card-dark p-7 group relative overflow-hidden ${i === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Top gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                  i === 0 ? 'from-sky to-bright' :
                  i === 1 ? 'from-bright to-royal' :
                  i === 2 ? 'from-success to-sky' :
                  i === 3 ? 'from-warning to-error' :
                  'from-error to-bright'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={feature.iconColor} />
                </div>

                <h3 className="text-base font-bold text-heading mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
