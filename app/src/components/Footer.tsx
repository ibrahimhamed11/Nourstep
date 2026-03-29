import { Heart } from 'lucide-react';
import type { Lang, I18n } from '../types';

interface FooterLink { label: string; href: string }

interface FooterContent {
  brand: string;
  tagline: string;
  copyright: string;
  madeWith: string;
  by: string;
  links: FooterLink[];
}

const content: I18n<FooterContent> = {
  en: {
    brand: 'NourStep',
    tagline: 'Step Into Smarter Learning',
    copyright: '© 2026 NourStep. All rights reserved.',
    madeWith: 'Made with',
    by: 'by NourStep Team',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'Launch', href: '#countdown' },
    ],
  },
  ar: {
    brand: 'نور ستيب',
    tagline: 'خطوة نحو تعليم أذكى',
    copyright: '© 2026 نور ستيب. جميع الحقوق محفوظة.',
    madeWith: 'صُنع بـ',
    by: 'فريق نور ستيب',
    links: [
      { label: 'عن المنصة', href: '#about' },
      { label: 'المميزات', href: '#features' },
      { label: 'الإطلاق', href: '#countdown' },
    ],
  },
};

export default function Footer({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <footer className="relative bg-[#020A22] text-lightblue py-16 px-4">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bright/15 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo_no_bg.png" alt="NourStep" className="h-10 w-10 rounded-xl" />
            <div>
              <span className="text-lg font-bold text-white">{t.brand}</span>
              <p className="text-xs text-muted">{t.tagline}</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-sky transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-bright/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted/60">{t.copyright}</p>
          <p className="text-sm text-muted/60 flex items-center gap-1.5">
            {t.madeWith}{' '}
            <Heart size={12} className="text-error fill-error" />{' '}
            {t.by}
          </p>
        </div>
      </div>
    </footer>
  );
}
