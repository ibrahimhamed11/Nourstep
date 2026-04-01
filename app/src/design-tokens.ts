/**
 * ─── NourStep Design Tokens ───
 *
 * Single source of truth for all fonts, colors, sizes, and spacing.
 * Import from here in every component — never hardcode values.
 */

/* ─────────────── FONT SIZES ─────────────── */

/** Standardized text size classes used across the entire app. */
export const fontSize = {
  /** Hero main title — biggest text on the page */
  heroTitle: {
    en: 'text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.75rem]',
    ar: 'text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem]',
  },

  /** Section headings (h2) */
  sectionTitle: 'text-[2rem] md:text-[2.5rem] lg:text-[3rem]',

  /** Card / item titles (h3) */
  cardTitle: 'text-lg font-semibold',

  /** Body / description text inside sections */
  body: 'text-base md:text-lg',

  /** Slightly larger body for hero subtitle */
  bodyLg: 'text-lg md:text-xl',

  /** Smaller secondary/supporting text */
  small: 'text-[15px]',

  /** Extra-small labels, badges, tags */
  xs: 'text-sm',

  /** Tiny — footnotes, copyright */
  xxs: 'text-xs',

  /** Eyebrow text above section titles */
  eyebrow: 'text-sm font-semibold uppercase tracking-widest',

  /** Form labels */
  label: 'text-[15px] font-medium',

  /** Form input text */
  input: 'text-[15px]',

  /** Button text */
  button: 'text-base font-semibold',

  /** Nav link text */
  nav: 'text-[15px] font-semibold',

  /** Feature tag / pill */
  tag: 'text-sm font-medium',

  /** Stat values */
  statValue: 'text-[15px] font-bold',

  /** Stat labels */
  statLabel: 'text-sm',

  /** Countdown timer digits */
  timer: 'text-4xl md:text-5xl lg:text-6xl font-bold',

  /** Timer unit labels */
  timerLabel: 'text-sm md:text-base',
} as const;

/* ─────────────── COLORS (Tailwind class tokens) ─────────────── */

/**
 * Semantic color tokens for text.
 * These resolve correctly in both light and dark themes
 * because the underlying CSS vars change per theme.
 */
export const textColor = {
  /** Primary headings — always high contrast */
  heading: 'text-heading',

  /** Standard body text — readable in both themes */
  body: 'text-lightblue',

  /** Secondary / muted — slightly lower contrast but still readable */
  muted: 'text-muted',

  /** Very subtle text (timestamps, footnotes) — still visible in dark */
  subtle: 'text-muted/80 dark:text-lightblue/50',

  /** Eyebrow accent (brand) */
  eyebrow: 'text-royal dark:text-sky',

  /** Eyebrow accent (softer) */
  eyebrowSoft: 'text-royal dark:text-bright',

  /** Accent brand text */
  accent: 'text-royal dark:text-bright',

  /** Success green */
  success: 'text-success',

  /** Warning amber */
  warning: 'text-warning',

  /** Error red */
  error: 'text-error',

  /** On-dark surfaces (always white) */
  onDark: 'text-white',

  /** Link text — visible in dark mode */
  link: 'text-muted dark:text-lightblue/70 hover:text-royal dark:hover:text-white transition-colors duration-200',
} as const;

/* ─────────────── BACKGROUNDS ─────────────── */

export const bgColor = {
  /** Page-level navy */
  page: 'bg-navy',

  /** Alternate section background */
  surface: 'bg-surface dark:bg-darkblue',

  /** Card background */
  card: 'bg-card-dark',

  /** Subtle card on navy background */
  cardSubtle: 'bg-navy/40 dark:bg-navy/50',

  /** Highlight card */
  cardHighlight: 'bg-surface/50 dark:bg-card-dark/60',

  /** Icon background — brand */
  iconBrand: 'bg-royal/10 dark:bg-bright/10',

  /** Icon background — success */
  iconSuccess: 'bg-success/10',

  /** Icon background — warning */
  iconWarning: 'bg-warning/10',
} as const;

/* ─────────────── BORDERS ─────────────── */

export const borderColor = {
  /** Default card/section border */
  default: 'border-border/40',

  /** Stronger border on hover */
  hover: 'hover:border-royal/25 dark:hover:border-bright/25',

  /** Subtle border */
  subtle: 'border-border/30',
} as const;

/* ─────────────── SPACING ─────────────── */

export const spacing = {
  /** Section vertical padding */
  sectionY: 'py-14 md:py-20',

  /** Section horizontal padding */
  sectionX: 'px-6',

  /** Gap between section header and content */
  sectionGap: 'mb-10',

  /** Card internal padding */
  cardPadding: 'p-5',

  /** Tighter card padding */
  cardPaddingSm: 'p-4',

  /** Grid gap */
  gridGap: 'gap-3 md:gap-4',

  /** Max width for content */
  maxWidth: 'max-w-5xl mx-auto',
} as const;

/* ─────────────── COMPONENT STYLES (common combos) ─────────────── */

/** Common card styling */
export const cardStyle =
  'rounded-xl border border-border/40 hover:border-royal/25 dark:hover:border-bright/25 hover:shadow-lg hover:shadow-royal/5 dark:hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300';

/** Section eyebrow text */
export const eyebrowStyle = `${fontSize.eyebrow} ${textColor.eyebrowSoft} mb-3`;

/** Section heading */
export const sectionHeadingStyle = `${fontSize.sectionTitle} font-heading font-bold ${textColor.heading}`;

/** Section subtitle / paragraph below heading */
export const sectionSubtitleStyle = `${fontSize.body} ${textColor.muted} mt-3 leading-relaxed`;

/** Card title inside feature/problem/user cards */
export const cardTitleStyle = `${fontSize.cardTitle} ${textColor.heading}`;

/** Card description text */
export const cardDescStyle = `${fontSize.small} ${textColor.muted} leading-relaxed`;

/** CTA primary button */
export const ctaPrimaryStyle =
  'inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-royal to-bright hover:from-bright hover:to-royal transition-all duration-300 shadow-lg shadow-royal/25 dark:shadow-royal/15 hover:shadow-xl hover:shadow-royal/30 hover:scale-[1.02] active:scale-[0.98]';

/** CTA secondary (outline) button */
export const ctaSecondaryStyle =
  'inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-heading border border-border hover:border-royal/30 dark:hover:border-bright/20 hover:bg-royal/5 dark:hover:bg-bright/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]';
