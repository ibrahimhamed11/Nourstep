import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, User, Phone, MapPin, CheckCircle, Crown, Zap, Star, Clock, AlertTriangle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Lang, I18n } from '../types';

const LAUNCH_DATE = new Date('2026-06-12T00:00:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const diff = LAUNCH_DATE.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function toArabicNumerals(num: number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).padStart(2, '0').split('').map(d => arabicDigits[parseInt(d)] || d).join('');
}

interface LabelSet { days: string; hours: string; minutes: string; seconds: string }

const labels: I18n<LabelSet> = {
  en: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
  ar: { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية' },
};

interface CountdownContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  date: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  whatsappSame: string;
  whatsappLabel: string;
  whatsappPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  successMessage: string;
  duplicatePhone: string;
  networkError: string;
  rateLimitError: string;
  urgencyBadge: string;
  urgencyTitle: string;
  urgencySubtitle: string;
  spotsLeft: string;
  spotsTotal: string;
  spotsProgress: string;
  vipTitle: string;
  vipSubtitle: string;
  vipBenefits: string[];
  vipBadge: string;
  hurryNote: string;
  validation: {
    nameRequired: string;
    nameMin: string;
    phoneRequired: string;
    phoneInvalid: string;
    whatsappRequired: string;
    whatsappInvalid: string;
    locationRequired: string;
  };
}

const content: I18n<CountdownContent> = {
  en: {
    badge: 'Launching Soon',
    title: 'The Future of Education',
    titleHighlight: 'Starts Here',
    subtitle: 'Be among the first to experience a smarter way to learn, teach, and grow. Join our early access list and get notified the moment we go live.',
    cta: 'Notify Me at Launch',
    date: 'June 12, 2026',
    formTitle: 'Register for Early Access',
    nameLabel: 'Teacher Name',
    namePlaceholder: 'Enter your full name',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter your phone number',
    whatsappSame: 'WhatsApp is same as phone',
    whatsappLabel: 'WhatsApp Number',
    whatsappPlaceholder: 'Enter your WhatsApp number',
    locationLabel: 'Location',
    locationPlaceholder: 'Enter your city / area',
    successMessage: 'You\'re on the list! We\'ll notify you at launch 🚀',
    duplicatePhone: 'This phone number is already registered',
    networkError: 'Connection error. Please try again.',
    rateLimitError: 'Too many attempts. Please try again later.',
    urgencyBadge: 'Hurry Up & Register!',
    urgencyTitle: 'Limited Spots Available',
    urgencySubtitle: 'Priority is given to early registrants — only a limited number of teachers will get VIP access with exclusive benefits.',
    spotsLeft: 'spots remaining',
    spotsTotal: 'out of 100 VIP spots',
    spotsProgress: 'Filling up fast!',
    vipTitle: 'VIP Teachers Get Exclusive Benefits',
    vipSubtitle: 'Only a limited number of teachers — be one of them',
    vipBenefits: [
      'Priority access before public launch',
      'Free premium features for the first year',
      'Dedicated support & personal onboarding',
      'Exclusive VIP badge on your profile',
      'Early access to all new features',
    ],
    vipBadge: 'VIP Access',
    hurryNote: 'Don\'t miss out — spots are filling fast!',
    validation: {
      nameRequired: 'Name is required',
      nameMin: 'Name must be at least 3 characters',
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Enter a valid phone number',
      whatsappRequired: 'WhatsApp number is required',
      whatsappInvalid: 'Enter a valid WhatsApp number',
      locationRequired: 'Location is required',
    },
  },
  ar: {
    badge: 'قريبًا',
    title: 'مستقبل التعليم',
    titleHighlight: 'يبدأ هنا',
    subtitle: 'كن من أوائل من يختبرون طريقة أذكى للتعلّم والتعليم والنمو. سجّل في قائمة الوصول المبكر وتلقَّ إشعارًا فور إطلاقنا.',
    cta: 'سجّل للوصول المبكر',
    date: '١٢ يونيو ٢٠٢٦',
    formTitle: 'سجّل للوصول المبكر',
    nameLabel: 'اسم المعلم',
    namePlaceholder: 'أدخل اسمك الكامل',
    phoneLabel: 'رقم الهاتف',
    phonePlaceholder: 'أدخل رقم هاتفك',
    whatsappSame: 'واتساب نفس رقم الهاتف',
    whatsappLabel: 'رقم الواتساب',
    whatsappPlaceholder: 'أدخل رقم الواتساب',
    locationLabel: 'الموقع',
    locationPlaceholder: 'أدخل مدينتك / منطقتك',
    successMessage: 'تم التسجيل بنجاح! سنُبلغك فور الإطلاق 🚀',
    duplicatePhone: 'رقم الهاتف مسجّل بالفعل',
    networkError: 'خطأ في الاتصال. حاول مرة أخرى.',
    rateLimitError: 'محاولات كثيرة. حاول مرة أخرى لاحقًا.',
    urgencyBadge: 'الحق سجّل!',
    urgencyTitle: 'الأماكن محدودة',
    urgencySubtitle: 'الأولوية للمسجّلين الأوائل — عدد المدرسين VIP محدود مع مميزات حصرية لهم فقط.',
    spotsLeft: 'مكان متبقي',
    spotsTotal: 'من أصل ١٠٠ مكان VIP',
    spotsProgress: 'الأماكن تنفد بسرعة!',
    vipTitle: 'مميزات حصرية لمدرسي VIP فقط',
    vipSubtitle: 'عدد المدرسين محدود — كن واحدًا منهم',
    vipBenefits: [
      'أولوية الوصول قبل الإطلاق العام',
      'ميزات بريميوم مجانية لأول سنة',
      'دعم مخصص وتدريب شخصي',
      'شارة VIP حصرية على ملفك',
      'وصول مبكر لكل الميزات الجديدة',
    ],
    vipBadge: 'وصول VIP',
    hurryNote: 'لا تفوّت الفرصة — الأماكن تنفد بسرعة!',
    validation: {
      nameRequired: 'الاسم مطلوب',
      nameMin: 'الاسم يجب أن يكون ٣ أحرف على الأقل',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'أدخل رقم هاتف صحيح',
      whatsappRequired: 'رقم الواتساب مطلوب',
      whatsappInvalid: 'أدخل رقم واتساب صحيح',
      locationRequired: 'الموقع مطلوب',
    },
  },
};

const phoneRegex = /^[+]?[\d\s\-()]{8,20}$/;

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://api.lezz-app.com';

export default function Countdown({ lang }: { lang: Lang }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const t = content[lang];
  const l = labels[lang];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      whatsappSame: true,
      whatsapp: '',
      location: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, t.validation.nameMin)
        .required(t.validation.nameRequired),
      phone: Yup.string()
        .matches(phoneRegex, t.validation.phoneInvalid)
        .required(t.validation.phoneRequired),
      whatsappSame: Yup.boolean(),
      whatsapp: Yup.string().when('whatsappSame', {
        is: false,
        then: (schema) =>
          schema
            .matches(phoneRegex, t.validation.whatsappInvalid)
            .required(t.validation.whatsappRequired),
        otherwise: (schema) => schema.notRequired(),
      }),
      location: Yup.string().required(t.validation.locationRequired),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const payload = {
          name: values.name.trim(),
          phone: values.phone.trim(),
          whatsapp_same: values.whatsappSame,
          whatsapp: values.whatsappSame ? '' : values.whatsapp.trim(),
          location: values.location.trim(),
        };

        const res = await fetch(`${API_BASE_URL}/early-access/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.status === 409) {
          setApiError(t.duplicatePhone);
          return;
        }

        if (res.status === 429) {
          setApiError(t.rateLimitError);
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setApiError(data?.message_ar || data?.message || t.networkError);
          return;
        }

        setSubmitted(true);
      } catch {
        setApiError(t.networkError);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const timeUnits = [
    { value: timeLeft.days, label: l.days },
    { value: timeLeft.hours, label: l.hours },
    { value: timeLeft.minutes, label: l.minutes },
    { value: timeLeft.seconds, label: l.seconds },
  ];

  const formatValue = (val: number) =>
    lang === 'ar' ? toArabicNumerals(val) : String(val).padStart(2, '0');

  const inputBase = 'w-full px-4 py-3.5 rounded-xl bg-navy border text-heading placeholder:text-muted/40 focus:outline-none transition-all duration-300 text-sm';
  const inputNormal = `${inputBase} border-border/60 focus:border-sky focus:ring-2 focus:ring-sky/20`;
  const inputError = `${inputBase} border-error/60 focus:border-error focus:ring-2 focus:ring-error/20`;

  return (
    <section id="countdown" className="relative py-24 md:py-32 px-4 bg-darkblue">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royal/3 dark:bg-royal/10 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-warning/10 text-warning border border-warning/20 mb-6">
            <Rocket size={14} />
            {t.badge}
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-heading mb-2">
            {t.title}{' '}
            <span className="text-gradient">{t.titleHighlight}</span>
          </h2>

          <p className="text-muted text-lg mt-4 mb-12 max-w-xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12"
        >
          {timeUnits.map((unit, i) => (
            <div key={i} className="card-dark p-6 md:p-8 text-center group hover:border-sky/30 transition-all duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gradient tabular-nums font-heading leading-none group-hover:scale-105 transition-transform duration-300">
                {formatValue(unit.value)}
              </div>
              <div className="text-xs md:text-sm text-sky/70 mt-3 font-semibold uppercase tracking-widest">
                {unit.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 text-bright/80">
            <Calendar size={14} />
            <span className="text-sm font-medium">{t.date}</span>
          </div>
        </motion.div>

        {/* ── Urgency Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden rounded-2xl border border-warning/30 bg-gradient-to-r from-warning/5 via-warning/10 to-warning/5 dark:from-warning/10 dark:via-warning/15 dark:to-warning/10 p-6 md:p-8">
            {/* Pulsing glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-warning/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-warning/8 rounded-full blur-2xl animate-pulse" />

            <div className="relative flex flex-col md:flex-row items-center gap-5 md:gap-8">
              {/* Urgency icon */}
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-warning/15 border border-warning/25 flex items-center justify-center animate-count-pulse">
                  <AlertTriangle size={28} className="text-warning" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-warning/15 text-warning border border-warning/25 mb-3">
                  <Clock size={12} />
                  {t.urgencyBadge}
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-extrabold text-heading mb-2">
                  {t.urgencyTitle}
                </h3>
                <p className="text-muted text-sm md:text-base leading-relaxed">
                  {t.urgencySubtitle}
                </p>
              </div>
            </div>


          </div>
        </motion.div>

        {/* ── VIP Benefits + Form Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">

          {/* VIP Benefits Card */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-bright/20 bg-card-dark/80 dark:bg-card-dark backdrop-blur-sm shadow-xl shadow-royal/5 dark:shadow-black/20 p-8 md:p-10 h-full">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warning via-bright to-sky" />

              {/* VIP badge */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-bright/20 border border-warning/25 flex items-center justify-center">
                  <Crown size={24} className="text-warning" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-warning/15 text-warning border border-warning/25 mb-1">
                    <Star size={10} />
                    {t.vipBadge}
                  </div>
                  <h3 className="text-lg md:text-xl font-heading font-extrabold text-heading leading-tight">
                    {t.vipTitle}
                  </h3>
                </div>
              </div>

              <p className="text-muted text-sm mb-6 leading-relaxed">{t.vipSubtitle}</p>

              {/* Benefits list */}
              <ul className="space-y-4">
                {t.vipBenefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: lang === 'ar' ? 16 : -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-3 group/item"
                  >
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-success/15 border border-success/25 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200">
                      <CheckCircle size={14} className="text-success" />
                    </div>
                    <span className="text-sm text-heading font-medium leading-relaxed">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Bottom hurry note */}
              <div className="mt-8 pt-5 border-t border-border/30">
                <div className="flex items-center gap-2.5 justify-center">
                  <Zap size={16} className="text-warning animate-pulse" />
                  <span className="text-sm font-bold text-warning">{t.hurryNote}</span>
                  <Zap size={16} className="text-warning animate-pulse" />
                </div>
              </div>

              {/* Decorative corner glow */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-warning/5 dark:bg-warning/10 rounded-full blur-2xl" />
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card-dark/80 dark:bg-card-dark backdrop-blur-sm shadow-xl shadow-royal/5 dark:shadow-black/20 p-8 md:p-10">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal via-bright to-sky" />

            <h3 className="text-xl font-bold text-heading text-center mb-8">{t.formTitle}</h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <p className="text-lg font-semibold text-heading">{t.successMessage}</p>
              </motion.div>
            ) : (
              <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
                {/* Teacher Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                    <User size={14} className="text-sky" />
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t.namePlaceholder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={formik.touched.name && formik.errors.name ? inputError : inputNormal}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-error text-xs mt-1.5 font-medium">{formik.errors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                    <Phone size={14} className="text-bright" />
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    dir="ltr"
                    placeholder={t.phonePlaceholder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    className={formik.touched.phone && formik.errors.phone ? inputError : inputNormal}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-error text-xs mt-1.5 font-medium">{formik.errors.phone}</p>
                  )}
                </div>

                {/* WhatsApp Same Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none group/check">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="whatsappSame"
                      checked={formik.values.whatsappSame}
                      onChange={formik.handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-border/60 peer-checked:border-success peer-checked:bg-success transition-all duration-200 flex items-center justify-center group-hover/check:border-success/60">
                      {formik.values.whatsappSame && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-muted group-hover/check:text-heading transition-colors">{t.whatsappSame}</span>
                </label>

                {/* WhatsApp Number (shown if not same) */}
                {!formik.values.whatsappSame && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                      <Phone size={14} className="text-success" />
                      {t.whatsappLabel}
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      dir="ltr"
                      placeholder={t.whatsappPlaceholder}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.whatsapp}
                      className={formik.touched.whatsapp && formik.errors.whatsapp ? inputError : inputNormal}
                    />
                    {formik.touched.whatsapp && formik.errors.whatsapp && (
                      <p className="text-error text-xs mt-1.5 font-medium">{formik.errors.whatsapp}</p>
                    )}
                  </motion.div>
                )}

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-heading mb-2">
                    <MapPin size={14} className="text-warning" />
                    {t.locationLabel}
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder={t.locationPlaceholder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.location}
                    className={formik.touched.location && formik.errors.location ? inputError : inputNormal}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-error text-xs mt-1.5 font-medium">{formik.errors.location}</p>
                  )}
                </div>

                {/* API Error */}
                {apiError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
                    <span className="shrink-0">⚠️</span>
                    {apiError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-royal via-bright to-sky hover:from-bright hover:via-sky hover:to-royal transition-all duration-500 shadow-lg shadow-bright/20 hover:shadow-sky/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {formik.isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Rocket size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  )}
                  {t.cta}
                </button>
              </form>
            )}
          </div>
        </motion.div>

        </div>{/* End grid */}
      </div>
    </section>
  );
}
