import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    <a href="#hero" className="flex items-center gap-3 group select-none relative">
      {/* Logo container with layered effects */}
      <div className="relative flex items-center justify-center w-12 h-12 p-0.5">
        {/* Outer glow ring — visible on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-royal/20 to-bright/20 dark:from-bright/15 dark:to-sky/15 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />

        {/* Glass-like container pill */}
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-500 ease-out
            bg-gradient-to-br from-royal/8 to-bright/5 dark:from-bright/8 dark:to-sky/5
            border border-royal/10 dark:border-bright/12
            group-hover:border-royal/25 dark:group-hover:border-bright/25
            group-hover:from-royal/12 group-hover:to-bright/10
            dark:group-hover:from-bright/12 dark:group-hover:to-sky/10
            group-hover:shadow-lg group-hover:shadow-royal/10 dark:group-hover:shadow-bright/10
            backdrop-blur-sm
            ${mounted ? 'navbar-container-enter' : 'opacity-0'}`}
        />

        {/* Breathing border accent — top-left corner highlight */}
        <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 navbar-logo-breathe overflow-hidden">
          <div className="absolute inset-0 rounded-xl border border-transparent bg-gradient-to-br from-bright/30 via-transparent to-royal/20 dark:from-sky/30 dark:to-bright/20" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }} />
        </div>

        {/* Logo mark */}
        <Logo
          width={60}
          height={56}
          accentFill={theme === 'dark' ? undefined : '#137BE2'}
          className={`relative z-10 drop-shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:drop-shadow-md ${
            mounted ? 'navbar-logo-enter' : 'opacity-0'
          }`}
        />
      </div>

      {/* Vertical divider accent */}
      <div
        className={`hidden sm:block w-px h-6 rounded-full transition-all duration-500 ease-out
          bg-gradient-to-b from-transparent via-royal/20 to-transparent
          dark:via-bright/20
          group-hover:via-royal/40 dark:group-hover:via-bright/40
          group-hover:h-7
          ${mounted ? 'navbar-dot-enter' : 'opacity-0'}`}
      />

      {/* Text block */}
      <div className="flex flex-col items-start -space-y-0.5">
        {/* Main brand name — per-word staggered animation */}
        <span
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          className={`text-[20px] font-extrabold leading-tight tracking-[-0.01em] transition-all duration-500 ease-out group-hover:tracking-[0.005em] ${mounted ? '' : 'opacity-0'}`}
        >
          {mounted && (
            <>
              <motion.span
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.25,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`inline-block navbar-title-char ${theme === 'dark' ? 'text-white' : 'text-royal'}`}
              >
                خطوة
              </motion.span>
              {' '}
              <motion.span
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: 0.4,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`inline-block navbar-title-char ${theme === 'dark' ? 'text-bright' : 'text-sky'}`}
              >
                للنور
              </motion.span>
            </>
          )}
        </span>

        {/* Subtitle tagline — per-word wave entrance */}
        <span
          style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
          className={`mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] transition-all duration-500 ease-out
            text-heading dark:text-white
            group-hover:text-bright dark:group-hover:text-sky
            group-hover:tracking-[0.2em]
            ${mounted ? '' : 'opacity-0'}`}
        >
          {mounted && (
            'خطوة بخطوة في الكورسات'.split(' ').map((word, i) => (
              <motion.span
                key={`s-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.65 + i * 0.08,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {word}{i < 3 ? '\u00A0' : ''}
              </motion.span>
            ))
          )}
        </span>
      </div>
    </a>
  );
}
