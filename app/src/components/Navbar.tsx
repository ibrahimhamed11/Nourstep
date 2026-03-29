import { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = navItems[lang];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-navy/85 backdrop-blur-lg border-b border-border/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <NavbarLogo theme={theme} />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted hover:text-heading hover:bg-bright/10 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="mx-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-sky hover:bg-bright/10 transition-all cursor-pointer"
            >
              <Globe size={16} />
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mx-1 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-sky hover:bg-bright/10 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href="#countdown"
              className="ms-2 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-royal hover:bg-bright transition-colors duration-200"
            >
              {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-muted hover:bg-bright/10 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-lightblue hover:bg-card-dark transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-muted hover:text-heading hover:bg-card-dark font-medium transition-all"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-muted hover:bg-card-dark font-medium cursor-pointer"
              >
                <Globe size={16} />
                {lang === 'en' ? 'عربي' : 'English'}
              </button>
              <a
                href="#countdown"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-center font-semibold text-white bg-royal mt-2"
              >
                {lang === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
