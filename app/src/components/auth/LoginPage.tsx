/**
 * Login Page — email/password login with bilingual support.
 * Premium glassmorphic design with smooth animations.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import { authI18n } from '../../auth.i18n';
import { loginSchema } from '../../auth.validation';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function LoginPage({ lang, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema(lang),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            navigate(`/auth/confirm?email=${encodeURIComponent(values.email)}`);
            return;
          }
          setServerError(lang === 'ar' ? data.message_ar : data.message);
          return;
        }

        localStorage.setItem('nourstep-token', data.data.token);
        navigate('/dashboard');
      } catch {
        setServerError(t.loginError);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal/10 to-bright/10 dark:from-bright/10 dark:to-sky/10 border border-royal/10 dark:border-bright/10 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Lock size={24} className="text-royal dark:text-bright" />
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-heading font-bold text-heading mb-2 tracking-tight">
            {t.welcomeBack}
          </h1>
          <p className="text-muted text-[15px] leading-relaxed">{t.loginSubtitle}</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-error/8 border border-error/15 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={12} className="text-error" />
            </div>
            <p className="text-[13px] text-error/90 font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-0">
          <AuthInput
            id="email"
            name="email"
            label={t.email}
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            dir="ltr"
          />

          <AuthInput
            id="password"
            name="password"
            label={t.password}
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            dir="ltr"
          />

          {/* Forgot password link */}
          <div className="flex justify-end mb-6 -mt-1">
            <Link
              to="/auth/forgot-password"
              className="text-[13px] font-medium text-royal dark:text-bright hover:underline underline-offset-2 transition-colors"
            >
              {t.forgotPassword}
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              group/btn relative w-full overflow-hidden rounded-xl py-3.5
              text-[15px] font-bold text-white
              bg-gradient-to-r from-royal via-bright to-sky
              bg-[length:200%_100%] bg-left hover:bg-right
              shadow-lg shadow-royal/20 dark:shadow-bright/15
              transition-all duration-500 ease-out
              active:scale-[0.98]
              ${isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:shadow-xl hover:shadow-royal/25 dark:hover:shadow-bright/20'
              }
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              {isLoading ? t.submitting : t.login}
              {!isLoading && <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5" />}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[11px] text-muted/40 font-medium uppercase tracking-widest">{t.or}</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Register link as styled button */}
        <Link
          to="/auth/register"
          className="group block w-full text-center px-8 py-3.5 rounded-xl text-base font-semibold text-heading border border-royal/10 dark:border-white/[0.08] hover:border-royal/20 dark:hover:border-white/[0.12] bg-white/40 dark:bg-white/[0.02] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all duration-300 hover:shadow-md hover:shadow-royal/5"
        >
          <span className="flex items-center justify-center gap-2">
            {t.register}
            <ArrowRight size={15} className="text-muted group-hover:text-royal dark:group-hover:text-bright transition-all duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </span>
        </Link>

        <p className="text-center text-[13px] text-muted/60 mt-5">
          {t.dontHaveAccount}
        </p>
      </div>
    </AuthLayout>
  );
}
