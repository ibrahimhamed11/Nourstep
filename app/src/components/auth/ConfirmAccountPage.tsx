/**
 * ConfirmAccountPage — 6-digit code verification after registration.
 * Premium OTP input with animated success state.
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { ShieldCheck, CheckCircle, AlertCircle, RefreshCw, Loader2, Mail as MailIcon } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import { authI18n } from '../../auth.i18n';
import { confirmAccountSchema } from '../../auth.validation';
import AuthLayout from './AuthLayout';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function ConfirmAccountPage({ lang, theme, setLang, setTheme }: Props) {
  const t = authI18n[lang];
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formik = useFormik({
    initialValues: { code: '' },
    validationSchema: confirmAccountSchema(lang),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      try {
        const res = await fetch('/api/v1/auth/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: values.code }),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(lang === 'ar' ? data.message_ar : data.message);
          return;
        }

        setIsSuccess(true);
        setTimeout(() => navigate('/auth/login'), 2000);
      } catch {
        setServerError(
          lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle individual digit input
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    const code = newDigits.join('');
    formik.setFieldValue('code', code);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setDigits(newDigits);
    formik.setFieldValue('code', pasted);
    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      const res = await fetch('/api/v1/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResendMessage(t.codeResent);
        setResendCooldown(60);
        setTimeout(() => setResendMessage(''), 4000);
      }
    } catch {
      // Silently fail
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/15 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success/10">
            <CheckCircle size={36} className="text-success" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-heading mb-2 tracking-tight">
            {lang === 'ar' ? 'تم تأكيد الحساب!' : 'Account Confirmed!'}
          </h1>
          <p className="text-muted text-[14px] mb-6 leading-relaxed">
            {lang === 'ar'
              ? 'جاري تحويلك لصفحة تسجيل الدخول...'
              : 'Redirecting you to login...'}
          </p>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-success/30 border-t-success rounded-full animate-spin" />
          </div>
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
            {t.confirmAccount}
          </h1>
          <p className="text-muted text-[14px] leading-relaxed">{t.confirmSubtitle}</p>
          {email && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-royal/5 dark:bg-bright/5 border border-royal/10 dark:border-bright/10">
              <MailIcon size={13} className="text-royal dark:text-bright" />
              <span className="text-[13px] text-royal dark:text-bright font-mono font-medium" dir="ltr">
                {email}
              </span>
            </div>
          )}
        </div>

        {/* Errors */}
        {serverError && (
          <div className="mb-5 p-4 rounded-xl bg-error/8 border border-error/15 flex items-start gap-3 backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle size={12} className="text-error" />
            </div>
            <p className="text-[13px] text-error/90 font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Resend success */}
        {resendMessage && (
          <div className="mb-5 p-4 rounded-xl bg-success/8 border border-success/15 flex items-start gap-3 backdrop-blur-sm">
            <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle size={12} className="text-success" />
            </div>
            <p className="text-[13px] text-success/90 font-medium">{resendMessage}</p>
          </div>
        )}

        {/* Code input */}
        <form onSubmit={formik.handleSubmit} noValidate>
          <label className="block text-[13px] font-semibold text-heading/80 mb-3 text-center">
            {t.enterCode}
          </label>

          <div className="flex justify-center gap-2 sm:gap-3 mb-2" dir="ltr" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`
                  w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl
                  bg-white/70 dark:bg-white/[0.04] border-2 transition-all duration-200 outline-none
                  text-heading
                  ${digit ? 'scale-105 shadow-sm' : ''}
                  ${
                    formik.touched.code && formik.errors.code
                      ? 'border-error/40 focus:border-error/70 focus:ring-2 focus:ring-error/15'
                      : 'border-royal/10 dark:border-white/[0.08] focus:border-royal/50 dark:focus:border-bright/40 focus:ring-2 focus:ring-royal/10 dark:focus:ring-bright/10'
                  }
                `}
              />
            ))}
          </div>

          {formik.touched.code && formik.errors.code && (
            <p className="text-[11px] text-error text-center mb-4 font-medium">{formik.errors.code}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || digits.join('').length < 6}
            className={`
              group/btn relative w-full overflow-hidden rounded-xl py-3.5 mt-4 text-[15px] font-bold text-white
              bg-gradient-to-r from-royal via-bright to-sky
              bg-[length:200%_100%] bg-left hover:bg-right
              shadow-lg shadow-royal/20 dark:shadow-bright/15
              transition-all duration-500 ease-out
              active:scale-[0.98]
              ${isLoading || digits.join('').length < 6
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-xl hover:shadow-royal/25 dark:hover:shadow-bright/20'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? t.submitting : t.submit}
            </span>
          </button>
        </form>

        {/* Resend code */}
        <div className="text-center mt-7">
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`inline-flex items-center gap-2 text-[13px] font-medium transition-all duration-200 ${
              resendCooldown > 0
                ? 'text-muted/40 cursor-not-allowed'
                : 'text-royal dark:text-bright hover:text-royal/80 dark:hover:text-bright/80'
            }`}
          >
            <RefreshCw size={14} className={resendCooldown > 0 ? '' : 'hover:rotate-90 transition-transform duration-300'} />
            {resendCooldown > 0
              ? `${t.resendIn} ${resendCooldown}s`
              : t.resendCode}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Back to login */}
        <Link
          to="/auth/login"
          className="block w-full text-center px-8 py-3 rounded-xl text-[13px] font-semibold text-muted hover:text-heading border border-royal/10 dark:border-white/[0.08] hover:border-royal/20 dark:hover:border-white/[0.12] bg-white/40 dark:bg-white/[0.02] hover:bg-white/60 dark:hover:bg-white/[0.04] transition-all duration-300"
        >
          {t.backToLogin}
        </Link>
      </div>
    </AuthLayout>
  );
}
