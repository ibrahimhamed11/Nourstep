/**
 * RegisterTypePage — Role selection before registration.
 * Premium card-based role picker with hover effects and animations.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import type { LucideIcon } from 'lucide-react';
import { authI18n } from '../../auth.i18n';
import { ROLE_OPTIONS } from '../../auth.types';
import AuthLayout from './AuthLayout';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

const roleIcons: Record<string, LucideIcon> = {
  teacher: GraduationCap,
  student: BookOpen,
  parent: Users,
};

export default function RegisterTypePage({ lang, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const Arrow = lang === 'ar' ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal/10 to-bright/10 dark:from-bright/10 dark:to-sky/10 border border-royal/10 dark:border-bright/10 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <UserPlus size={24} className="text-royal dark:text-bright" />
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-heading font-bold text-heading mb-2 tracking-tight">
            {t.chooseAccountType}
          </h1>
          <p className="text-muted text-[15px] leading-relaxed">{t.chooseAccountSubtitle}</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          {ROLE_OPTIONS.map((option, i) => {
            const Icon = roleIcons[option.role] || GraduationCap;

            const colorConfig: Record<string, {
              border: string;
              iconBg: string;
              iconColor: string;
              hoverGlow: string;
              activeBorder: string;
            }> = {
              bright: {
                border: 'border-bright/15 hover:border-bright/40',
                iconBg: 'bg-bright/8 group-hover/card:bg-bright/15',
                iconColor: 'text-bright',
                hoverGlow: 'group-hover/card:shadow-bright/8',
                activeBorder: 'active:border-bright/50',
              },
              sky: {
                border: 'border-sky/15 hover:border-sky/40',
                iconBg: 'bg-sky/8 group-hover/card:bg-sky/15',
                iconColor: 'text-sky',
                hoverGlow: 'group-hover/card:shadow-sky/8',
                activeBorder: 'active:border-sky/50',
              },
              success: {
                border: 'border-success/15 hover:border-success/40',
                iconBg: 'bg-success/8 group-hover/card:bg-success/15',
                iconColor: 'text-success',
                hoverGlow: 'group-hover/card:shadow-success/8',
                activeBorder: 'active:border-success/50',
              },
            };

            const colors = colorConfig[option.color] || colorConfig.bright;

            return (
              <button
                key={option.role}
                onClick={() => navigate(`/auth/register/${option.role}`)}
                className={`
                  group/card w-full text-start p-5 rounded-2xl border transition-all duration-300
                  bg-white/60 dark:bg-white/[0.03]
                  hover:shadow-xl ${colors.hoverGlow} hover:-translate-y-0.5
                  active:scale-[0.99] ${colors.border} ${colors.activeBorder}
                  cursor-pointer
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${150 + i * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${colors.iconBg}`}>
                    <Icon size={22} className={`${colors.iconColor} transition-transform duration-300 group-hover/card:scale-110`} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-heading mb-0.5 group-hover/card:text-heading transition-colors">
                      {option.label[lang]}
                    </h3>
                    <p className="text-[13px] text-muted leading-relaxed line-clamp-2">
                      {option.description[lang]}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-border/20 flex items-center justify-center transition-all duration-300 group-hover/card:bg-royal/10 dark:group-hover/card:bg-bright/10">
                    <Arrow size={14} className="text-muted/50 transition-all duration-300 group-hover/card:text-royal dark:group-hover/card:text-bright" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[11px] text-muted/40 font-medium uppercase tracking-widest">{t.or}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Login link */}
        <Link
          to="/auth/login"
          className="block w-full text-center px-8 py-3 rounded-xl text-sm font-semibold text-muted hover:text-heading border border-royal/10 dark:border-white/[0.08] hover:border-royal/20 dark:hover:border-white/[0.12] bg-white/40 dark:bg-white/[0.02] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all duration-300"
        >
          {t.alreadyHaveAccount} <span className="text-royal dark:text-bright">{t.login}</span>
        </Link>
      </div>
    </AuthLayout>
  );
}
