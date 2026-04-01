/**
 * RegisterPage — Role-specific registration form.
 * Premium form with role badge, section dividers, and animated submit.
 */
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Mail, Lock, User, Phone, MapPin, BookOpen, AlertCircle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Lang, Theme } from '../../types';
import type { UserRole } from '../../auth.types';
import { ROLE_OPTIONS, EXPERIENCE_OPTIONS, GRADE_LEVEL_OPTIONS } from '../../auth.types';
import { authI18n } from '../../auth.i18n';
import {
  teacherRegistrationSchema,
  studentRegistrationSchema,
  parentRegistrationSchema,
} from '../../auth.validation';
import AuthLayout from './AuthLayout';
import AuthInput from './AuthInput';
import { AuthSelect } from './AuthInput';
import PasswordStrength from './PasswordStrength';

interface Props {
  lang: Lang;
  theme: Theme;
  setLang?: (l: Lang) => void;
  setTheme?: (t: Theme) => void;
}

export default function RegisterPage({ lang, theme, setLang, setTheme }: Props) {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const t = authI18n[lang];
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate role
  const validRoles: UserRole[] = ['teacher', 'student', 'parent'];
  const currentRole = validRoles.includes(role as UserRole) ? (role as UserRole) : null;

  if (!currentRole) {
    navigate('/auth/register');
    return null;
  }

  const roleInfo = ROLE_OPTIONS.find((r) => r.role === currentRole)!;

  // Pick the correct validation schema
  const schemaMap = {
    teacher: teacherRegistrationSchema,
    student: studentRegistrationSchema,
    parent: parentRegistrationSchema,
  };

  // Initial values per role
  const initialValuesMap = {
    teacher: {
      fullName: '', email: '', password: '', confirmPassword: '',
      phone: '', subject: '', experience: '', location: '',
    },
    student: {
      fullName: '', email: '', password: '', confirmPassword: '',
      phone: '', gradeLevel: '', parentEmail: '',
    },
    parent: {
      fullName: '', email: '', password: '', confirmPassword: '',
      phone: '', numberOfChildren: 1, childInviteCode: '',
    },
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formik = useFormik({
    initialValues: initialValuesMap[currentRole],
    validationSchema: schemaMap[currentRole](lang),
    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError('');

      try {
        const body = { ...values, role: currentRole };
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          setServerError(lang === 'ar' ? data.message_ar : data.message);
          return;
        }

        // Redirect to confirm account page
        navigate(`/auth/confirm?email=${encodeURIComponent(values.email)}`);
      } catch {
        setServerError(
          lang === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AuthLayout lang={lang} theme={theme} setLang={setLang} setTheme={setTheme}>
      <div>
        {/* Header with role badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-royal/6 to-bright/6 dark:from-bright/6 dark:to-sky/6 border border-royal/10 dark:border-bright/10 mb-4 backdrop-blur-sm">
            <roleInfo.icon size={16} className="text-royal dark:text-sky shrink-0" />
            <span className="text-[13px] font-bold text-royal dark:text-sky tracking-wide">
              {t.continueAs} {roleInfo.label[lang]}
            </span>
          </div>
          <h1 className="text-2xl md:text-[1.75rem] font-heading font-bold text-heading mb-1 tracking-tight">
            {t.register}
          </h1>
        </div>

        {/* Server error */}
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
          {/* ── Common Fields ── */}
          <AuthInput
            id="fullName"
            name="fullName"
            label={t.fullName}
            icon={User}
            placeholder={lang === 'ar' ? 'أحمد محمد' : 'John Doe'}
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.fullName as string}
            touched={formik.touched.fullName as boolean}
          />

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
            error={formik.errors.email as string}
            touched={formik.touched.email as boolean}
            dir="ltr"
          />

          <AuthInput
            id="phone"
            name="phone"
            label={t.phone}
            type="tel"
            icon={Phone}
            placeholder="+201234567890"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.phone as string}
            touched={formik.touched.phone as boolean}
            dir="ltr"
          />

          {/* ── Role-Specific Fields ── */}
          {currentRole === 'teacher' && (
            <>
              <AuthInput
                id="subject"
                name="subject"
                label={t.subject}
                icon={BookOpen}
                placeholder={t.subjectPlaceholder}
                value={(formik.values as typeof initialValuesMap.teacher).subject}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).subject}
                touched={(formik.touched as Record<string, boolean>).subject}
              />

              <AuthSelect
                id="experience"
                name="experience"
                label={t.experience}
                value={(formik.values as typeof initialValuesMap.teacher).experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).experience}
                touched={(formik.touched as Record<string, boolean>).experience}
                options={EXPERIENCE_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label[lang],
                }))}
                placeholder={lang === 'ar' ? 'اختر مستوى الخبرة' : 'Select experience level'}
              />

              <AuthInput
                id="location"
                name="location"
                label={t.location}
                icon={MapPin}
                placeholder={t.locationPlaceholder}
                value={(formik.values as typeof initialValuesMap.teacher).location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).location}
                touched={(formik.touched as Record<string, boolean>).location}
              />
            </>
          )}

          {currentRole === 'student' && (
            <>
              <AuthSelect
                id="gradeLevel"
                name="gradeLevel"
                label={t.gradeLevel}
                value={(formik.values as typeof initialValuesMap.student).gradeLevel}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).gradeLevel}
                touched={(formik.touched as Record<string, boolean>).gradeLevel}
                options={GRADE_LEVEL_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label[lang],
                }))}
                placeholder={lang === 'ar' ? 'اختر المرحلة الدراسية' : 'Select education level'}
              />

              <AuthInput
                id="parentEmail"
                name="parentEmail"
                label={t.parentEmail}
                type="email"
                icon={Mail}
                placeholder="parent@example.com"
                value={(formik.values as typeof initialValuesMap.student).parentEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).parentEmail}
                touched={(formik.touched as Record<string, boolean>).parentEmail}
                helper={t.parentEmailHelper}
                dir="ltr"
              />
            </>
          )}

          {currentRole === 'parent' && (
            <>
              <AuthInput
                id="numberOfChildren"
                name="numberOfChildren"
                label={t.numberOfChildren}
                type="number"
                value={String((formik.values as typeof initialValuesMap.parent).numberOfChildren)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).numberOfChildren}
                touched={(formik.touched as Record<string, boolean>).numberOfChildren}
              />

              <AuthInput
                id="childInviteCode"
                name="childInviteCode"
                label={t.childInviteCode}
                placeholder="ABC123"
                value={(formik.values as typeof initialValuesMap.parent).childInviteCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors as Record<string, string>).childInviteCode}
                touched={(formik.touched as Record<string, boolean>).childInviteCode}
                helper={t.childInviteCodeHelper}
                dir="ltr"
              />
            </>
          )}

          {/* ── Password Fields ── */}
          <AuthInput
            id="password"
            name="password"
            label={t.password}
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password as string}
            touched={formik.touched.password as boolean}
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
            label={t.confirmPassword}
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword as string}
            touched={formik.touched.confirmPassword as boolean}
            dir="ltr"
          />

          {/* Terms */}
          <p className="text-[11px] text-muted/50 mb-5 leading-relaxed">
            {t.termsAgree}{' '}
            <a href="#" className="text-royal dark:text-bright hover:underline font-medium">
              {t.termsLink}
            </a>{' '}
            &{' '}
            <a href="#" className="text-royal dark:text-bright hover:underline font-medium">
              {t.privacyLink}
            </a>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              group/btn relative w-full overflow-hidden rounded-xl py-3.5 text-[15px] font-bold text-white
              bg-gradient-to-r from-royal via-bright to-sky
              bg-[length:200%_100%] bg-left hover:bg-right
              shadow-lg shadow-royal/20 dark:shadow-bright/15
              transition-all duration-500 ease-out
              active:scale-[0.98]
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-royal/25 dark:hover:shadow-bright/20'}
            `}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              {isLoading ? t.submitting : t.submit}
            </span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Back to role selection & Login */}
        <div className="text-center space-y-3">
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-heading transition-colors font-medium"
          >
            {lang === 'ar' ? (
              <>
                {lang === 'ar' ? 'تغيير نوع الحساب' : 'Change account type'}
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <ArrowLeft size={14} />
                Change account type
              </>
            )}
          </Link>
          <p className="text-[13px] text-muted">
            {t.alreadyHaveAccount}{' '}
            <Link
              to="/auth/login"
              className="text-royal dark:text-bright font-bold hover:underline"
            >
              {t.login}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
