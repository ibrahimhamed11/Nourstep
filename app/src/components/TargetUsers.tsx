import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Building2 } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

interface UserItem {
  icon: LucideIcon;
  role: string;
  description: string;
  features: string[];
  iconColor: string;
  iconBg: string;
  borderColor: string;
}

interface UsersContent {
  badge: string;
  title: string;
  subtitle: string;
  users: UserItem[];
}

const content: I18n<UsersContent> = {
  en: {
    badge: 'Who It\'s For',
    title: 'Built For Everyone in Education',
    subtitle: 'Whether you teach, learn, parent, or manage — NourStep is designed with you in mind.',
    users: [
      {
        icon: GraduationCap,
        role: 'Teachers',
        description: 'Build your professional reputation, manage courses effortlessly, and get AI-powered insights on student performance.',
        features: ['Smart Profiles', 'Course Builder', 'AI Analytics'],
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
        borderColor: 'border-bright/30',
      },
      {
        icon: BookOpen,
        role: 'Students',
        description: 'Access all your courses, track your progress, get AI study help, and stay motivated with gamified learning.',
        features: ['Study Buddy AI', 'Progress Tracking', 'Live Sessions'],
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
        borderColor: 'border-sky/30',
      },
      {
        icon: Users,
        role: 'Parents',
        description: 'Stay connected to your child\'s education with real-time dashboards, instant notifications, and grade reports.',
        features: ['Live Dashboard', 'Grade Reports', 'Instant Alerts'],
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
        borderColor: 'border-success/30',
      },
      {
        icon: Building2,
        role: 'Center Owners',
        description: 'Run your learning center like a pro — manage staff, track revenue, and oversee every aspect from one dashboard.',
        features: ['Admin Panel', 'Revenue Analytics', 'Staff Management'],
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
        borderColor: 'border-warning/30',
      },
    ],
  },
  ar: {
    badge: 'لمن هذه المنصة؟',
    title: 'مصممة لكل فرد في التعليم',
    subtitle: 'سواء كنت تُعلّم أو تتعلّم أو تُتابع أبناءك أو تدير مركزًا — نور ستيب مصممة من أجلك.',
    users: [
      {
        icon: GraduationCap,
        role: 'المعلمون',
        description: 'ابنِ سمعتك المهنية، وأدِر دوراتك بسلاسة، واحصل على رؤى ذكية مدعومة بالذكاء الاصطناعي عن أداء طلابك.',
        features: ['ملفات ذكية', 'منشئ الدورات', 'تحليلات AI'],
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
        borderColor: 'border-bright/30',
      },
      {
        icon: BookOpen,
        role: 'الطلاب',
        description: 'تابع جميع دوراتك وتقدّمك، واحصل على مساعدة دراسية ذكية، وابقَ محفزًا مع التعلّم التفاعلي.',
        features: ['مساعد دراسي AI', 'تتبع التقدم', 'حصص مباشرة'],
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
        borderColor: 'border-sky/30',
      },
      {
        icon: Users,
        role: 'أولياء الأمور',
        description: 'ابقَ على اطلاع دائم بتعليم أبنائك مع لوحات متابعة حية وإشعارات فورية وتقارير الدرجات.',
        features: ['لوحة متابعة حية', 'تقارير الدرجات', 'تنبيهات فورية'],
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
        borderColor: 'border-success/30',
      },
      {
        icon: Building2,
        role: 'أصحاب المراكز',
        description: 'أدِر مركزك التعليمي باحترافية — تحكّم بالموظفين وتتبع الإيرادات وأشرف على كل التفاصيل من لوحة واحدة.',
        features: ['لوحة الإدارة', 'تحليلات الإيرادات', 'إدارة الموظفين'],
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
        borderColor: 'border-warning/30',
      },
    ],
  },
};

export default function TargetUsers({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="users" className="relative py-24 md:py-32 px-4 bg-darkblue">
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
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-royal/10 dark:bg-sky/10 text-royal dark:text-sky border border-royal/20 dark:border-sky/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mt-4">
            {t.title}
          </h2>
          <p className="text-muted text-lg mt-4 max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {t.users.map((user, i) => {
            const Icon = user.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`card-dark p-6 text-center border-t-2 ${user.borderColor} group`}
              >
                <div className={`w-14 h-14 rounded-2xl ${user.iconBg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon size={26} className={user.iconColor} />
                </div>

                <h3 className="text-lg font-bold text-heading mb-2">{user.role}</h3>
                <p className="text-sm text-muted mb-5 leading-relaxed">{user.description}</p>

                <div className="flex flex-wrap justify-center gap-2">
                  {user.features.map((feat, j) => (
                    <span
                      key={j}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface text-muted border border-border group-hover:border-border/80 transition-colors duration-200"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
