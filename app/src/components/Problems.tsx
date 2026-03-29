import { motion } from 'framer-motion';
import { UserX, EyeOff, Layers, ClipboardList } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

interface ProblemsContent {
  badge: string;
  title: string;
  subtitle: string;
  problems: ProblemItem[];
}

const content: I18n<ProblemsContent> = {
  en: {
    badge: 'Problems We Solve',
    title: 'Why NourStep Exists',
    subtitle: 'The education ecosystem is broken. We\'re here to fix it.',
    problems: [
      {
        icon: UserX,
        title: 'Fragmented Teacher Profiles',
        description: 'Teachers need a unified profile to showcase skills and courses.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: EyeOff,
        title: 'No Real-Time Tracking',
        description: 'Parents cannot track children\'s progress in real-time.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Layers,
        title: 'Too Many Apps',
        description: 'Students use multiple apps for homework, notes, and live sessions.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: ClipboardList,
        title: 'Manual Attendance',
        description: 'Centers manage attendance manually without digital tracking.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
    ],
  },
  ar: {
    badge: 'المشاكل التي نحلها',
    title: 'لماذا نور ستيب؟',
    subtitle: 'المنظومة التعليمية تحتاج إلى تطوير. نحن هنا لإصلاح ذلك.',
    problems: [
      {
        icon: UserX,
        title: 'ملفات شخصية مبعثرة',
        description: 'يحتاج المعلمون إلى ملف موحد لعرض مهاراتهم ودوراتهم التعليمية.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: EyeOff,
        title: 'لا تتبع فوري',
        description: 'لا يستطيع أولياء الأمور متابعة تقدم أبنائهم مباشرةً وفي الوقت الفعلي.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Layers,
        title: 'تطبيقات متعددة',
        description: 'يستخدم الطلاب عدة تطبيقات لإدارة الواجبات والملاحظات والحصص المباشرة.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: ClipboardList,
        title: 'حضور يدوي',
        description: 'تدير المراكز الحضور يدويًا بدون تتبع رقمي متكامل.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
    ],
  },
};

export default function Problems({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="problems" className="relative py-24 md:py-32 px-4 bg-navy">
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
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-error/10 text-error border border-error/20 mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4">
            {t.title}
          </h2>
          <p className="text-muted text-lg mt-4 max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
          {t.problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="card-dark p-6 md:p-7"
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center`}>
                    <Icon size={22} className={problem.iconColor} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{problem.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
