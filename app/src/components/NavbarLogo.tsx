import { useEffect, useState } from 'react';
import type { Theme } from '../types';
import Logo from './logo';

interface NavbarLogoProps {
  theme: Theme;
}

export default function NavbarLogo({ theme }: NavbarLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <a href="#hero" className="flex items-center gap-3.5 group select-none relative">
      {/* Logo icon with glow & animation */}
      <div className="relative flex items-center justify-center">
        {/* Soft ambient glow — appears on hover */}
        <div className="absolute -inset-3 rounded-2xl blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-700 ease-out bg-royal/25 dark:bg-bright/25" />

        {/* Continuous subtle breathing ring */}
        <div className="absolute -inset-1.5 rounded-xl border border-royal/10 dark:border-bright/10 navbar-logo-breathe opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Logo mark */}
        <Logo
          width={44}
          height={38}
          accentFill={theme === 'dark' ? undefined : '#137BE2'}
          className={`relative z-10 drop-shadow-md transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-4deg] group-hover:drop-shadow-lg ${
            mounted ? 'navbar-logo-enter' : 'opacity-0'
          }`}
        />
      </div>



      {/* Text block */}
      <div className="flex flex-col items-start gap-0">
        {/* Main title — solid color, strong font, no gradient */}
        <span
          className={`text-[22px] font-extrabold font-arabic leading-none tracking-[-0.02em] transition-all duration-500 ease-out group-hover:tracking-[0.01em] group-hover:translate-x-0.5 ${
            theme === 'dark'
              ? 'text-white'
              : 'text-royal'
          } ${mounted ? 'navbar-text-enter' : 'opacity-0'}`}
        >
          خطوة للنور
        </span>


      </div>
    </a>
  );
}
