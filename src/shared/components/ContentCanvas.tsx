import React from 'react';
import { DecorativeSeparator } from './icons/DecorativeSeparator';
import { cn } from '@shared/lib/utils';

/**
 * Liturgical Header component for standardized titles and subtitles.
 * Uses em units to scale with the parent's font size.
 */
export const CanvasHeader: React.FC<{
  title: string;
  subtitle?: React.ReactNode;
  className?: string;
  showDivider?: boolean;
}> = ({ title, subtitle, className, showDivider = true }) => (
  <div className={cn('mb-8 text-center', className)}>
    <h2 className="text-[2em] md:text-[2.5em] font-bold font-serif text-primary italic leading-tight tracking-tight">
      {title}
    </h2>

    {subtitle && (
      <div className="mt-[0.5em] text-[1.1em] font-serif italic text-primary/80 leading-relaxed">
        {subtitle}
      </div>
    )}

    {showDivider && <div className="w-24 h-0.5 bg-primary/20 mx-auto mt-[1.5em]" />}
  </div>
);

/**
 * Standardized "Initial" for liturgical texts.
 * Uses em units to scale with the parent's font size.
 */
export const CanvasInitial: React.FC<{
  children: string;
  className?: string;
}> = ({ children, className }) => (
  <span
    className={cn(
      'text-[1.2em] font-bold text-primary font-serif align-baseline mr-[0.05em]',
      className
    )}
  >
    {children}
  </span>
);

interface ContentCanvasProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showDecorativeSeparator?: boolean;
  id?: string;
  position?: 'odd' | 'even'; // To determine Alpha or Omega
  symbol?: 'crismon' | 'cross' | 'none';
}

/**
 * ContentCanvas component that provides a unified,
 * premium liturgical manuscript-style background.
 */
export const ContentCanvas: React.FC<ContentCanvasProps> = ({
  children,
  maxWidth = 'max-w-6xl',
  className = '',
  showDecorativeSeparator = true,
  id,
  position = 'odd',
  symbol = 'none',
}) => {
  /**
   * Liturgical symbols as SVGs
   */
  const symbols = {
    alpha: (
      <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/10">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="80" fontFamily="serif">Α</text>
      </svg>
    ),
    omega: (
      <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/10">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="80" fontFamily="serif">Ω</text>
      </svg>
    ),
    crismon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 fill-primary/40">
            <path d="M50 5 L50 95 M40 15 L60 15 M50 5 C65 5 65 35 50 35 M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    ),
  };

  const svgPattern = `
  data:image/svg+xml;utf8,
  <svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'>
    <g fill='var(--border)' fill-opacity='0.1'>
      <path d='M70 20 v18 h18 v8 h-18 v18 h-8 v-18 h-18 v-8 h18 v-18 z'/>
      <path d='M70 90 v18 h18 v8 h-18 v18 h-8 v-18 h-18 v-8 h18 v-18 z'/>
    </g>
  </svg>
  `;

  return (
    <div className={cn('flex justify-center w-full px-0 py-0', className)} id={id}>
      <div
        className={cn(
          'relative p-6 md:p-16 mx-auto min-h-[calc(100vh-160px)] overflow-hidden w-full rounded-none md:rounded-sm border-x md:border border-primary/10 transition-all duration-700',
          'shadow-[0_20px_60px_rgba(0,0,0,0.2)] md:shadow-[0_20px_60px_rgba(0,0,0,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.1)]',
          maxWidth
        )}
        style={{
          backgroundColor: 'rgb(253, 251, 247)',
          backgroundImage: `
            url("${svgPattern}"),
            radial-gradient(circle at center, rgba(212,175,55,0.05), transparent 75%)
          `,
          backgroundSize: '140px 140px, 100% 100%',
          backgroundBlendMode: 'multiply',
        }}
      >
        {/* Subtle aged inner shadow */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_180px_rgba(0,0,0,0.15)] rounded-none md:rounded-sm" />

        {/* Cornices: Alpha/Omega */}
        <div className="absolute top-4 left-4 w-12 h-12 pointer-events-none opacity-40">
           {position === 'odd' ? symbols.alpha : symbols.omega}
        </div>
        <div className="absolute bottom-4 right-4 w-12 h-12 pointer-events-none opacity-40">
           {position === 'odd' ? symbols.omega : symbols.alpha}
        </div>

        {/* Centered logic for crismon if requested */}
        {symbol === 'crismon' && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none text-primary">
                {symbols.crismon}
            </div>
        )}

        {/* Content */}
        <div className="relative font-bible text-foreground text-justify">
          {children}
        </div>

        {/* Decorative Separator Footer */}
        {showDecorativeSeparator && (
          <div className="mt-12 flex justify-center opacity-40">
            <DecorativeSeparator />
          </div>
        )}
      </div>
    </div>
  );
};

