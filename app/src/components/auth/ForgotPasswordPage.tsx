/**
 * ForgotPasswordPage — Enter email to request a password reset link.
 * Premium design with animated success state.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, KeyRound, CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import { authI18n } from '../../auth.i18n';
import { forgotPasswordSchema } from '../../auth.validation';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function ForgotPasswordPage({ lang, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const BackArrow = lang === 'ar' ? ArrowRight : ArrowLeft;

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: forgotPasswordSchema(lang),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      try {
        const res = await fetch('/api/v1/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const data = await res.json();
          setServerError(lang === 'ar' ? data.message_ar : data.message);
          return;
        }

        setIsSent(true);
      } catch {
        setServerError(
          lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSent) {
    return (
      <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/15 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/10">
            <CheckCircle size={36} className="text-success" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-2 tracking-tight">
            {t.resetLinkSent}
          </h1>
          <p className="text-muted text-[14px] mb-8 leading-relaxed max-w-xs mx-auto">
            {t.resetLinkSentSubtitle}
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-royal via-bright to-sky bg-[length:200%_100%] bg-left hover:bg-right shadow-lg shadow-royal/20 transition-all duration-500"
          >
            {t.backToLogin}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-royal/10 to-bright/10 dark:from-bright/10 dark:to-sky/10 border border-royal/10 dark:border-bright/10 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <KeyRound size={24} className="text-royal dark:text-bright" />
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-heading font-bold text-heading mb-2 tracking-tight">
            {t.forgotPasswordTitle}
          </h1>
          <p className="text-muted text-[14px] leading-relaxed max-w-xs mx-auto">{t.forgotPasswordSubtitle}</p>
        </div>

        {/* Error */}
        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-error/8 border border-error/15 flex items-start gap-3 backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={12} className="text-error" />
            </div>
            <p className="text-[13px] text-error/90 font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit} noValidate>
          <AuthInput
            id="email"
            name="email"
            label={t.email}
            type="email"
            icon={Mail}
            placeholder="name@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            dir="ltr"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`
              group/btn relative w-full overflow-hidden rounded-xl py-3.5 mt-2 text-[15px] font-bold text-white
              bg-gradient-to-r from-royal via-bright to-sky
              bg-[length:200%_100%] bg-left hover:bg-right
              shadow-lg shadow-royal/20 dark:shadow-bright/15
              transition-all duration-500 ease-out
              active:scale-[0.98]
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-royal/25 dark:hover:shadow-bright/20'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? t.submitting : t.sendResetLink}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Back to login */}
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 w-full text-center px-8 py-3 rounded-xl text-[13px] font-semibold text-muted hover:text-heading border border-border/30 hover:border-border/50 bg-transparent hover:bg-surface/50 dark:hover:bg-card-dark/30 transition-all duration-300"
        >
          <BackArrow size={14} />
          {t.backToLogin}
        </Link>
      </div>
    </AuthLayout>
  );
}
