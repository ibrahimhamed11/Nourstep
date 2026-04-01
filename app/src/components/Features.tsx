import { m } from 'framer-motion';
import { Brain, BadgeCheck, BarChart3, BookOpenCheck, Gamepad2, MessageCircle } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';
import { fontSize, textColor, spacing, eyebrowStyle, sectionHeadingStyle, cardTitleStyle, cardDescStyle } from '../design-tokens';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

const content: I18n<FeaturesContent> = {
  en: {
    eyebrow: 'Features',
    title: 'Everything You Need, Nothing You Don\'t',
    subtitle: 'Powerful tools designed to transform how education works.',
    features: [
      {
        icon: Brain,
        title: 'AI Insights & Study Buddy',
        description: 'Smart analytics help teachers spot struggling students early. Every learner gets a personal AI assistant that adapts to their pace.',
      },
      {
        icon: BadgeCheck,
        title: 'Verified Teacher Profiles',
        description: 'Professional profiles with verified badges, ratings, and specializations. Parents browse qualifications and pick the right teacher.',
      },
      {
        icon: BarChart3,
        title: 'Real-Time Parent Dashboards',
        description: 'Live dashboards showing attendance, grade trends, homework status, and learning trajectory — all updated instantly.',
      },
      {
        icon: BookOpenCheck,
        title: 'Course Management & Live Classes',
        description: 'Build curricula, schedule sessions, stream live, auto-record, assign homework, and grade quizzes — all in one place.',
      },
      {
        icon: Gamepad2,
        title: 'Gamified Progress',
        description: 'XP points, achievement badges, daily streaks, and leaderboards keep students motivated while building study habits.',
      },
      {
        icon: MessageCircle,
        title: 'Smart Communication',
        description: 'Unified messaging connecting teachers, parents, and students. Announcements, reports, meetings — no scattered WhatsApp groups.',
      },
    ],
  },
  ar: {
    eyebrow: 'المميزات',
    title: 'كل ما تحتاجه، بلا تعقيدات',
    subtitle: 'أدوات قوية مصممة لتغيير طريقة عمل التعليم.',
    features: [
      {
        icon: Brain,
        title: 'رؤى ذكية ومساعد دراسي AI',
        description: 'تحليلات ذكية تساعد المعلمين على اكتشاف الطلاب المتعثرين. كل متعلّم يحصل على مساعد شخصي يتكيّف مع مستواه.',
      },
      {
        icon: BadgeCheck,
        title: 'ملفات معلمين موثّقة',
        description: 'ملفات احترافية بشارات توثيق وتقييمات. أولياء الأمور يتصفّحون المؤهلات ويختارون المعلم المناسب.',
      },
      {
        icon: BarChart3,
        title: 'لوحات متابعة حية للأهالي',
        description: 'لوحات تعرض الحضور واتجاهات الدرجات وحالة الواجبات ومسار التعلّم — كلها مُحدّثة لحظيًا.',
      },
      {
        icon: BookOpenCheck,
        title: 'إدارة دورات وحصص مباشرة',
        description: 'بناء مناهج، جدولة حصص، بث مباشر، تسجيل تلقائي، واجبات، وتصحيح آلي — كل شيء في مكان واحد.',
      },
      {
        icon: Gamepad2,
        title: 'تقدّم تفاعلي وممتع',
        description: 'نقاط خبرة وشارات إنجاز وسلاسل نجاح ولوحات متصدرين تبقي الطلاب متحمسين.',
      },
      {
        icon: MessageCircle,
        title: 'تواصل ذكي وموحّد',
        description: 'مركز رسائل يربط المعلمين والأهالي والطلاب. إعلانات وتقارير واجتماعات — بلا مجموعات واتساب متناثرة.',
      },
    ],
  },
};

export default function Features({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="features" className={`relative ${spacing.sectionY} ${spacing.sectionX} bg-navy`}>
      <div className={spacing.maxWidth}>
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className={spacing.sectionGap}
        >
          <p className={`${eyebrowStyle} ${textColor.eyebrowSoft}`}>
            {t.eyebrow}
          </p>
          <h2 className={sectionHeadingStyle}>
            {t.title}
          </h2>
          <p className={`${fontSize.body} ${textColor.muted} mt-3 max-w-md`}>{t.subtitle}</p>
        </m.div>

        {/* 3-column grid — clean cards, no gradient accent lines */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.gridGap}`}>
          {t.features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="group p-5 rounded-xl bg-surface/50 dark:bg-card-dark/60 border border-border/40 hover:border-royal/20 dark:hover:border-bright/20 hover:shadow-lg hover:shadow-royal/5 dark:hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-royal/8 dark:bg-bright/8 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={18} className="text-royal dark:text-bright/80" />
                </div>
                <h3 className={`${cardTitleStyle} mb-2`}>{feature.title}</h3>
                <p className={cardDescStyle}>{feature.description}</p>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
