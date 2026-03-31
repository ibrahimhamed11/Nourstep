import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Rocket, Calendar, User, Phone, MapPin, CheckCircle, Crown, Zap, Star, Clock, AlertTriangle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { Lang, I18n } from '../types';

const LAUNCH_DATE = new Date('2026-06-12T00:00:00');

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

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

function toAr(num: number): string {
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).padStart(2, '0').split('').map(c => d[parseInt(c)] || c).join('');
}

const labels: I18n<{ days: string; hours: string; minutes: string; seconds: string }> = {
  en: { days: 'Days', hours: 'Hours', minutes: 'Min', seconds: 'Sec' },
  ar: { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية' },
};

interface Txt {
  eyebrow: string;
  title: string;
  titleHL: string;
  subtitle: string;
  cta: string;
  date: string;
  formTitle: string;
  nameLabel: string; namePH: string;
  phoneLabel: string; phonePH: string;
  whatsappSame: string;
  whatsappLabel: string; whatsappPH: string;
  locationLabel: string; locationPH: string;
  successMsg: string;
  dupPhone: string; netErr: string; rateErr: string;
  urgencyBadge: string; urgencyTitle: string; urgencySub: string;
  vipTitle: string; vipSub: string;
  vipBenefits: string[];
  vipBadge: string; hurryNote: string;
  v: {
    nameReq: string; nameMin: string;
    phoneReq: string; phoneInv: string;
    waReq: string; waInv: string;
    locReq: string;
  };
}

const txt: I18n<Txt> = {
  en: {
    eyebrow: 'Launching Soon',
    title: 'The Future of Education',
    titleHL: 'Starts Here',
    subtitle: 'Be among the first to experience a smarter way to learn, teach, and grow. Sign up for early access.',
    cta: 'Register for Early Access',
    date: 'June 12, 2026',
    formTitle: 'Register for Early Access',
    nameLabel: 'Teacher Name', namePH: 'Enter your full name',
    phoneLabel: 'Phone Number', phonePH: 'Enter your phone number',
    whatsappSame: 'WhatsApp is same as phone',
    whatsappLabel: 'WhatsApp Number', whatsappPH: 'Enter your WhatsApp number',
    locationLabel: 'Location', locationPH: 'Enter your city / area',
    successMsg: 'You\'re on the list! We\'ll notify you at launch 🚀',
    dupPhone: 'This phone number is already registered',
    netErr: 'Connection error. Please try again.',
    rateErr: 'Too many attempts. Please try again later.',
    urgencyBadge: 'Limited Spots',
    urgencyTitle: 'Priority for Early Registrants',
    urgencySub: 'Only a limited number of teachers will receive VIP access with exclusive benefits. Don\'t wait.',
    vipTitle: 'VIP Teacher Benefits',
    vipSub: 'Limited spots — be one of the first',
    vipBenefits: [
      'Priority access before public launch',
      'Free premium features for the first year',
      'Dedicated support & personal onboarding',
      'Exclusive VIP badge on your profile',
      'Early access to all new features',
    ],
    vipBadge: 'VIP',
    hurryNote: 'Spots are filling fast',
    v: {
      nameReq: 'Name is required', nameMin: 'Name must be at least 3 characters',
      phoneReq: 'Phone number is required', phoneInv: 'Enter a valid phone number',
      waReq: 'WhatsApp number is required', waInv: 'Enter a valid WhatsApp number',
      locReq: 'Location is required',
    },
  },
  ar: {
    eyebrow: 'قريبًا',
    title: 'مستقبل التعليم',
    titleHL: 'يبدأ هنا',
    subtitle: 'كن من أوائل من يختبرون طريقة أذكى للتعلّم والتعليم والنمو. سجّل في قائمة الوصول المبكر.',
    cta: 'سجّل للوصول المبكر',
    date: '١٢ يونيو ٢٠٢٦',
    formTitle: 'سجّل للوصول المبكر',
    nameLabel: 'اسم المعلم', namePH: 'أدخل اسمك الكامل',
    phoneLabel: 'رقم الهاتف', phonePH: 'أدخل رقم هاتفك',
    whatsappSame: 'واتساب نفس رقم الهاتف',
    whatsappLabel: 'رقم الواتساب', whatsappPH: 'أدخل رقم الواتساب',
    locationLabel: 'الموقع', locationPH: 'أدخل مدينتك / منطقتك',
    successMsg: 'تم التسجيل بنجاح! سنُبلغك فور الإطلاق 🚀',
    dupPhone: 'رقم الهاتف مسجّل بالفعل',
    netErr: 'خطأ في الاتصال. حاول مرة أخرى.',
    rateErr: 'محاولات كثيرة. حاول مرة أخرى لاحقًا.',
    urgencyBadge: 'الأماكن محدودة',
    urgencyTitle: 'الأولوية للمسجّلين الأوائل',
    urgencySub: 'عدد المدرسين VIP محدود مع مميزات حصرية لهم فقط. لا تنتظر.',
    vipTitle: 'مميزات مدرسي VIP',
    vipSub: 'عدد المدرسين محدود — كن واحدًا منهم',
    vipBenefits: [
      'أولوية الوصول قبل الإطلاق العام',
      'ميزات بريميوم مجانية لأول سنة',
      'دعم مخصص وتدريب شخصي',
      'شارة VIP حصرية على ملفك',
      'وصول مبكر لكل الميزات الجديدة',
    ],
    vipBadge: 'VIP',
    hurryNote: 'الأماكن تنفد بسرعة',
    v: {
      nameReq: 'الاسم مطلوب', nameMin: 'الاسم يجب أن يكون ٣ أحرف على الأقل',
      phoneReq: 'رقم الهاتف مطلوب', phoneInv: 'أدخل رقم هاتف صحيح',
      waReq: 'رقم الواتساب مطلوب', waInv: 'أدخل رقم واتساب صحيح',
      locReq: 'الموقع مطلوب',
    },
  },
};

const phoneRx = /^[+]?[\d\s\-()]{8,20}$/;
const API = import.meta.env.DEV ? '/api' : 'https://api.lezz-app.com';

export default function Countdown({ lang }: { lang: Lang }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const t = txt[lang];
  const l = labels[lang];

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const formik = useFormik({
    initialValues: { name: '', phone: '', whatsappSame: true, whatsapp: '', location: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, t.v.nameMin).required(t.v.nameReq),
      phone: Yup.string().matches(phoneRx, t.v.phoneInv).required(t.v.phoneReq),
      whatsappSame: Yup.boolean(),
      whatsapp: Yup.string().when('whatsappSame', {
        is: false,
        then: (s) => s.matches(phoneRx, t.v.waInv).required(t.v.waReq),
        otherwise: (s) => s.notRequired(),
      }),
      location: Yup.string().required(t.v.locReq),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiError(null);
      try {
        const res = await fetch(`${API}/early-access/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name.trim(),
            phone: values.phone.trim(),
            whatsapp_same: values.whatsappSame,
            whatsapp: values.whatsappSame ? '' : values.whatsapp.trim(),
            location: values.location.trim(),
          }),
        });
        if (res.status === 409) { setApiError(t.dupPhone); return; }
        if (res.status === 429) { setApiError(t.rateErr); return; }
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          setApiError(d?.message_ar || d?.message || t.netErr);
          return;
        }
        setSubmitted(true);
      } catch { setApiError(t.netErr); }
      finally { setSubmitting(false); }
    },
  });

  const units = [
    { val: timeLeft.days, lbl: l.days },
    { val: timeLeft.hours, lbl: l.hours },
    { val: timeLeft.minutes, lbl: l.minutes },
    { val: timeLeft.seconds, lbl: l.seconds },
  ];
  const fmt = (v: number) => lang === 'ar' ? toAr(v) : String(v).padStart(2, '0');

  const inputCls = 'w-full px-3.5 py-3 rounded-lg bg-navy/80 dark:bg-navy border border-border/50 text-heading placeholder:text-muted/30 focus:outline-none focus:border-royal dark:focus:border-bright/50 focus:ring-1 focus:ring-royal/15 dark:focus:ring-bright/15 transition-colors text-sm';
  const inputErr = 'w-full px-3.5 py-3 rounded-lg bg-navy/80 dark:bg-navy border border-error/40 text-heading placeholder:text-muted/30 focus:outline-none focus:border-error focus:ring-1 focus:ring-error/15 transition-colors text-sm';

  return (
    <section id="countdown" className="relative py-20 md:py-28 px-6 bg-surface dark:bg-darkblue">
      <div className="max-w-5xl mx-auto">
        {/* Header + countdown timer */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-warning/70 mb-3 flex items-center gap-1.5 justify-center">
            <Rocket size={12} />
            {t.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-heading">
            {t.title}{' '}
            <span className="text-gradient">{t.titleHL}</span>
          </h2>
          <p className="text-muted text-[15px] mt-3 max-w-md mx-auto">{t.subtitle}</p>
        </m.div>

        {/* Timer */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex justify-center gap-3 md:gap-4 mb-3"
        >
          {units.map((u, i) => (
            <div key={i} className="text-center min-w-[64px] md:min-w-[80px]">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-heading tabular-nums font-heading leading-none">
                {fmt(u.val)}
              </div>
              <div className="text-[10px] md:text-xs text-muted/50 mt-1.5 uppercase tracking-wider font-medium">
                {u.lbl}
              </div>
            </div>
          ))}
        </m.div>

        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted/40">
            <Calendar size={11} />
            {t.date}
          </span>
        </div>

        {/* Urgency note — compact, not a big banner */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="flex items-start gap-4 p-5 rounded-xl bg-warning/[0.04] dark:bg-warning/[0.06] border border-warning/10">
            <AlertTriangle size={18} className="text-warning/60 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-warning/70 flex items-center gap-1">
                  <Clock size={10} />
                  {t.urgencyBadge}
                </span>
              </div>
              <p className="text-sm font-medium text-heading mb-0.5">{t.urgencyTitle}</p>
              <p className="text-[13px] text-muted leading-relaxed">{t.urgencySub}</p>
            </div>
          </div>
        </m.div>

        {/* Two-column: VIP benefits + Form */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">

          {/* VIP Benefits */}
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-6 rounded-xl bg-navy/40 dark:bg-navy/50 border border-border/40 h-fit"
          >
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Crown size={16} className="text-warning/70" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-warning/60 flex items-center gap-1">
                  <Star size={8} /> {t.vipBadge}
                </span>
                <h3 className="text-[15px] font-bold text-heading leading-tight">{t.vipTitle}</h3>
              </div>
            </div>

            <p className="text-[13px] text-muted mb-5">{t.vipSub}</p>

            <ul className="space-y-3">
              {t.vipBenefits.map((b, i) => (
                <m.li
                  key={i}
                  initial={{ opacity: 0, x: lang === 'ar' ? 8 : -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle size={14} className="text-success/60 shrink-0 mt-0.5" />
                  <span className="text-[13px] text-heading/80 leading-relaxed">{b}</span>
                </m.li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-border/20 text-center">
              <span className="text-[12px] font-medium text-warning/50 flex items-center gap-1.5 justify-center">
                <Zap size={11} />
                {t.hurryNote}
              </span>
            </div>
          </m.div>

          {/* Registration Form */}
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="p-6 rounded-xl bg-navy/40 dark:bg-navy/50 border border-border/40"
          >
            <h3 className="text-[15px] font-bold text-heading text-center mb-6">{t.formTitle}</h3>

            {submitted ? (
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-success/70" />
                </div>
                <p className="text-sm font-medium text-heading">{t.successMsg}</p>
              </m.div>
            ) : (
              <form className="space-y-4" onSubmit={formik.handleSubmit} noValidate>
                {/* Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-heading/70 mb-1.5">
                    <User size={12} className="text-muted/40" />
                    {t.nameLabel}
                  </label>
                  <input
                    type="text" id="name" name="name"
                    placeholder={t.namePH}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name}
                    className={formik.touched.name && formik.errors.name ? inputErr : inputCls}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-error text-[11px] mt-1 font-medium">{formik.errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-heading/70 mb-1.5">
                    <Phone size={12} className="text-muted/40" />
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel" id="phone" name="phone" dir="ltr"
                    placeholder={t.phonePH}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.phone}
                    className={formik.touched.phone && formik.errors.phone ? inputErr : inputCls}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-error text-[11px] mt-1 font-medium">{formik.errors.phone}</p>
                  )}
                </div>

                {/* WhatsApp same checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none group/c">
                  <div className="relative">
                    <input
                      type="checkbox" name="whatsappSame"
                      checked={formik.values.whatsappSame} onChange={formik.handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 rounded border border-border/50 peer-checked:border-success/60 peer-checked:bg-success/80 transition-colors flex items-center justify-center">
                      {formik.values.whatsappSame && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[13px] text-muted">{t.whatsappSame}</span>
                </label>

                {/* WhatsApp field */}
                {!formik.values.whatsappSame && (
                  <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                    <label className="flex items-center gap-1.5 text-[13px] font-medium text-heading/70 mb-1.5">
                      <Phone size={12} className="text-muted/40" />
                      {t.whatsappLabel}
                    </label>
                    <input
                      type="tel" id="whatsapp" name="whatsapp" dir="ltr"
                      placeholder={t.whatsappPH}
                      onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.whatsapp}
                      className={formik.touched.whatsapp && formik.errors.whatsapp ? inputErr : inputCls}
                    />
                    {formik.touched.whatsapp && formik.errors.whatsapp && (
                      <p className="text-error text-[11px] mt-1 font-medium">{formik.errors.whatsapp}</p>
                    )}
                  </m.div>
                )}

                {/* Location */}
                <div>
                  <label className="flex items-center gap-1.5 text-[13px] font-medium text-heading/70 mb-1.5">
                    <MapPin size={12} className="text-muted/40" />
                    {t.locationLabel}
                  </label>
                  <input
                    type="text" id="location" name="location"
                    placeholder={t.locationPH}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.location}
                    className={formik.touched.location && formik.errors.location ? inputErr : inputCls}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-error text-[11px] mt-1 font-medium">{formik.errors.location}</p>
                  )}
                </div>

                {/* API Error */}
                {apiError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-error/5 border border-error/10 text-error text-[13px]">
                    <span className="shrink-0">⚠️</span>
                    {apiError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-royal hover:bg-bright transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
                >
                  {formik.isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Rocket size={15} />
                  )}
                  {t.cta}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}
