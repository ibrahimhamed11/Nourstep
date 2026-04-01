/**
 * Password strength indicator — multi-segment bar with animated transitions.
 */
import { Check, X } from 'lucide-react';

interface Props {
  password: string;
  labels: { weak: string; medium: string; strong: string; label: string };
}

interface Rule {
  test: (pw: string) => boolean;
  label: { en: string; ar: string };
}

const rules: Rule[] = [
  { test: (pw) => pw.length >= 8, label: { en: '8+ characters', ar: '٨ أحرف أو أكثر' } },
  { test: (pw) => /[a-z]/.test(pw) && /[A-Z]/.test(pw), label: { en: 'Upper & lowercase', ar: 'أحرف كبيرة وصغيرة' } },
  { test: (pw) => /\d/.test(pw), label: { en: 'A number', ar: 'رقم واحد على الأقل' } },
  { test: (pw) => /[^a-zA-Z\d]/.test(pw), label: { en: 'Special character', ar: 'رمز خاص' } },
];

function getStrength(pw: string): number {
  return rules.filter((r) => r.test(pw)).length; // 0-4
}

export default function PasswordStrength({ password, labels }: Props) {
  if (!password) return null;

  const strength = getStrength(password);
  const level = strength <= 1 ? 'weak' : strength <= 2 ? 'medium' : 'strong';

  const segmentColors = {
    weak: ['bg-error', 'bg-border/20', 'bg-border/20', 'bg-border/20'],
    medium: ['bg-warning', 'bg-warning', 'bg-border/20', 'bg-border/20'],
    strong: ['bg-success', 'bg-success', 'bg-success', 'bg-success'],
  };

  const textColors = {
    weak: 'text-error',
    medium: 'text-warning',
    strong: 'text-success',
  };

  const isArabic = labels.label.match(/[\u0600-\u06FF]/);

  return (
    <div className="mb-5 -mt-2 space-y-2.5">
      {/* Bar & label row */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted/60 font-medium">{labels.label}</span>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${textColors[level]}`}>
            {labels[level]}
          </span>
        </div>
        {/* Segmented bar */}
        <div className="flex gap-1">
          {segmentColors[level].map((color, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((rule, i) => {
          const passed = rule.test(password);
          return (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                passed ? 'bg-success/15 text-success' : 'bg-border/20 text-muted/30'
              }`}>
                {passed ? <Check size={9} strokeWidth={3} /> : <X size={8} strokeWidth={2.5} />}
              </div>
              <span className={`text-[10px] transition-colors duration-300 ${
                passed ? 'text-heading/70' : 'text-muted/40'
              }`}>
                {isArabic ? rule.label.ar : rule.label.en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
