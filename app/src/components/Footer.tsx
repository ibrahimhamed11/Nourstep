import { ArrowUp, Mail, MapPin } from 'lucide-react';
import type { Lang, Theme, I18n } from '../types';
import NavbarLogo from './NavbarLogo';
import { fontSize } from '../design-tokens';

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
    <footer className="relative bg-navy pt-0 pb-8 px-6">
      {/* Top divider — gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-royal/20 dark:via-bright/20 to-transparent mb-10" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <NavbarLogo theme={theme} />
            </div>
            <p className={`${fontSize.small} text-muted dark:text-lightblue/70 leading-relaxed max-w-xs`}>
              {t.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className={`${fontSize.xs} font-bold text-heading/50 dark:text-lightblue/50 uppercase tracking-wider mb-4`}>{t.linksTitle}</h4>
            <div className="space-y-2.5">
              {t.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block ${fontSize.small} text-muted dark:text-lightblue/70 hover:text-royal dark:hover:text-white transition-colors duration-200`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`${fontSize.xs} font-bold text-heading/50 dark:text-lightblue/50 uppercase tracking-wider mb-4`}>{t.contactTitle}</h4>
            <div className="space-y-2.5">
              <a href={`mailto:${t.email}`} className={`flex items-center gap-2 ${fontSize.small} text-muted dark:text-lightblue/70 hover:text-royal dark:hover:text-white transition-colors duration-200`}>
                <Mail size={13} className="shrink-0 text-royal/40 dark:text-bright/40" />
                {t.email}
              </a>
              <div className={`flex items-center gap-2 ${fontSize.small} text-muted dark:text-lightblue/70`}>
                <MapPin size={13} className="shrink-0 text-royal/40 dark:text-bright/40" />
                {t.location}
              </div>
              <a
                href="https://www.facebook.com/NourStepApp"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${fontSize.small} text-muted dark:text-lightblue/70 hover:text-royal dark:hover:text-white transition-colors duration-200`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-royal/40 dark:text-bright/40">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-6 border-t border-royal/8 dark:border-bright/10">
          <p className={`${fontSize.xs} text-muted/60 dark:text-lightblue/40`}>{t.copyright}</p>
          <a
            href="#hero"
            className={`inline-flex items-center gap-1.5 ${fontSize.xs} font-medium text-muted/60 dark:text-lightblue/40 hover:text-royal dark:hover:text-white transition-colors duration-200`}
          >
            <ArrowUp size={12} />
            {t.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
