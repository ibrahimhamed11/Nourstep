import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Globe, Sun, Moon, Sparkles } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import type { Lang, Theme, I18n } from '../types';
import NavbarLogo from './NavbarLogo';

interface NavItem { label: string; href: string }

const navItems: I18n<NavItem[]> = {
  en: [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Problems', href: '#problems' },
    { label: 'Users', href: '#users' },
    { label: 'Features', href: '#features' },
    { label: 'Launch', href: '#countdown' },
  ],
  ar: [
    { label: 'الرئيسية', href: '#hero' },
    { label: 'عن المنصة', href: '#about' },
    { label: 'المشاكل', href: '#problems' },
    { label: 'المستخدمون', href: '#users' },
    { label: 'المميزات', href: '#features' },
    { label: 'الإطلاق', href: '#countdown' },
  ],
};

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export default function Navbar({ lang, setLang, theme, setTheme }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for nav highlighting
  const updateActiveSection = useCallback(() => {
    const sections = navItems[lang].map((item) => item.href.replace('#', ''));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          setActiveSection(`#${sections[i]}`);
          return;
        }
      }
    }
    setActiveSection('#hero');
  }, [lang]);

  useEffect(() => {
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [updateActiveSection]);

  const items = navItems[lang];

  const isDark = theme === 'dark';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isDark
            ? 'bg-navy/80 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(61,139,255,0.12),0_4px_32px_-4px_rgba(0,0,0,0.4)]'
            : 'bg-white/75 backdrop-blur-2xl shadow-[0_1px_0_0_rgba(27,79,216,0.06),0_4px_24px_-4px_rgba(27,79,216,0.08)]'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line — visible when scrolled */}
      <div
        className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        } ${isDark ? 'bg-gradient-to-r from-transparent via-bright/40 to-transparent' : 'bg-gradient-to-r from-transparent via-royal/20 to-transparent'}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo — left */}
          <div className="flex-shrink-0">
            <NavbarLogo theme={theme} />
          </div>

          {/* Center — Nav pill container (desktop only) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <div className={`flex items-center gap-0.5 rounded-2xl px-1.5 py-1.5 backdrop-blur-md border ${
              isDark
                ? 'bg-card-dark/40 border-border/50'
                : 'bg-white/70 border-royal/8 shadow-sm shadow-royal/5'
            }`}>
              {items.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
                      isActive
                        ? 'text-white'
                        : isDark
                          ? 'text-muted hover:text-white/90'
                          : 'text-muted hover:text-heading'
                    }`}
                  >
                    {/* Active pill background with CSS transition */}
                    <span
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r from-royal to-bright transition-all duration-300 ${
                        isActive
                          ? `opacity-100 scale-100 ${isDark ? 'shadow-md shadow-bright/20' : 'shadow-md shadow-royal/25'}`
                          : 'opacity-0 scale-95'
                      }`}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right — Action buttons (desktop only) */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className={`group/btn relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-muted hover:text-white'
                  : 'text-muted hover:text-royal'
              }`}
            >
              <span className={`absolute inset-0 rounded-xl transition-colors duration-300 ${
                isDark ? 'bg-bright/0 group-hover/btn:bg-bright/10' : 'bg-royal/0 group-hover/btn:bg-royal/6'
              }`} />
              <Globe size={15} className="relative z-10 transition-transform duration-300 group-hover/btn:rotate-12" />
              <span className="relative z-10">{lang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`group/btn relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-muted hover:text-white'
                  : 'text-muted hover:text-royal'
              }`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className={`absolute inset-0 rounded-xl transition-colors duration-300 ${
                isDark ? 'bg-bright/0 group-hover/btn:bg-bright/10' : 'bg-royal/0 group-hover/btn:bg-royal/6'
              }`} />
              <m.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className="relative z-10"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </m.span>
            </button>

            {/* Separator */}
            <div className="w-px h-6 mx-1 bg-gradient-to-b from-transparent via-border to-transparent" />

            {/* CTA Button */}
            <a
              href="#countdown"
              className={`group/cta relative ms-1 px-5 py-2 rounded-xl text-[13px] font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                isDark
                  ? 'hover:shadow-lg hover:shadow-bright/20'
                  : 'hover:shadow-lg hover:shadow-royal/25'
              }`}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-royal via-bright to-sky bg-[length:200%_100%] animate-gradient-x" />
              <span className="absolute inset-[1px] rounded-[11px] bg-gradient-to-r from-royal to-bright transition-opacity duration-300 group-hover/cta:opacity-0" />
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles size={14} className="opacity-80" />
                {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </span>
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-1.5">
            {/* Mobile language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-muted hover:text-white hover:bg-bright/10'
                  : 'text-muted hover:text-royal hover:bg-royal/8'
              }`}
            >
              <Globe size={18} />
            </button>
            {/* Mobile theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-muted hover:text-white hover:bg-bright/10'
                  : 'text-muted hover:text-royal hover:bg-royal/8'
              }`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'text-white hover:bg-bright/10'
                  : 'text-heading hover:bg-royal/8'
              }`}
            >
              <AnimatePresence mode="wait">
                <m.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </m.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden"
          >
            <div className={`backdrop-blur-2xl border-t ${
              isDark
                ? 'bg-navy/98 border-border/50'
                : 'bg-white/90 border-royal/8'
            }`}>
              <div className="px-4 pt-3 pb-5 space-y-1">
                {items.map((item, i) => {
                  const isActive = activeSection === item.href;
                  return (
                    <m.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.25 }}
                      className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-royal to-bright shadow-sm shadow-royal/20'
                          : isDark
                            ? 'text-muted hover:text-white hover:bg-card-dark/70'
                            : 'text-muted hover:text-royal hover:bg-royal/6'
                      }`}
                    >
                      {item.label}
                    </m.a>
                  );
                })}

                {/* Divider */}
                <div className="!my-3 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* CTA */}
                <m.a
                  href="#countdown"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                  className="relative block px-4 py-3.5 rounded-xl text-center font-bold text-white overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-royal via-bright to-sky bg-[length:200%_100%] animate-gradient-x" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles size={16} />
                    {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
                  </span>
                </m.a>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
