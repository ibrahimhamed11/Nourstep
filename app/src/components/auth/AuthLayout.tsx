/**
 * AuthLayout — shared layout for all auth pages.
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
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden dark">

        {/* Background — deep navy matching the app's dark palette */}
        <div className="absolute inset-0 bg-[#050D24]" />
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#0D1D4E_0%,#081840_50%,#050D24_100%)]" />
        {/* Top royal accent glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(27,79,216,0.35),transparent)]" />
        {/* Bottom-right sky accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_100%,rgba(61,139,255,0.18),transparent)]" />
        {/* Center soft glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[260px] bg-[#1B4FD8]/[0.14] rounded-full blur-[80px] animate-float" />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">

          {/* Logo */}
          <NavbarLogo theme="dark" />

          {/* Center */}
          <div className="flex-1 flex items-center py-8">
            <div className="max-w-md">

              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-[11px] font-semibold text-sky tracking-wide mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_6px_rgba(34,201,122,0.6)]" />
                {lang === 'ar' ? 'منصة تعليمية متكاملة' : 'All-in-One EdTech Platform'}
              </span>

              {/* Headline */}
              <h1 className="text-3xl xl:text-4xl font-heading font-bold leading-snug mb-4">
                {lang === 'ar' ? (
                  <>
                    <span className="text-gradient">حيث يلتقي التعليم</span>
                    <span className="block text-white">بالابتكار</span>
                  </>
                ) : (
                  <>
                    <span className="text-gradient">Where Education</span>
                    <span className="block text-white">Meets Innovation</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-white/60 text-sm xl:text-base leading-relaxed mb-8">
                {lang === 'ar'
                  ? 'المنظومة المتكاملة التي توحّد المعلمين والطلاب وأولياء الأمور — مدعومة بالذكاء الاصطناعي.'
                  : 'The ecosystem uniting teachers, students, and parents — powered by AI.'}
              </p>

              {/* Features */}
              <div className="space-y-2.5">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-colors duration-200">
                      <div className="w-8 h-8 rounded-lg bg-[#1B4FD8]/25 border border-bright/[0.2] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-sky" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white/90">{f.title}</p>
                        <p className="text-[11px] text-white/45">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Trust */}
              <div className="flex items-center gap-5 mt-7 pt-5 border-t border-white/[0.1]">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px_rgba(34,201,122,0.5)]" />
                  <span className="text-[11px] text-white/60">{lang === 'ar' ? '٦٠+ مسجل مبكر' : '60+ early signups'}</span>
                </div>
                <div className="w-px h-3 bg-white/15" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky shadow-[0_0_6px_rgba(91,196,255,0.5)]" />
                  <span className="text-[11px] text-white/60">{lang === 'ar' ? 'مجاني للمعلمين' : 'Free for educators'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-white/30">© 2026 NourStep — خطوة للنور</p>
            <span className="text-[10px] text-white/30">{lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</span>
          </div>

        </div>
      </div>

      {/* ── Right Panel: Auth Form ── */}
      <div className={`flex-1 flex flex-col min-h-screen relative ${isDark ? 'bg-[#050D24]' : 'bg-[#F5F7FF]'}`}>
        {/* Unified subtle background — consistent with left panel dark navy */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Dark mode: very subtle tonal gradient */}
          {isDark && (
            <div className="absolute inset-0 bg-gradient-to-br from-[#081840]/40 via-[#050D24] to-[#050D24]" />
          )}
          {/* Light mode: soft radials */}
          {!isDark && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,rgba(27,79,216,0.07),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(91,196,255,0.04),transparent)]" />
            </>
          )}
          {/* Top soft glow */}
          <div className={`absolute -top-32 ${isRTL ? '-right-32' : '-left-32'} w-[400px] h-[400px] rounded-full blur-[120px] ${isDark ? 'bg-[#1B4FD8]/[0.06]' : 'bg-[#1B4FD8]/[0.04]'}`} />
          {/* Bottom soft glow */}
          <div className={`absolute -bottom-24 ${isRTL ? '-left-24' : '-right-24'} w-[350px] h-[350px] rounded-full blur-[100px] ${isDark ? 'bg-[#3D8BFF]/[0.04]' : 'bg-[#3D8BFF]/[0.03]'}`} />
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
