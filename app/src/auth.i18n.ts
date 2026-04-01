/**
 * NourStep Auth i18n — all auth-related translations
 */
import type { I18n } from './types';

interface AuthI18n {
  /* ─── Common ─── */
  login: string;
  register: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  submit: string;
  submitting: string;
  or: string;
  backToLogin: string;
  backToHome: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;

  /* ─── Role Selection ─── */
  chooseAccountType: string;
  chooseAccountSubtitle: string;
  continueAs: string;

  /* ─── Teacher Fields ─── */
  subject: string;
  subjectPlaceholder: string;
  experience: string;
  location: string;
  locationPlaceholder: string;

  /* ─── Student Fields ─── */
  gradeLevel: string;
  parentEmail: string;
  parentEmailHelper: string;

  /* ─── Parent Fields ─── */
  numberOfChildren: string;
  childInviteCode: string;
  childInviteCodeHelper: string;

  /* ─── Login Page ─── */
  welcomeBack: string;
  loginSubtitle: string;
  forgotPassword: string;
  rememberMe: string;
  loginError: string;
  accountNotConfirmed: string;

  /* ─── Confirm Account ─── */
  confirmAccount: string;
  confirmSubtitle: string;
  enterCode: string;
  resendCode: string;
  resendIn: string;
  codeResent: string;
  codePlaceholder: string;

  /* ─── Forgot Password ─── */
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  sendResetLink: string;
  resetLinkSent: string;
  resetLinkSentSubtitle: string;

  /* ─── Reset Password ─── */
  resetPassword: string;
  resetPasswordSubtitle: string;
  newPassword: string;
  confirmNewPassword: string;
  resetSuccess: string;
  resetSuccessSubtitle: string;

  /* ─── Misc ─── */
  passwordStrength: string;
  weak: string;
  medium: string;
  strong: string;
  termsAgree: string;
  termsLink: string;
  privacyLink: string;
}

export const authI18n: I18n<AuthI18n> = {
  en: {
    login: 'Login',
    register: 'Register',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    submit: 'Continue',
    submitting: 'Please wait...',
    or: 'or',
    backToLogin: 'Back to Login',
    backToHome: 'Back to Home',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",

    chooseAccountType: 'Create Your Account',
    chooseAccountSubtitle: 'Choose how you want to use NourStep',
    continueAs: 'Continue as',

    subject: 'Subject Specialization',
    subjectPlaceholder: 'e.g. Mathematics, Physics, Arabic...',
    experience: 'Years of Experience',
    location: 'City / Area',
    locationPlaceholder: 'e.g. Cairo, Egypt',

    gradeLevel: 'Education Level',
    parentEmail: 'Parent Email (optional)',
    parentEmailHelper: 'Link your account with your parent for progress sharing',

    numberOfChildren: 'Number of Children',
    childInviteCode: 'Child Invite Code (optional)',
    childInviteCodeHelper: 'Enter the code shared by your child\'s teacher to instantly link accounts',

    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to continue your learning journey',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember me',
    loginError: 'Invalid email or password',
    accountNotConfirmed: 'Your account is not confirmed yet. Check your email.',

    confirmAccount: 'Confirm Your Account',
    confirmSubtitle: 'We sent a 6-digit code to your email',
    enterCode: 'Enter Confirmation Code',
    resendCode: 'Resend Code',
    resendIn: 'Resend in',
    codeResent: 'New code sent to your email!',
    codePlaceholder: '000000',

    forgotPasswordTitle: 'Forgot Your Password?',
    forgotPasswordSubtitle: "No worries! Enter your email and we'll send you a reset link.",
    sendResetLink: 'Send Reset Link',
    resetLinkSent: 'Check Your Email',
    resetLinkSentSubtitle: 'If an account exists with that email, we sent a password reset link.',

    resetPassword: 'Reset Your Password',
    resetPasswordSubtitle: 'Choose a strong new password for your account.',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    resetSuccess: 'Password Reset!',
    resetSuccessSubtitle: 'Your password has been updated successfully. You can now log in.',

    passwordStrength: 'Password Strength',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    termsAgree: 'By registering, you agree to our',
    termsLink: 'Terms of Service',
    privacyLink: 'Privacy Policy',
  },
  ar: {
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    submit: 'متابعة',
    submitting: 'يرجى الانتظار...',
    or: 'أو',
    backToLogin: 'العودة لتسجيل الدخول',
    backToHome: 'العودة للرئيسية',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',

    chooseAccountType: 'أنشئ حسابك',
    chooseAccountSubtitle: 'اختر كيف تريد استخدام خطوة للنور',
    continueAs: 'متابعة كـ',

    subject: 'التخصص الدراسي',
    subjectPlaceholder: 'مثال: رياضيات، فيزياء، لغة عربية...',
    experience: 'سنوات الخبرة',
    location: 'المدينة / المنطقة',
    locationPlaceholder: 'مثال: القاهرة، مصر',

    gradeLevel: 'المرحلة الدراسية',
    parentEmail: 'بريد ولي الأمر (اختياري)',
    parentEmailHelper: 'اربط حسابك بولي أمرك لمشاركة التقدّم',

    numberOfChildren: 'عدد الأطفال',
    childInviteCode: 'كود دعوة الطفل (اختياري)',
    childInviteCodeHelper: 'أدخل الكود الذي شاركه معلم طفلك لربط الحسابات فورًا',

    welcomeBack: 'مرحبًا بعودتك',
    loginSubtitle: 'سجّل دخولك لمتابعة رحلتك التعليمية',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    accountNotConfirmed: 'حسابك غير مؤكد بعد. تحقق من بريدك الإلكتروني.',

    confirmAccount: 'تأكيد حسابك',
    confirmSubtitle: 'أرسلنا كود مكون من ٦ أرقام إلى بريدك الإلكتروني',
    enterCode: 'أدخل كود التأكيد',
    resendCode: 'إعادة إرسال الكود',
    resendIn: 'إعادة الإرسال خلال',
    codeResent: 'تم إرسال كود جديد إلى بريدك!',
    codePlaceholder: '٠٠٠٠٠٠',

    forgotPasswordTitle: 'نسيت كلمة المرور؟',
    forgotPasswordSubtitle: 'لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.',
    sendResetLink: 'إرسال رابط إعادة التعيين',
    resetLinkSent: 'تحقق من بريدك الإلكتروني',
    resetLinkSentSubtitle: 'إذا كان هناك حساب مرتبط بهذا البريد، فقد أرسلنا رابط إعادة تعيين كلمة المرور.',

    resetPassword: 'إعادة تعيين كلمة المرور',
    resetPasswordSubtitle: 'اختر كلمة مرور قوية جديدة لحسابك.',
    newPassword: 'كلمة المرور الجديدة',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    resetSuccess: 'تم إعادة تعيين كلمة المرور!',
    resetSuccessSubtitle: 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.',

    passwordStrength: 'قوة كلمة المرور',
    weak: 'ضعيفة',
    medium: 'متوسطة',
    strong: 'قوية',
    termsAgree: 'بالتسجيل، أنت توافق على',
    termsLink: 'شروط الخدمة',
    privacyLink: 'سياسة الخصوصية',
  },
};
