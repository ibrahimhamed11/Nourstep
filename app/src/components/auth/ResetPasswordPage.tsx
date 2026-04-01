/**
 * ResetPasswordPage — Enter new password using a token from the reset email link.
 * Premium design with animated states and strength indicator.
 */
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Lock, ShieldCheck, CheckCircle, AlertCircle, Loader2, LinkIcon } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import { authI18n } from '../../auth.i18n';
import { resetPasswordSchema } from '../../auth.validation';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import PasswordStrength from './PasswordStrength';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function ResetPasswordPage({ lang, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema(lang),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      try {
        const res = await fetch('/api/v1/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(lang === 'ar' ? data.message_ar : data.message);
          return;
        }

        setIsSuccess(true);
      } catch {
        setServerError(
          lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (isSuccess) {
    return (
      <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/15 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/10">
            <CheckCircle size={36} className="text-success" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-2 tracking-tight">
            {t.resetSuccess}
          </h1>
          <p className="text-muted text-[14px] mb-8 leading-relaxed max-w-xs mx-auto">
            {t.resetSuccessSubtitle}
          </p>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-royal via-bright to-sky bg-[length:200%_100%] bg-left hover:bg-right shadow-lg shadow-royal/20 transition-all duration-500"
          >
            {t.login}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // No token provided
  if (!token) {
    return (
      <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-error/10 to-error/5 border border-error/15 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-error/10">
            <LinkIcon size={36} className="text-error" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-2 tracking-tight">
            {lang === 'ar' ? 'رابط غير صالح' : 'Invalid Link'}
          </h1>
          <p className="text-muted text-[14px] mb-8 leading-relaxed max-w-xs mx-auto">
            {lang === 'ar'
              ? 'رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية.'
              : 'This password reset link is invalid or has expired.'}
          </p>
          <Link
            to="/auth/forgot-password"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-royal via-bright to-sky bg-[length:200%_100%] bg-left hover:bg-right shadow-lg shadow-royal/20 transition-all duration-500"
          >
            {lang === 'ar' ? 'طلب رابط جديد' : 'Request New Link'}
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
            <ShieldCheck size={24} className="text-royal dark:text-bright" />
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-heading font-bold text-heading mb-2 tracking-tight">
            {t.resetPassword}
          </h1>
          <p className="text-muted text-[14px] leading-relaxed max-w-xs mx-auto">{t.resetPasswordSubtitle}</p>
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
            id="password"
            name="password"
            label={t.newPassword}
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            dir="ltr"
          />

          <PasswordStrength
            password={formik.values.password}
            labels={{
              label: t.passwordStrength,
              weak: t.weak,
              medium: t.medium,
              strong: t.strong,
            }}
          />

          <AuthInput
            id="confirmPassword"
            name="confirmPassword"
            label={t.confirmNewPassword}
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
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
              {isLoading ? t.submitting : t.resetPassword}
            </span>
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
