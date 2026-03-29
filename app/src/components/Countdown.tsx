import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, User, Phone, MapPin, CheckCircle } from 'lucide-react';
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
    cta: 'أبلغني عند الإطلاق',
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

export default function Countdown({ lang }: { lang: Lang }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [submitted, setSubmitted] = useState(false);
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
    onSubmit: () => {
      setSubmitted(true);
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

      <div className="max-w-4xl mx-auto relative">
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

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-lg mx-auto"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-royal via-bright to-sky hover:from-bright hover:via-sky hover:to-royal transition-all duration-500 shadow-lg shadow-bright/20 hover:shadow-sky/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  <Rocket size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  {t.cta}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
