import { m } from 'framer-motion';
import { UserX, EyeOff, Layers, ClipboardList } from 'lucide-react';
import type { Lang, I18n } from '../types';
import type { LucideIcon } from 'lucide-react';

interface ProblemItem {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
}

interface ProblemsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  problems: ProblemItem[];
}

const content: I18n<ProblemsContent> = {
  en: {
    eyebrow: 'The Challenge',
    title: 'Why NourStep Exists',
    subtitle: 'Education deserves better. These are the challenges holding everyone back.',
    problems: [
      {
        icon: UserX,
        title: 'Fragmented Teacher Profiles',
        description: 'No unified digital presence to showcase expertise, certifications, and courses.',
        accent: 'text-red-400',
        accentBg: 'bg-red-500/10',
        accentBorder: 'border-red-500/20 hover:border-red-500/40',
      },
      {
        icon: EyeOff,
        title: 'Zero Visibility for Parents',
        description: 'No real-time updates on attendance, grades, homework, or actual progress.',
        accent: 'text-amber-400',
        accentBg: 'bg-amber-500/10',
        accentBorder: 'border-amber-500/20 hover:border-amber-500/40',
      },
      {
        icon: Layers,
        title: 'App Overload for Students',
        description: 'Students juggle 5+ apps daily for homework, notes, scheduling, and sessions.',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-500/10',
        accentBorder: 'border-blue-500/20 hover:border-blue-500/40',
      },
      {
        icon: ClipboardList,
        title: 'Manual Everything for Centers',
        description: 'Attendance, payments, and scheduling still managed manually — wasting hours.',
        accent: 'text-cyan-400',
        accentBg: 'bg-cyan-500/10',
        accentBorder: 'border-cyan-500/20 hover:border-cyan-500/40',
      },
    ],
  },
  ar: {
    eyebrow: 'التحدي',
    title: 'لماذا خطوة للنور؟',
    subtitle: 'التعليم يستحق الأفضل. هذه هي التحديات التي تعيق الجميع.',
    problems: [
      {
        icon: UserX,
        title: 'ملفات مبعثرة للمعلمين',
        description: 'لا حضور رقمي موحّد لعرض الخبرات والشهادات والدورات.',
        accent: 'text-red-400',
        accentBg: 'bg-red-500/10',
        accentBorder: 'border-red-500/20 hover:border-red-500/40',
      },
      {
        icon: EyeOff,
        title: 'انعدام الرؤية لأولياء الأمور',
        description: 'لا تحديثات فورية عن الحضور أو الدرجات أو التقدّم الفعلي.',
        accent: 'text-amber-400',
        accentBg: 'bg-amber-500/10',
        accentBorder: 'border-amber-500/20 hover:border-amber-500/40',
      },
      {
        icon: Layers,
        title: 'فوضى التطبيقات للطلاب',
        description: 'التنقل بين 5+ تطبيقات يوميًا للواجبات والملاحظات والحصص.',
        accent: 'text-blue-400',
        accentBg: 'bg-blue-500/10',
        accentBorder: 'border-blue-500/20 hover:border-blue-500/40',
      },
      {
        icon: ClipboardList,
        title: 'إدارة يدوية للمراكز',
        description: 'الحضور والمدفوعات والجدولة تُدار يدويًا — مما يُهدر ساعات.',
        accent: 'text-cyan-400',
        accentBg: 'bg-cyan-500/10',
        accentBorder: 'border-cyan-500/20 hover:border-cyan-500/40',
      },
    ],
  },
};

export default function Problems({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <section id="problems" className="relative py-16 md:py-20 px-6 bg-navy">
      <div className="max-w-5xl mx-auto">
        {/* Header — centered for impact */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="inline-block text-[11px] font-semibold uppercase tracking-widest text-error/80 mb-3 px-3 py-1 rounded-full bg-error/10 border border-error/20">
            {t.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-heading mt-2">
            {t.title}
          </h2>
          <p className="text-muted text-[15px] mt-2 max-w-lg mx-auto">{t.subtitle}</p>
        </m.div>

        {/* 2×2 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {t.problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className={`group relative rounded-2xl border ${problem.accentBorder} bg-card-dark/60 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-card-dark/90 hover:shadow-lg hover:shadow-black/5`}
              >
                {/* Number watermark */}
                <span className="absolute top-3 end-4 text-[40px] font-heading font-black text-muted/[0.06] leading-none select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon pill */}
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${problem.accentBg} mb-3`}>
                  <Icon size={18} className={`${problem.accent}`} />
                </div>

                {/* Text */}
                <h3 className="text-[15px] font-semibold text-heading mb-1.5 group-hover:text-royal dark:group-hover:text-sky transition-colors duration-200">
                  {problem.title}
                </h3>
                <p className="text-[13px] text-muted leading-relaxed">
                  {problem.description}
                </p>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
