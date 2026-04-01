import { m } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Building2 } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';
import { fontSize, textColor, spacing, eyebrowStyle, sectionHeadingStyle, cardTitleStyle, cardDescStyle } from '../design-tokens';

interface UserItem {
  icon: LucideIcon;
  role: string;
  description: string;
  features: string[];
  color: string; // single tailwind color name
}

interface UsersContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  users: UserItem[];
}

const content: I18n<UsersContent> = {
  en: {
    eyebrow: 'Who It\'s For',
    title: 'Built For Everyone in Education',
    subtitle: 'Whether you teach, learn, parent, or manage — NourStep is designed with you in mind.',
    users: [
      {
        icon: GraduationCap,
        role: 'Teachers',
        description: 'Build your professional reputation, manage courses, and get AI-powered insights on student performance.',
        features: ['Smart Profiles', 'Course Builder', 'AI Analytics'],
        color: 'bright',
      },
      {
        icon: BookOpen,
        role: 'Students',
        description: 'Access all your courses, track progress, get AI study help, and stay motivated with gamified learning.',
        features: ['Study Buddy AI', 'Progress Tracking', 'Live Sessions'],
        color: 'sky',
      },
      {
        icon: Users,
        role: 'Parents',
        description: 'Stay connected to your child\'s education with real-time dashboards and instant notifications.',
        features: ['Live Dashboard', 'Grade Reports', 'Instant Alerts'],
        color: 'success',
      },
      {
        icon: Building2,
        role: 'Center Owners',
        description: 'Run your learning center like a pro — manage staff, track revenue, and oversee everything from one place.',
        features: ['Admin Panel', 'Revenue Analytics', 'Staff Management'],
        color: 'warning',
      },
    ],
  },
  ar: {
    eyebrow: 'لمن هذه المنصة؟',
    title: 'مصممة لكل فرد في التعليم',
    subtitle: 'سواء كنت تُعلّم أو تتعلّم أو تُتابع أبناءك أو تدير مركزًا — خطوة للنور مصممة من أجلك.',
    users: [
      {
        icon: GraduationCap,
        role: 'المعلمون',
        description: 'ابنِ سمعتك المهنية، وأدِر دوراتك بسلاسة، واحصل على رؤى ذكية عن أداء طلابك.',
        features: ['ملفات ذكية', 'منشئ الدورات', 'تحليلات AI'],
        color: 'bright',
      },
      {
        icon: BookOpen,
        role: 'الطلاب',
        description: 'تابع دوراتك وتقدّمك، واحصل على مساعدة دراسية ذكية، وابقَ محفزًا.',
        features: ['مساعد دراسي AI', 'تتبع التقدم', 'حصص مباشرة'],
        color: 'sky',
      },
      {
        icon: Users,
        role: 'أولياء الأمور',
        description: 'ابقَ على اطلاع دائم بتعليم أبنائك مع لوحات متابعة حية وإشعارات فورية.',
        features: ['لوحة متابعة حية', 'تقارير الدرجات', 'تنبيهات فورية'],
        color: 'success',
      },
      {
        icon: Building2,
        role: 'أصحاب المراكز',
        description: 'أدِر مركزك التعليمي باحترافية — تحكّم بالموظفين وتتبع الإيرادات من لوحة واحدة.',
        features: ['لوحة الإدارة', 'تحليلات الإيرادات', 'إدارة الموظفين'],
        color: 'warning',
      },
    ],
  },
};

export default function TargetUsers({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="users" className={`relative ${spacing.sectionY} ${spacing.sectionX} bg-surface dark:bg-darkblue`}>
      <div className={spacing.maxWidth}>
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className={`text-center ${spacing.sectionGap}`}
        >
          <p className={`${eyebrowStyle} ${textColor.eyebrow}`}>
            {t.eyebrow}
          </p>
          <h2 className={sectionHeadingStyle}>
            {t.title}
          </h2>
          <p className={`${fontSize.body} ${textColor.muted} mt-3 max-w-md mx-auto`}>{t.subtitle}</p>
        </m.div>

        {/* 2x2 grid — but with varied card inner layouts */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.gridGap}`}>
          {t.users.map((user, i) => {
            const Icon = user.icon;
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="group p-5 rounded-xl bg-navy/40 dark:bg-navy/50 border border-border/40 hover:border-border/70 hover:shadow-lg hover:shadow-royal/5 dark:hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${user.color}/8 flex items-center justify-center shrink-0`}>
                    <Icon size={20} className={`text-${user.color}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`${cardTitleStyle} mb-1`}>{user.role}</h3>
                    <p className={`${cardDescStyle} mb-3`}>{user.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {user.features.map((feat, j) => (
                        <span
                          key={j}
                          className={`px-2.5 py-1 rounded-md ${fontSize.tag} bg-surface/80 dark:bg-darkblue/80 ${textColor.muted} border border-border/30`}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
