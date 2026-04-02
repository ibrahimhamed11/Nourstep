/**
 * ProjectOverviewPage — NourStep Project Identity & Tech/Business Showcase
 * Beautiful, animated overview of the project name, vision, business model & tech stack.
 * Has its own local theme toggle (always defaults to light, independent of global theme).
 */
import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import {
  Brain, GraduationCap, Users, Building2, Smartphone, Monitor,
  Database, Server, Code2, Layers, Zap, BarChart3, Globe,
  Rocket, Star, Target, ArrowRight, Sparkles,
  BookOpen, Trophy, Shield, DollarSign,
  ChevronDown, ExternalLink, Sun, Moon,
} from 'lucide-react';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Tech Stack Data ─── */
interface TechItem {
  name: string;
  version: string;
  purpose: string;
  color: string;
}

const techLayers: { label: string; icon: React.ElementType; color: string; bg: string; items: TechItem[] }[] = [
  {
    label: 'Frontend — Web',
    icon: Monitor,
    color: '#3D8BFF',
    bg: 'from-blue-500/10 to-blue-600/5',
    items: [
      { name: 'React', version: '19+', purpose: 'واجهة المستخدم', color: '#61DAFB' },
      { name: 'TypeScript', version: '5+', purpose: 'نظام الأنواع', color: '#3178C6' },
      { name: 'Vite', version: '6+', purpose: 'Build Tool', color: '#646CFF' },
      { name: 'Tailwind CSS', version: 'v4', purpose: 'التصميم', color: '#38BDF8' },
      { name: 'Framer Motion', version: 'latest', purpose: 'الأنيميشن', color: '#FF0055' },
      { name: 'React Router', version: 'v7', purpose: 'التنقل', color: '#CA4245' },
    ],
  },
  {
    label: 'Mobile App',
    icon: Smartphone,
    color: '#22C97A',
    bg: 'from-emerald-500/10 to-emerald-600/5',
    items: [
      { name: 'React Native', version: '0.74+', purpose: 'iOS & Android', color: '#61DAFB' },
      { name: 'Expo', version: 'SDK 51+', purpose: 'Dev Tools', color: '#000020' },
      { name: 'Zustand', version: 'latest', purpose: 'State Management', color: '#FF6B35' },
      { name: 'React Navigation', version: 'v6', purpose: 'التنقل', color: '#6B48FF' },
    ],
  },
  {
    label: 'Backend — Node.js',
    icon: Server,
    color: '#FFB830',
    bg: 'from-amber-500/10 to-amber-600/5',
    items: [
      { name: 'Node.js', version: '20 LTS', purpose: 'بيئة التشغيل', color: '#339933' },
      { name: 'Express.js', version: '5+', purpose: 'REST API', color: '#000000' },
      { name: 'TypeScript', version: '5+', purpose: 'نظام الأنواع', color: '#3178C6' },
      { name: 'JWT', version: 'latest', purpose: 'المصادقة', color: '#FB015B' },
      { name: 'Socket.IO', version: '4+', purpose: 'Real-Time', color: '#010101' },
    ],
  },
  {
    label: 'Database',
    icon: Database,
    color: '#A855F7',
    bg: 'from-purple-500/10 to-purple-600/5',
    items: [
      { name: 'MongoDB', version: '7+', purpose: 'قاعدة البيانات', color: '#47A248' },
      { name: 'Mongoose', version: '8+', purpose: 'ODM', color: '#880000' },
      { name: 'MongoDB Atlas', version: 'Cloud', purpose: 'الاستضافة', color: '#47A248' },
    ],
  },
];

/* ─── Business Value Propositions ─── */
interface ValueProp {
  icon: React.ElementType;
  role: string;
  roleAr: string;
  desc: string;
  color: string;
  bg: string;
}

const valueProps: ValueProp[] = [
  {
    icon: GraduationCap,
    role: 'Teachers',
    roleAr: 'المعلمون',
    desc: 'ملفات احترافية موثّقة، إدارة دورات، تحليلات AI للطلاب، وأدوات محتوى ذكية.',
    color: '#3D8BFF',
    bg: 'bg-blue-500/8 border-blue-400/15',
  },
  {
    icon: BookOpen,
    role: 'Students',
    roleAr: 'الطلاب',
    desc: 'وصول موحّد للدورات، مساعد AI شخصي، تتبع تقدم محفّز، وجلسات مباشرة.',
    color: '#22C97A',
    bg: 'bg-emerald-500/8 border-emerald-400/15',
  },
  {
    icon: Users,
    role: 'Parents',
    roleAr: 'أولياء الأمور',
    desc: 'لوحة متابعة لحظية لتقدم الأبناء، تقارير الدرجات، وإشعارات فورية.',
    color: '#FFB830',
    bg: 'bg-amber-500/8 border-amber-400/15',
  },
  {
    icon: Building2,
    role: 'Centers',
    roleAr: 'مراكز التعليم',
    desc: 'لوحة إدارة شاملة، تحليلات الإيرادات، إدارة الموظفين، وإشراف كامل.',
    color: '#A855F7',
    bg: 'bg-purple-500/8 border-purple-400/15',
  },
];

/* ─── Launch Phases ─── */
const phases = [
  {
    phase: '01',
    date: 'June 12, 2026',
    title: 'MVP Launch',
    desc: 'ملفات المعلمين، إدارة الدورات، تسجيل الطلاب',
    color: '#3D8BFF',
    status: 'upcoming',
  },
  {
    phase: '02',
    date: 'Q3 2026',
    title: 'Parent Dashboard + AI',
    desc: 'لوحة الأهالي، تحليلات الذكاء الاصطناعي، نظام التلعيب',
    color: '#22C97A',
    status: 'planned',
  },
  {
    phase: '03',
    date: 'Q4 2026',
    title: 'Center Management',
    desc: 'إدارة المراكز، تحليلات الإيرادات، الـ Marketplace',
    color: '#FFB830',
    status: 'planned',
  },
  {
    phase: '04',
    date: '2027',
    title: 'Mobile + Advanced AI',
    desc: 'تطبيقات iOS & Android، ميزات AI متقدمة',
    color: '#A855F7',
    status: 'future',
  },
];

/* ─── Business Model ─── */
const businessModel = [
  { icon: DollarSign, title: 'Freemium للمعلمين', desc: 'الميزات الأساسية مجانية — التحليلات المتقدمة مدفوعة', color: '#3D8BFF' },
  { icon: Building2, title: 'اشتراك للمراكز', desc: 'خطط شهرية/سنوية لإدارة المركز بالكامل', color: '#22C97A' },
  { icon: BookOpen, title: 'خطط الطلاب', desc: 'وصول مجاني أساسي — AI Tutoring مميز', color: '#FFB830' },
  { icon: BarChart3, title: 'لوحة الأهالي', desc: 'مجاني أساسي — مفصّل ومتعدد الأبناء مدفوع', color: '#A855F7' },
];

/* ─── Pill ─── */
function Pill({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color,
      }}
    >
      {children}
    </span>
  );
}

/* ─── Section Header ─── */
function SectionHeader({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-royal dark:text-sky mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">{title}</h2>
      {subtitle && <p className="text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}

/* ─── Main Component ─── */
export default function ProjectOverviewPage() {
  const [activeLayer, setActiveLayer] = useState(0);

  /* ── Local theme — always defaults to light, isolated from global ── */
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nourstep-project-theme') as 'light' | 'dark' | null;
    return saved ?? 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('nourstep-project-theme', theme);
    // Restore global theme on unmount
    return () => {
      const global = (localStorage.getItem('nourstep-theme') as 'light' | 'dark' | null) ?? 'light';
      if (global === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-navy text-lightblue overflow-x-hidden font-body" dir="rtl">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden pb-24 pt-20">
        {/* Background glows */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#050D24] to-navy pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-royal/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-bright/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Theme Toggle — top-right fixed */}
        <div className="absolute top-5 left-5 z-20">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface/70 dark:bg-card-dark/60 border border-border/40 text-muted hover:text-heading hover:border-border/70 transition-all duration-200 text-sm font-medium backdrop-blur-sm shadow-sm"
          >
            {theme === 'dark'
              ? <><Sun size={15} /><span className="hidden sm:inline">Light</span></>
              : <><Moon size={15} /><span className="hidden sm:inline">Dark</span></>
            }
          </button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Launch Badge */}
          <m.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal/8 border border-royal/15 text-xs font-semibold text-sky mb-10"
          >
            <Rocket size={13} className="text-sky" />
            <span>Launching June 12, 2026 — Phase 1 MVP</span>
          </m.div>

          {/* Project Name */}
          <m.div
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Arabic name — large and bold */}
            <div className="mb-2">
              <span className="text-[4.5rem] md:text-[6rem] font-bold leading-none tracking-tight">
                <span className="bg-gradient-to-r from-bright via-sky to-royal bg-clip-text text-transparent">
                  خطوة
                </span>
                <span className="text-heading mx-3">للنور</span>
              </span>
            </div>

            {/* English name */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-l from-border/60 to-transparent" />
              <span className="text-2xl md:text-3xl font-bold text-royal dark:text-bright tracking-wide font-body">
                NourStep
              </span>
              <div className="h-px w-16 bg-gradient-to-r from-border/60 to-transparent" />
            </div>
          </m.div>

          {/* Tagline */}
          <m.p
            variants={fadeUp} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed mb-10"
          >
            المنظومة التعليمية المدعومة بالذكاء الاصطناعي — تربط المعلمين والطلاب وأولياء الأمور في منصة واحدة متكاملة
          </m.p>

          {/* Key Stats */}
          <m.div
            variants={stagger} initial="hidden" animate="show"
            transition={{ delayChildren: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-14"
          >
            {[
              { value: '60+', label: 'مسجل مبكر', icon: Users },
              { value: '4', label: 'فئات مستخدمين', icon: Target },
              { value: '4', label: 'مراحل إطلاق', icon: Rocket },
              { value: 'AR/EN', label: 'ثنائي اللغة', icon: Globe },
            ].map((s) => (
              <m.div
                key={s.label}
                variants={fadeUp}
                className="flex flex-col items-center px-6 py-3 rounded-2xl bg-surface/60 dark:bg-card-dark/40 border border-border/30"
              >
                <s.icon size={16} className="text-royal dark:text-bright mb-1" />
                <span className="text-2xl font-bold text-heading">{s.value}</span>
                <span className="text-xs text-muted">{s.label}</span>
              </m.div>
            ))}
          </m.div>

          {/* Scroll hint */}
          <m.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-1 text-muted/50"
          >
            <ChevronDown size={20} />
          </m.div>
        </div>
      </section>

      {/* ══════════════════ VISION ══════════════════ */}
      <section className="py-20 px-6 bg-surface/30 dark:bg-darkblue/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="الرؤية والمهمة"
            title="لماذا NourStep ؟"
            subtitle="منصة رائدة تُحدث نقلة نوعية في التعليم العربي"
          />

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Vision Card */}
            <m.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl border border-border/40 bg-card-dark/60 p-7 group hover:border-royal/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal to-bright" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-royal/12 flex items-center justify-center">
                  <Star size={18} className="text-royal dark:text-bright" />
                </div>
                <h3 className="text-lg font-bold text-heading">الرؤية</h3>
              </div>
              <p className="text-muted leading-relaxed text-[15px]">
                أن نصبح <span className="text-heading font-semibold">المنصة التعليمية الأولى</span> المدعومة بالذكاء الاصطناعي في العالم العربي — تربط المعلمين والطلاب وأولياء الأمور في نظام بيئي تعليمي سلس وموحّد.
              </p>
            </m.div>

            {/* Mission Card */}
            <m.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-2xl border border-border/40 bg-card-dark/60 p-7 group hover:border-royal/30 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky to-bright" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky/10 flex items-center justify-center">
                  <Target size={18} className="text-sky" />
                </div>
                <h3 className="text-lg font-bold text-heading">المهمة</h3>
              </div>
              <p className="text-muted leading-relaxed text-[15px]">
                تمكين كل طرف في رحلة التعلّم بأدوات ذكية، وتتبّع لحظي، ورؤى مدفوعة بالبيانات تُغيّر <span className="text-heading font-semibold">طريقة حدوث التعلّم</span>.
              </p>
            </m.div>

            {/* Pillars */}
            <m.div
              variants={fadeUp}
              className="md:col-span-2 rounded-2xl border border-border/40 bg-card-dark/60 p-7"
            >
              <h3 className="text-lg font-bold text-heading mb-5">ركائز المنصة</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Layers, title: 'نظام بيئي موحّد', desc: 'منصة واحدة لجميع أطراف العملية التعليمية', color: '#3D8BFF' },
                  { icon: Brain, title: 'رؤى AI', desc: 'تحليلات ذكية للمعلمين وتعلّم شخصي للطلاب', color: '#A855F7' },
                  { icon: Zap, title: 'تتبّع لحظي', desc: 'مراقبة التقدم اللحظية للأهالي والمعلمين', color: '#22C97A' },
                  { icon: Trophy, title: 'تلعيب', desc: 'XP والشارات والتحديات للمشاركة المستمرة', color: '#FFB830' },
                  { icon: Globe, title: 'ثنائي اللغة', desc: 'دعم كامل للعربية والإنجليزية في كل مكان', color: '#5BC4FF' },
                  { icon: Shield, title: 'أمان عالي', desc: 'JWT، تشفير كامل، وحماية ضد الـ DDoS', color: '#FF4D4D' },
                ].map((p) => (
                  <div key={p.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface/40 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${p.color}15` }}>
                      <p.icon size={15} style={{ color: p.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">{p.title}</p>
                      <p className="text-xs text-muted leading-snug mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* ══════════════════ VALUE PROPOSITION ══════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="القيمة المقدمة"
            title="لمن نبني NourStep ؟"
            subtitle="قيمة مخصصة لكل طرف في المنظومة التعليمية"
          />

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {valueProps.map((vp) => (
              <m.div
                key={vp.role}
                variants={fadeUp}
                className={`relative overflow-hidden rounded-2xl border p-6 ${vp.bg} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                style={{ boxShadow: `0 0 0 0 ${vp.color}00` }}
                whileHover={{ boxShadow: `0 8px 32px ${vp.color}15` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: `${vp.color}20` }}>
                    <vp.icon size={22} style={{ color: vp.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-bold text-heading">{vp.roleAr}</h3>
                      <Pill color={vp.color}>{vp.role}</Pill>
                    </div>
                    <p className="text-[14px] text-muted leading-relaxed">{vp.desc}</p>
                  </div>
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ══════════════════ TECH STACK ══════════════════ */}
      <section className="py-20 px-6 bg-surface/30 dark:bg-darkblue/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Tech Stack"
            title="البنية التقنية"
            subtitle="Full-Stack JavaScript موحّد — نفس اللغة في كل طبقة"
          />

          {/* Layer Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {techLayers.map((layer, i) => (
              <button
                key={layer.label}
                onClick={() => setActiveLayer(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  activeLayer === i
                    ? 'text-white shadow-lg'
                    : 'text-muted border-border/30 hover:border-border/60 hover:text-heading'
                }`}
                style={
                  activeLayer === i
                    ? { backgroundColor: layer.color, borderColor: layer.color, boxShadow: `0 4px 16px ${layer.color}35` }
                    : {}
                }
              >
                <layer.icon size={15} />
                {layer.label}
              </button>
            ))}
          </div>

          {/* Active Layer Cards */}
          <m.div
            key={activeLayer}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl border border-border/40 bg-gradient-to-br ${techLayers[activeLayer].bg} p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const Layer = techLayers[activeLayer];
                return (
                  <>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${Layer.color}20` }}>
                      <Layer.icon size={18} style={{ color: Layer.color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading text-base">{Layer.label}</h3>
                      <p className="text-xs text-muted">{Layer.items.length} technologies</p>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {techLayers[activeLayer].items.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card-dark/50 border border-border/20 hover:border-border/50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${tech.color}18` }}>
                    <Code2 size={14} style={{ color: tech.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-heading truncate">{tech.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface/60 text-muted border border-border/20 shrink-0">
                        {tech.version}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">{tech.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </m.div>

          {/* Architecture Summary */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, label: 'Web', tech: 'React + Vite + Tailwind', color: '#3D8BFF' },
              { icon: Smartphone, label: 'Mobile', tech: 'React Native + Expo', color: '#22C97A' },
              { icon: Server, label: 'API', tech: 'Node.js + Express + MongoDB', color: '#FFB830' },
            ].map((arch) => (
              <div key={arch.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card-dark/40 border border-border/30">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${arch.color}15` }}>
                  <arch.icon size={18} style={{ color: arch.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-heading">{arch.label}</p>
                  <p className="text-xs text-muted">{arch.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BUSINESS MODEL ══════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="نموذج الأعمال"
            title="كيف نربح؟"
            subtitle="Freemium + اشتراكات مرنة لكل فئة"
          />

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {businessModel.map((bm) => (
              <m.div
                key={bm.title}
                variants={fadeUp}
                className="flex items-start gap-4 p-6 rounded-2xl bg-card-dark/50 border border-border/30 hover:border-royal/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${bm.color}15` }}>
                  <bm.icon size={20} style={{ color: bm.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-heading text-sm mb-1">{bm.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{bm.desc}</p>
                </div>
              </m.div>
            ))}
          </m.div>

          {/* Market Focus */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-royal/8 to-bright/5 border border-royal/15"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-royal dark:text-bright" />
              <h3 className="font-bold text-heading">السوق المستهدف</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['🇪🇬 مصر — السوق الأساسي', '🌍 منطقة MENA', 'المعلمون الخصوصيون', 'مراكز التعليم', 'المدارس الخاصة', 'الطلاب الأفراد', 'أولياء الأمور المهتمون'].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-surface/60 border border-border/30 text-sm text-muted">
                  {tag}
                </span>
              ))}
            </div>
          </m.div>
        </div>
      </section>

      {/* ══════════════════ LAUNCH ROADMAP ══════════════════ */}
      <section className="py-20 px-6 bg-surface/30 dark:bg-darkblue/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="خطة الإطلاق"
            title="الطريق إلى الأمام"
            subtitle="4 مراحل تطوير ممنهجة حتى 2027"
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-8 top-0 bottom-0 w-px bg-gradient-to-b from-royal/30 via-bright/20 to-transparent hidden md:block" />

            <m.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-4"
            >
              {phases.map((ph) => (
                <m.div
                  key={ph.phase}
                  variants={fadeUp}
                  className="relative flex items-start gap-5 p-5 rounded-2xl bg-card-dark/50 border border-border/30 hover:border-royal/25 transition-all duration-300 md:pr-16"
                >
                  {/* Phase number */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: ph.color, boxShadow: `0 4px 20px ${ph.color}40` }}
                  >
                    {ph.phase}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="font-bold text-heading text-base">{ph.title}</h3>
                      <Pill color={ph.color}>{ph.date}</Pill>
                      {ph.status === 'upcoming' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          قريبًا
                        </span>
                      )}
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{ph.desc}</p>
                  </div>
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[calc(100%-2rem)] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 hidden md:block"
                    style={{ backgroundColor: ph.color, borderColor: ph.color }}
                  />
                </m.div>
              ))}
            </m.div>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER CTA ══════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-royal/15 via-card-dark/80 to-bright/10 border border-royal/20"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-royal/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-royal/15 border border-royal/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles size={24} className="text-royal dark:text-bright" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-heading mb-4">
                ابدأ معنا من اليوم الأول
              </h2>
              <p className="text-muted text-base md:text-lg mb-8 leading-relaxed">
                NourStep تُبنى الآن. انضم لقائمة الانتظار وكن من أوائل من يختبرون منظومة التعليم الجديدة.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-royal to-bright hover:from-bright hover:to-royal transition-all duration-300 shadow-lg shadow-royal/25 hover:scale-[1.02]"
                >
                  انضم لقائمة الانتظار
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/business"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-heading border border-border hover:border-royal/30 hover:bg-royal/5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ExternalLink size={16} />
                  وثيقة الأعمال
                </a>
              </div>
            </div>
          </m.div>
        </div>
      </section>

    </div>
  );
}
