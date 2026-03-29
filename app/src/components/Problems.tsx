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
    subtitle: 'Education deserves better. These are the challenges holding everyone back — and we\'re solving each one.',
    problems: [
      {
        icon: UserX,
        title: 'Fragmented Teacher Profiles',
        description: 'Teachers lack a unified digital presence to showcase their expertise, certifications, and course offerings in one place.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: EyeOff,
        title: 'Zero Visibility for Parents',
        description: 'Parents are left in the dark — no real-time updates on attendance, grades, homework, or their child\'s actual progress.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Layers,
        title: 'App Overload for Students',
        description: 'Students juggle 5+ apps daily for homework, notes, scheduling, and live sessions — creating chaos instead of clarity.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: ClipboardList,
        title: 'Manual Everything for Centers',
        description: 'Learning centers still manage attendance, payments, and scheduling manually — wasting hours on what technology should handle.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
    ],
  },
  ar: {
    badge: 'المشاكل التي نحلها',
    title: 'لماذا نور ستيب؟',
    subtitle: 'التعليم يستحق الأفضل. هذه هي التحديات التي تعيق الجميع — ونحن نحلّ كل واحدة منها.',
    problems: [
      {
        icon: UserX,
        title: 'ملفات شخصية مبعثرة للمعلمين',
        description: 'يفتقر المعلمون إلى حضور رقمي موحّد لعرض خبراتهم وشهاداتهم ودوراتهم التعليمية في مكان واحد.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: EyeOff,
        title: 'انعدام الرؤية لأولياء الأمور',
        description: 'يبقى أولياء الأمور في الظلام — لا تحديثات فورية عن الحضور أو الدرجات أو الواجبات أو التقدّم الفعلي لأبنائهم.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Layers,
        title: 'فوضى التطبيقات للطلاب',
        description: 'يتنقل الطلاب بين 5 تطبيقات أو أكثر يوميًا للواجبات والملاحظات والجدولة والحصص المباشرة — مما يخلق فوضى بدلاً من الوضوح.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: ClipboardList,
        title: 'إدارة يدوية للمراكز',
        description: 'لا تزال المراكز التعليمية تدير الحضور والمدفوعات والجدولة يدويًا — مما يهدر ساعات فيما يجب أن تتولاه التكنولوجيا.',
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
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mt-4">
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
                className="card-dark p-6 md:p-7 group relative overflow-hidden"
              >
                {/* Subtle number watermark */}
                <span className="absolute top-3 right-4 rtl:right-auto rtl:left-4 text-6xl font-extrabold text-border/50 dark:text-border/30 select-none leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} className={problem.iconColor} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-heading mb-1.5">{problem.title}</h3>
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
