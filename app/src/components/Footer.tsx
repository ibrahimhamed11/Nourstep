import { ArrowUp, Mail, MapPin } from 'lucide-react';
import type { Lang, Theme, I18n } from '../types';
import NavbarLogo from './NavbarLogo';

interface FooterLink { label: string; href: string }

interface FooterContent {
  description: string;
  copyright: string;
  links: FooterLink[];
  linksTitle: string;
  contactTitle: string;
  email: string;
  location: string;
  backToTop: string;
}

const content: I18n<FooterContent> = {
  en: {
    description: 'The all-in-one education platform connecting teachers, students, and parents with smart tools.',
    copyright: '© 2026 NourStep',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'For Educators', href: '#users' },
      { label: 'Launch', href: '#countdown' },
    ],
    linksTitle: 'Links',
    contactTitle: 'Contact',
    email: 'hello@nourstep.com',
    location: 'Cairo, Egypt',
    backToTop: 'Top',
  },
  ar: {
    description: 'المنصة التعليمية المتكاملة التي تربط المعلمين والطلاب وأولياء الأمور بأدوات ذكية.',
    copyright: '© 2026 خطوة للنور',
    links: [
      { label: 'عن المنصة', href: '#about' },
      { label: 'المميزات', href: '#features' },
      { label: 'للمعلمين', href: '#users' },
      { label: 'الإطلاق', href: '#countdown' },
    ],
    linksTitle: 'روابط',
    contactTitle: 'تواصل',
    email: 'hello@nourstep.com',
    location: 'القاهرة، مصر',
    backToTop: 'أعلى',
  },
};

export default function Footer({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = content[lang];

  return (
    <footer className="relative bg-navy py-12 px-6">
      <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-12" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-3">
              <NavbarLogo theme={theme} />
            </div>
            <p className="text-[13px] text-muted/60 leading-relaxed max-w-xs">
              {t.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted/40 uppercase tracking-wider mb-3">{t.linksTitle}</h4>
            <div className="space-y-2">
              {t.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-[13px] text-muted/60 hover:text-heading transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted/40 uppercase tracking-wider mb-3">{t.contactTitle}</h4>
            <div className="space-y-2">
              <a href={`mailto:${t.email}`} className="flex items-center gap-1.5 text-[13px] text-muted/60 hover:text-heading transition-colors">
                <Mail size={12} className="shrink-0 opacity-50" />
                {t.email}
              </a>
              <div className="flex items-center gap-1.5 text-[13px] text-muted/60">
                <MapPin size={12} className="shrink-0 opacity-50" />
                {t.location}
              </div>
              <a
                href="https://www.facebook.com/NourStepApp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-muted/60 hover:text-heading transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-50">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between pt-6 border-t border-border/20">
          <p className="text-[12px] text-muted/30">{t.copyright}</p>
          <a
            href="#hero"
            className="inline-flex items-center gap-1 text-[12px] text-muted/30 hover:text-muted/60 transition-colors"
          >
            <ArrowUp size={10} />
            {t.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
