import { Heart, ArrowUp, Mail, MapPin } from 'lucide-react';
import type { Lang, I18n } from '../types';
import Logo from './logo';

interface FooterLink { label: string; href: string }

interface FooterContent {
  brand: string;
  tagline: string;
  description: string;
  copyright: string;
  madeWith: string;
  by: string;
  links: FooterLink[];
  linksTitle: string;
  contactTitle: string;
  email: string;
  location: string;
  backToTop: string;
}

const content: I18n<FooterContent> = {
  en: {
    brand: 'NourStep',
    tagline: 'Step Into Smarter Learning',
    description: 'The all-in-one education platform connecting teachers, students, and parents with AI-powered tools.',
    copyright: '© 2026 NourStep. All rights reserved.',
    madeWith: 'Made with',
    by: 'by NourStep Team',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'For Educators', href: '#users' },
      { label: 'Launch', href: '#countdown' },
    ],
    linksTitle: 'Quick Links',
    contactTitle: 'Contact',
    email: 'hello@nourstep.com',
    location: 'Cairo, Egypt',
    backToTop: 'Back to top',
  },
  ar: {
    brand: 'نور ستيب',
    tagline: 'خطوة نحو تعليم أذكى',
    description: 'المنصة التعليمية المتكاملة التي تربط المعلمين والطلاب وأولياء الأمور بأدوات مدعومة بالذكاء الاصطناعي.',
    copyright: '© 2026 نور ستيب. جميع الحقوق محفوظة.',
    madeWith: 'صُنع بـ',
    by: 'فريق نور ستيب',
    links: [
      { label: 'عن المنصة', href: '#about' },
      { label: 'المميزات', href: '#features' },
      { label: 'للمعلمين', href: '#users' },
      { label: 'الإطلاق', href: '#countdown' },
    ],
    linksTitle: 'روابط سريعة',
    contactTitle: 'تواصل معنا',
    email: 'hello@nourstep.com',
    location: 'القاهرة، مصر',
    backToTop: 'العودة للأعلى',
  },
};

export default function Footer({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <footer className="relative bg-navy text-lightblue py-16 px-4">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo width={40} height={35} className="shrink-0 drop-shadow-md" />
              <div>
                <span className="text-lg font-extrabold font-arabic text-gradient leading-tight">خطوة للنور</span>
                <p className="text-[10px] text-muted/60 uppercase tracking-widest font-medium">NOURSTEP</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              {t.description}
            </p>
          </div>

          {/* Links column */}
          <div>
            <h4 className="text-sm font-bold text-heading uppercase tracking-wider mb-4">{t.linksTitle}</h4>
            <div className="space-y-3">
              {t.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-muted hover:text-sky hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-sm font-bold text-heading uppercase tracking-wider mb-4">{t.contactTitle}</h4>
            <div className="space-y-3">
              <a href={`mailto:${t.email}`} className="flex items-center gap-2 text-sm text-muted hover:text-sky transition-colors duration-200">
                <Mail size={14} className="shrink-0" />
                {t.email}
              </a>
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} className="shrink-0" />
                {t.location}
              </div>
            </div>

            {/* Back to top */}
            <a
              href="#hero"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-xs font-medium text-muted hover:text-heading bg-card-dark border border-border hover:border-bright/30 transition-all duration-200"
            >
              <ArrowUp size={12} />
              {t.backToTop}
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted/60">{t.copyright}</p>
          <p className="text-sm text-muted/60 flex items-center gap-1.5">
            {t.madeWith}{' '}
            <Heart size={12} className="text-error fill-error animate-pulse" />{' '}
            {t.by}
          </p>
        </div>
      </div>
    </footer>
  );
}
