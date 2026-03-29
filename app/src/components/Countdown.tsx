import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar } from 'lucide-react';
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
}

const content: I18n<CountdownContent> = {
  en: {
    badge: 'Launching Soon',
    title: 'The Future of Education',
    titleHighlight: 'Starts Here',
    subtitle: 'Be among the first to experience a smarter way to learn, teach, and grow. Join our early access list and get notified the moment we go live.',
    cta: 'Notify Me at Launch',
    date: 'June 12, 2026',
  },
  ar: {
    badge: 'قريبًا',
    title: 'مستقبل التعليم',
    titleHighlight: 'يبدأ هنا',
    subtitle: 'كن من أوائل من يختبرون طريقة أذكى للتعلّم والتعليم والنمو. سجّل في قائمة الوصول المبكر وتلقَّ إشعارًا فور إطلاقنا.',
    cta: 'أبلغني عند الإطلاق',
    date: '12 يونيو 2026',
  },
};

export default function Countdown({ lang }: { lang: Lang }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const t = content[lang];
  const l = labels[lang];

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: l.days },
    { value: timeLeft.hours, label: l.hours },
    { value: timeLeft.minutes, label: l.minutes },
    { value: timeLeft.seconds, label: l.seconds },
  ];

  return (
    <section id="countdown" className="relative py-24 md:py-32 px-4 bg-darkblue">
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Glow effects - hidden in light mode */}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-12"
        >
          {timeUnits.map((unit, i) => (
            <div key={i} className="card-dark p-6 md:p-8 text-center group hover:border-bright/30 transition-all duration-300">
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gradient tabular-nums font-heading leading-none group-hover:scale-105 transition-transform duration-300">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-muted mt-3 font-semibold uppercase tracking-widest">
                {unit.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 text-muted mb-6">
            <Calendar size={14} />
            <span className="text-sm">{t.date}</span>
          </div>
          <br />
          <a
            href="#"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-royal to-bright hover:from-bright hover:to-sky transition-all duration-500 shadow-lg shadow-royal/30 hover:shadow-bright/40 hover:-translate-y-1"
          >
            <Rocket size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            {t.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
