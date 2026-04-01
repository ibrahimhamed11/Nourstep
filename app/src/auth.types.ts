import type { I18n } from './types';

/* ─── User Roles ─── */
export type UserRole = 'teacher' | 'student' | 'parent';

export type AccountStatus = 'pending' | 'active' | 'suspended';

/* ─── Auth Types ─── */
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  locale: 'ar' | 'en';
  createdAt: string;
  lastLoginAt?: string;
}

/* ─── Registration ─── */
export interface BaseRegistration {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface TeacherRegistration extends BaseRegistration {
  role: 'teacher';
  subject: string;
  experience: string;
  location: string;
}

export interface StudentRegistration extends BaseRegistration {
  role: 'student';
  gradeLevel: string;
  parentEmail?: string;
}

export interface ParentRegistration extends BaseRegistration {
  role: 'parent';
  numberOfChildren: number;
  childInviteCode?: string;
}

export type RegistrationData =
  | TeacherRegistration
  | StudentRegistration
  | ParentRegistration;

/* ─── Login ─── */
export interface LoginData {
  email: string;
  password: string;
}

/* ─── Confirm Account ─── */
export interface ConfirmAccountData {
  email: string;
  code: string;
}

/* ─── Password Reset ─── */
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

/* ─── API Response ─── */
export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  message_ar: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

/* ─── Role Display Info ─── */
export interface RoleOption {
  role: UserRole;
  icon: string;
  label: I18n<string>;
  description: I18n<string>;
  color: string;
}

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'teacher',
    icon: '👨‍🏫',
    label: { en: 'Teacher', ar: 'معلم' },
    description: {
      en: 'Create courses, track student progress, and build your professional profile',
      ar: 'أنشئ دوراتك، تابع تقدّم طلابك، وابنِ ملفك المهني',
    },
    color: 'bright',
  },
  {
    role: 'student',
    icon: '👨‍🎓',
    label: { en: 'Student', ar: 'طالب' },
    description: {
      en: 'Access courses, get AI study help, and track your learning journey',
      ar: 'تابع دوراتك، واحصل على مساعدة دراسية ذكية، وتتبّع رحلة تعلّمك',
    },
    color: 'sky',
  },
  {
    role: 'parent',
    icon: '👨‍👩‍👧',
    label: { en: 'Parent', ar: 'ولي أمر' },
    description: {
      en: "Monitor your child's progress, get grade reports and instant alerts",
      ar: 'تابع تقدّم أبنائك، واحصل على تقارير الدرجات والتنبيهات الفورية',
    },
    color: 'success',
  },
];

/* ─── Experience Options ─── */
export const EXPERIENCE_OPTIONS: { value: string; label: I18n<string> }[] = [
  { value: '0-1', label: { en: 'Less than 1 year', ar: 'أقل من سنة' } },
  { value: '1-3', label: { en: '1–3 years', ar: '١–٣ سنوات' } },
  { value: '3-5', label: { en: '3–5 years', ar: '٣–٥ سنوات' } },
  { value: '5-10', label: { en: '5–10 years', ar: '٥–١٠ سنوات' } },
  { value: '10+', label: { en: '10+ years', ar: 'أكثر من ١٠ سنوات' } },
];

/* ─── Grade Level Options ─── */
export const GRADE_LEVEL_OPTIONS: { value: string; label: I18n<string> }[] = [
  { value: 'primary', label: { en: 'Primary School', ar: 'المرحلة الابتدائية' } },
  { value: 'preparatory', label: { en: 'Preparatory School', ar: 'المرحلة الإعدادية' } },
  { value: 'secondary', label: { en: 'Secondary School', ar: 'المرحلة الثانوية' } },
  { value: 'university', label: { en: 'University', ar: 'الجامعة' } },
  { value: 'other', label: { en: 'Other', ar: 'أخرى' } },
];
