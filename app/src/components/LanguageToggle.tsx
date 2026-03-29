import { Globe } from 'lucide-react';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export default function LanguageToggle({ lang, setLang }: Props) {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full glass hover:bg-white/10 transition-all duration-300 shadow-xl shadow-nour-900/30 group cursor-pointer"
      title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
    >
      <Globe size={18} className="text-nour-400 group-hover:rotate-180 transition-transform duration-500" />
      <span className="text-sm font-semibold text-slate-200">
        {lang === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
