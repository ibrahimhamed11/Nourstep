/**
 * NourStep Auth Validation Schemas (Yup)
 * Used by Formik forms across all auth pages.
 */
import * as Yup from 'yup';
import type { Lang } from './types';

const msg = (en: string, ar: string, lang: Lang) => (lang === 'ar' ? ar : en);

/* ─── Shared Field Validators ─── */
const fullName = (lang: Lang) =>
  Yup.string()
    .trim()
    .min(3, msg('Name must be at least 3 characters', 'الاسم يجب أن يكون ٣ أحرف على الأقل', lang))
    .max(100, msg('Name is too long', 'الاسم طويل جدًا', lang))
    .required(msg('Full name is required', 'الاسم الكامل مطلوب', lang));

const email = (lang: Lang) =>
  Yup.string()
    .trim()
    .email(msg('Enter a valid email', 'أدخل بريد إلكتروني صالح', lang))
    .required(msg('Email is required', 'البريد الإلكتروني مطلوب', lang));

const password = (lang: Lang) =>
  Yup.string()
    .min(8, msg('Password must be at least 8 characters', 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل', lang))
    .matches(/[a-z]/, msg('Must contain a lowercase letter', 'يجب أن تحتوي على حرف صغير', lang))
    .matches(/[A-Z]/, msg('Must contain an uppercase letter', 'يجب أن تحتوي على حرف كبير', lang))
    .matches(/\d/, msg('Must contain a number', 'يجب أن تحتوي على رقم', lang))
    .required(msg('Password is required', 'كلمة المرور مطلوبة', lang));

const confirmPassword = (lang: Lang) =>
  Yup.string()
    .oneOf(
      [Yup.ref('password')],
      msg('Passwords do not match', 'كلمات المرور غير متطابقة', lang)
    )
    .required(msg('Confirm your password', 'تأكيد كلمة المرور مطلوب', lang));

const phone = (lang: Lang) =>
  Yup.string()
    .matches(
      /^[+]?[\d\s\-()]{8,20}$/,
      msg('Enter a valid phone number', 'أدخل رقم هاتف صالح', lang)
    )
    .required(msg('Phone number is required', 'رقم الهاتف مطلوب', lang));

/* ─── Login Schema ─── */
export const loginSchema = (lang: Lang) =>
  Yup.object({
    email: email(lang),
    password: Yup.string()
      .min(6, msg('Password must be at least 6 characters', 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل', lang))
      .required(msg('Password is required', 'كلمة المرور مطلوبة', lang)),
  });

/* ─── Teacher Registration Schema ─── */
export const teacherRegistrationSchema = (lang: Lang) =>
  Yup.object({
    fullName: fullName(lang),
    email: email(lang),
    password: password(lang),
    confirmPassword: confirmPassword(lang),
    phone: phone(lang),
    subject: Yup.string()
      .trim()
      .min(2, msg('Subject is too short', 'المادة قصيرة جدًا', lang))
      .required(msg('Subject is required', 'المادة مطلوبة', lang)),
    experience: Yup.string()
      .required(msg('Experience level is required', 'مستوى الخبرة مطلوب', lang)),
    location: Yup.string()
      .trim()
      .min(2, msg('Location is too short', 'الموقع قصير جدًا', lang))
      .max(200, msg('Location is too long', 'الموقع طويل جدًا', lang))
      .required(msg('Location is required', 'الموقع مطلوب', lang)),
  });

/* ─── Student Registration Schema ─── */
export const studentRegistrationSchema = (lang: Lang) =>
  Yup.object({
    fullName: fullName(lang),
    email: email(lang),
    password: password(lang),
    confirmPassword: confirmPassword(lang),
    phone: phone(lang),
    gradeLevel: Yup.string()
      .required(msg('Grade level is required', 'المرحلة الدراسية مطلوبة', lang)),
    parentEmail: Yup.string()
      .email(msg('Enter a valid email', 'أدخل بريد إلكتروني صالح', lang))
      .notRequired(),
  });

/* ─── Parent Registration Schema ─── */
export const parentRegistrationSchema = (lang: Lang) =>
  Yup.object({
    fullName: fullName(lang),
    email: email(lang),
    password: password(lang),
    confirmPassword: confirmPassword(lang),
    phone: phone(lang),
    numberOfChildren: Yup.number()
      .min(1, msg('At least 1 child', 'طفل واحد على الأقل', lang))
      .max(10, msg('Maximum 10 children', 'الحد الأقصى ١٠ أطفال', lang))
      .required(msg('Number of children is required', 'عدد الأطفال مطلوب', lang)),
    childInviteCode: Yup.string().notRequired(),
  });

/* ─── Confirm Account Schema ─── */
export const confirmAccountSchema = (lang: Lang) =>
  Yup.object({
    code: Yup.string()
      .matches(/^\d{6}$/, msg('Code must be 6 digits', 'الكود يجب أن يكون ٦ أرقام', lang))
      .required(msg('Confirmation code is required', 'كود التأكيد مطلوب', lang)),
  });

/* ─── Forgot Password Schema ─── */
export const forgotPasswordSchema = (lang: Lang) =>
  Yup.object({
    email: email(lang),
  });

/* ─── Reset Password Schema ─── */
export const resetPasswordSchema = (lang: Lang) =>
  Yup.object({
    password: password(lang),
    confirmPassword: confirmPassword(lang),
  });
