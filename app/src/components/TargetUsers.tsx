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
    badge: 'Target Users',
    title: 'Built For Everyone',
    subtitle: 'Designed for every member of the education ecosystem.',
    users: [
      {
        icon: GraduationCap,
        role: 'Teachers',
        description: 'Build reputation, manage courses, track students.',
        features: ['Smart Profiles', 'Course Builder', 'Analytics'],
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
        borderColor: 'border-bright/30',
      },
      {
        icon: BookOpen,
        role: 'Students',
        description: 'Access content, track progress, interact with teachers.',
        features: ['Study Buddy AI', 'Progress Tracking', 'Live Sessions'],
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
        borderColor: 'border-sky/30',
      },
      {
        icon: Users,
        role: 'Parents',
        description: 'Monitor attendance, grades, and homework.',
        features: ['Real-Time Dashboard', 'Grade Reports', 'Notifications'],
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
        borderColor: 'border-success/30',
      },
      {
        icon: Building2,
        role: 'Center Owners',
        description: 'Manage teachers, revenue, and students.',
        features: ['Admin Panel', 'Revenue Tracking', 'Staff Management'],
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
        borderColor: 'border-warning/30',
      },
    ],
  },
  ar: {
    badge: 'الفئات المستهدفة',
    title: 'مصممة للجميع',
    subtitle: 'مصممة لكل فرد في المنظومة التعليمية.',
    users: [
      {
        icon: GraduationCap,
        role: 'المعلمون',
        description: 'بناء سمعة قوية، إدارة الدورات، متابعة الطلاب.',
        features: ['ملفات ذكية', 'منشئ الدورات', 'تحليلات'],
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
        borderColor: 'border-bright/30',
      },
      {
        icon: BookOpen,
        role: 'الطلاب',
        description: 'الوصول إلى المحتوى، متابعة التقدم، التفاعل مع المعلمين.',
        features: ['مساعد دراسي AI', 'تتبع التقدم', 'حصص مباشرة'],
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
        borderColor: 'border-sky/30',
      },
      {
        icon: Users,
        role: 'أولياء الأمور',
        description: 'متابعة الحضور، الدرجات، والواجبات.',
        features: ['لوحة متابعة', 'تقارير الدرجات', 'إشعارات'],
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
        borderColor: 'border-success/30',
      },
      {
        icon: Building2,
        role: 'أصحاب المراكز',
        description: 'إدارة المعلمين، الإيرادات، والطلاب.',
        features: ['لوحة الإدارة', 'تتبع الإيرادات', 'إدارة الموظفين'],
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bright/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky/10 text-sky border border-sky/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4">
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
                className={`card-dark p-6 text-center border-t-2 ${user.borderColor}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${user.iconBg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={26} className={user.iconColor} />
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{user.role}</h3>
                <p className="text-sm text-muted mb-5 leading-relaxed">{user.description}</p>

                <div className="flex flex-wrap justify-center gap-2">
                  {user.features.map((feat, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-navy/60 text-lightblue/80 border border-bright/10"
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
