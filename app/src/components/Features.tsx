import { motion } from 'framer-motion';
import { Brain, BadgeCheck, BarChart3, BookOpenCheck, Gamepad2, MessageCircle } from 'lucide-react';
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
        description: 'Intelligent analytics powered by AI help teachers pinpoint struggling students before it\'s too late. Meanwhile, every learner gets a personal study assistant that adapts to their pace, answers questions, and suggests focused revision paths — turning weaknesses into strengths.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'Verified Teacher Profiles',
        description: 'Professional public profiles featuring verified badges, star ratings, subject specializations, and rich teaching portfolios. Parents can browse qualifications, read reviews, and choose the perfect teacher — building instant trust and transparency.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'Real-Time Parent Dashboards',
        description: 'Elegant live dashboards that give parents a complete picture: attendance records, grade trends, homework status, behavioral notes, and learning trajectory — all updated in real time. No more chasing teachers for updates.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'Course Management & Live Sessions',
        description: 'Full end-to-end course creation: build structured curricula, schedule sessions with integrated calendars, stream live classes, auto-record lectures, assign homework, and let the system grade quizzes instantly. Everything a modern classroom needs, digitized.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'Gamified Student Progress',
        description: 'Transform learning into an adventure with XP points, achievement badges, daily streaks, milestone rewards, and competitive leaderboards. Students stay motivated, celebrate progress, and develop healthy study habits — all while having fun.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: MessageCircle,
        title: 'Smart Communication Hub',
        description: 'A unified messaging center connecting teachers, parents, and students. Send announcements, share progress reports, schedule parent-teacher meetings, and get instant notifications — all in one secure, organized space. No more scattered WhatsApp groups.',
        iconColor: 'text-royal',
        iconBg: 'bg-royal/10',
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
        description: 'تحليلات ذكية مدعومة بالذكاء الاصطناعي تساعد المعلمين على اكتشاف الطلاب المتعثرين قبل فوات الأوان. في الوقت نفسه، يحصل كل متعلّم على مساعد دراسي شخصي يتكيّف مع مستواه، يجيب على أسئلته، ويقترح مسارات مراجعة مركّزة — ليحوّل نقاط الضعف إلى قوة.',
        iconColor: 'text-sky',
        iconBg: 'bg-sky/10',
      },
      {
        icon: BadgeCheck,
        title: 'ملفات معلمين موثّقة ومعتمدة',
        description: 'ملفات شخصية احترافية تتضمن شارات توثيق، تقييمات نجوم، تخصصات دراسية، ومحفظة أعمال غنية. يمكن لأولياء الأمور تصفّح المؤهلات وقراءة المراجعات واختيار المعلم المثالي — ثقة فورية وشفافية كاملة.',
        iconColor: 'text-bright',
        iconBg: 'bg-bright/10',
      },
      {
        icon: BarChart3,
        title: 'لوحات متابعة حية لأولياء الأمور',
        description: 'لوحات متابعة أنيقة تمنح أولياء الأمور صورة شاملة: سجلات الحضور، اتجاهات الدرجات، حالة الواجبات، ملاحظات السلوك، ومسار التعلّم — كلها مُحدّثة لحظيًا. لا مزيد من ملاحقة المعلمين للحصول على تحديثات.',
        iconColor: 'text-success',
        iconBg: 'bg-success/10',
      },
      {
        icon: BookOpenCheck,
        title: 'إدارة الدورات والحصص المباشرة',
        description: 'إنشاء دورات متكامل من الألف إلى الياء: بناء مناهج منظّمة، جدولة حصص بتقويم مدمج، بث مباشر للحصص، تسجيل تلقائي للمحاضرات، تعيين واجبات، وتصحيح اختبارات آلي فوري. كل ما يحتاجه الفصل الحديث، رقميًا.',
        iconColor: 'text-warning',
        iconBg: 'bg-warning/10',
      },
      {
        icon: Gamepad2,
        title: 'تقدّم الطلاب بطريقة ممتعة وتفاعلية',
        description: 'حوّل التعلّم إلى مغامرة مع نقاط خبرة، شارات إنجاز، سلاسل نجاح يومية، مكافآت مراحل، ولوحات متصدرين تنافسية. الطلاب يبقون متحمسين، يحتفلون بتقدّمهم، ويبنون عادات دراسية صحية — وهم يستمتعون.',
        iconColor: 'text-error',
        iconBg: 'bg-error/10',
      },
      {
        icon: MessageCircle,
        title: 'مركز تواصل ذكي وموحّد',
        description: 'مركز رسائل موحّد يربط المعلمين وأولياء الأمور والطلاب. أرسل إعلانات، شارك تقارير التقدّم، جدوِل اجتماعات أولياء الأمور، واحصل على إشعارات فورية — كل شيء في مكان واحد آمن ومنظّم. لا مزيد من مجموعات الواتساب المتناثرة.',
        iconColor: 'text-royal',
        iconBg: 'bg-royal/10',
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
                className={`card-dark p-7 group relative overflow-hidden`}
              >
                {/* Top gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                  i === 0 ? 'from-sky to-bright' :
                  i === 1 ? 'from-bright to-royal' :
                  i === 2 ? 'from-success to-sky' :
                  i === 3 ? 'from-warning to-error' :
                  i === 4 ? 'from-error to-bright' :
                  'from-royal to-sky'
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
