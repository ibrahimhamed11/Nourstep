/**
 * Shared form input component for auth pages.
 * Enhanced with focus animations, floating label feel, and micro-interactions.
 */
import { useState } from 'react';
import { Eye, EyeOff, ChevronDown, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  icon?: LucideIcon;
  helper?: string;
  dir?: 'ltr' | 'rtl';
}

export default function AuthInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon: Icon,
  helper,
  dir,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = touched && error;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className={`block text-[13px] font-semibold mb-2 transition-colors duration-200 ${
          hasError ? 'text-error' : isFocused ? 'text-royal dark:text-bright' : 'text-heading/80'
        }`}
      >
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none transition-colors duration-200 ${
            hasError ? 'text-error/60' : isFocused ? 'text-royal dark:text-bright' : 'text-muted/50'
          }`}>
            <Icon size={17} strokeWidth={1.8} />
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
          onFocus={() => setIsFocused(true)}
          dir={dir}
          autoComplete={isPassword ? 'new-password' : 'on'}
          className={`
            w-full px-4 py-3 rounded-xl text-[14px] text-heading
            bg-white/70 dark:bg-white/[0.04]
            border transition-all duration-200 outline-none
            placeholder:text-muted/40 placeholder:text-[13px]
            ${Icon ? 'ps-11' : ''}
            ${isPassword ? 'pe-11' : ''}
            ${
              hasError
                ? 'border-error/50 focus:border-error/80 ring-2 ring-error/10 focus:ring-error/20'
                : 'border-royal/10 dark:border-white/[0.08] hover:border-royal/20 dark:hover:border-white/[0.12] focus:border-royal/50 dark:focus:border-bright/40 focus:ring-2 focus:ring-royal/10 dark:focus:ring-bright/10'
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 -translate-y-1/2 end-3.5 text-muted/50 hover:text-heading transition-all duration-200 hover:scale-105 active:scale-95"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
          </button>
        )}
      </div>

      {helper && !hasError && (
        <p className="mt-1.5 text-[11px] text-muted/60 leading-relaxed">{helper}</p>
      )}

      {hasError && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <AlertCircle size={12} className="text-error/70 shrink-0" />
          <p className="text-[11px] text-error/90 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Select Input ─── */
interface SelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function AuthSelect({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options,
  placeholder,
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = touched && error;

  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className={`block text-[13px] font-semibold mb-2 transition-colors duration-200 ${
          hasError ? 'text-error' : isFocused ? 'text-royal dark:text-bright' : 'text-heading/80'
        }`}
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => { setIsFocused(false); onBlur?.(e); }}
          onFocus={() => setIsFocused(true)}
          className={`
            w-full px-4 py-3 pe-10 rounded-xl text-[14px] text-heading
            bg-white/70 dark:bg-white/[0.04]
            border transition-all duration-200 outline-none appearance-none
            ${
              hasError
                ? 'border-error/50 focus:border-error/80 ring-2 ring-error/10 focus:ring-error/20'
                : 'border-royal/10 dark:border-white/[0.08] hover:border-royal/20 dark:hover:border-white/[0.12] focus:border-royal/50 dark:focus:border-bright/40 focus:ring-2 focus:ring-royal/10 dark:focus:ring-bright/10'
            }
            ${!value ? 'text-muted/40 text-[13px]' : ''}
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className={`absolute top-1/2 -translate-y-1/2 end-3.5 pointer-events-none transition-colors duration-200 ${
          isFocused ? 'text-royal dark:text-bright' : 'text-muted/40'
        }`}>
          <ChevronDown size={16} strokeWidth={1.8} />
        </div>
      </div>

      {hasError && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <AlertCircle size={12} className="text-error/70 shrink-0" />
          <p className="text-[11px] text-error/90 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
