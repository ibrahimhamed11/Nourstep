/**
 * AuthLayout — shared layout for all auth pages.
 * Full-screen split: left = immersive branding, right = glassmorphic form.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe, Sun, Moon, Shield, Zap, Users } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import { authI18n } from '../../auth.i18n';
import NavbarLogo from '../NavbarLogo';

interface Props {
  lang: Lang;
  children: React.ReactNode;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function AuthLayout({ lang, children, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const isRTL = lang === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const isDark = theme === 'dark';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: lang === 'ar' ? 'ذكاء اصطناعي متقدم' : 'AI-Powered Insights',
      desc: lang === 'ar' ? 'تحليلات ذكية لتقدم كل طالب' : 'Smart analytics for every student',
    },
    {
      icon: Users,
      title: lang === 'ar' ? 'منظومة متكاملة' : 'Unified Ecosystem',
      desc: lang === 'ar' ? 'معلمون، طلاب، وأولياء أمور' : 'Teachers, students & parents',
    },
    {
      icon: Shield,
      title: lang === 'ar' ? 'آمن وموثوق' : 'Secure & Trusted',
      desc: lang === 'ar' ? 'حماية متقدمة لبياناتك' : 'Enterprise-grade data protection',
    },
  ];

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`min-h-screen flex ${lang === 'ar' ? 'font-arabic' : 'font-body'} ${
        isDark ? 'dark' : ''
      }`}
    >
      {/* ── Left Panel: Immersive Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden">
        {/* Layered gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1e5e] via-royal to-[#1444B8]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_120%,rgba(61,139,255,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_-10%,rgba(91,196,255,0.15),transparent)]" />

        {/* Animated mesh pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        {/* Floating orbs */}
        <div className="absolute top-16 left-8 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-24 right-12 w-80 h-80 bg-sky/[0.06] rounded-full blur-[80px]" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-bright/[0.05] rounded-full blur-[60px]" style={{ animationDelay: '4s', animationDuration: '10s' }} />

        {/* Decorative grid lines */}
        <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <NavbarLogo theme="dark" />
          </div>

          {/* Center content */}
          <div className="flex-1 flex items-center py-8">
            <div className="max-w-md">
              {/* Eyebrow badge */}
              <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-sky tracking-wide backdrop-blur-sm mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  {lang === 'ar' ? 'منصة تعليمية متكاملة' : 'All-in-One EdTech Platform'}
                </span>
              </div>

              {/* Main headline */}
              <h1 className={`text-3xl xl:text-[2.5rem] font-heading font-bold text-white leading-[1.2] mb-4 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {lang === 'ar'
                  ? 'حيث يلتقي التعليم بالابتكار'
                  : 'Where Education Meets Innovation'}
              </h1>

              <p className={`text-white/60 text-base xl:text-lg leading-relaxed mb-10 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {lang === 'ar'
                  ? 'المنظومة المتكاملة التي توحّد المعلمين والطلاب وأولياء الأمور — مدعومة بالذكاء الاصطناعي.'
                  : 'The ecosystem uniting teachers, students, and parents — powered by AI.'}
              </p>

              {/* Feature pills */}
              <div className="space-y-3">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.07] backdrop-blur-sm transition-all duration-700 hover:bg-white/[0.08] hover:border-white/[0.12] ${
                        mounted ? 'opacity-100 translate-x-0' : `opacity-0 ${isRTL ? 'translate-x-6' : '-translate-x-6'}`
                      }`}
                      style={{ transitionDelay: `${500 + i * 100}ms` }}
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-sky" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{f.title}</p>
                        <p className="text-xs text-white/40">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust indicators */}
              <div className={`flex items-center gap-6 mt-8 transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,201,122,0.4)]" />
                  <span className="text-white/50 text-xs font-medium">
                    {lang === 'ar' ? '٦٠+ مسجل مبكر' : '60+ early signups'}
                  </span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sky shadow-[0_0_8px_rgba(91,196,255,0.4)]" />
                  <span className="text-white/50 text-xs font-medium">
                    {lang === 'ar' ? 'مجاني للمعلمين' : 'Free for educators'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className={`flex items-center justify-between transition-all duration-700 delay-800 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white/20 text-xs">
              © 2026 NourStep — خطوة للنور
            </p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success/60" />
              <span className="text-white/20 text-[10px]">
                {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Auth Form ── */}
      <div className={`flex-1 flex flex-col min-h-screen relative ${isDark ? 'bg-[#050D24]' : 'bg-[#F8FAFF]'}`}>
        {/* Unified subtle background — consistent across all pages */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left soft glow */}
          <div className={`absolute -top-32 ${isRTL ? '-right-32' : '-left-32'} w-[400px] h-[400px] rounded-full blur-[120px] ${isDark ? 'bg-royal/[0.06]' : 'bg-royal/[0.04]'}`} />
          {/* Bottom-right soft glow */}
          <div className={`absolute -bottom-24 ${isRTL ? '-left-24' : '-right-24'} w-[350px] h-[350px] rounded-full blur-[100px] ${isDark ? 'bg-bright/[0.04]' : 'bg-bright/[0.03]'}`} />
          {/* Very subtle dot grid for texture */}
          <div className={`absolute inset-0 ${isDark ? 'opacity-[0.015]' : 'opacity-[0.025]'}`} style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
          <Link
            to="/"
            className={`group inline-flex items-center gap-2 text-sm text-muted hover:text-heading transition-all duration-300`}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${isDark ? 'bg-white/[0.04] border-white/[0.06] group-hover:border-bright/20' : 'bg-white/60 border-royal/8 group-hover:border-royal/20'} border transition-all duration-300 group-hover:shadow-sm`}>
              <BackArrow size={14} />
            </span>
            <span className="hidden sm:inline">{t.backToHome}</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            {setLang && (
              <button
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'text-muted hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-bright/20'
                    : 'text-muted hover:text-royal bg-white/60 hover:bg-white/80 border border-royal/8 hover:border-royal/20'
                }`}
              >
                <Globe size={14} />
                {lang === 'en' ? 'عربي' : 'EN'}
              </button>
            )}

            {/* Theme toggle */}
            {setTheme && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 cursor-pointer ${
                  isDark
                    ? 'text-muted hover:text-white bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] hover:border-bright/20'
                    : 'text-muted hover:text-royal bg-white/60 hover:bg-white/80 border border-royal/8 hover:border-royal/20'
                }`}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}

            {/* Mobile logo */}
            <div className="lg:hidden ms-2">
              <NavbarLogo theme={theme} />
            </div>
          </div>
        </div>

        {/* Form content — centered with smooth entry */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-8 pb-8">
          <div className={`w-full max-w-[440px] transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {children}
          </div>
        </div>

        {/* Bottom secure badge — subtle professionalism touch */}
        <div className="relative z-10 flex justify-center pb-4">
          <div className="flex items-center gap-2 text-[11px] text-muted/40">
            <Shield size={10} />
            <span>{lang === 'ar' ? 'اتصال آمن ومشفّر' : 'Secure, encrypted connection'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
