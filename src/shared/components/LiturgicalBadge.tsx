import React from 'react';
import { Badge } from '@ui/badge';
import { cn } from '@shared/lib/utils';
import type { ColorTheme } from '@shared/types';

interface LiturgicalBadgeProps {
  children: React.ReactNode;
  theme?: ColorTheme;
  rawRank?: string;
  variant?: 'outline' | 'default' | 'stone';
  className?: string;
  showDot?: boolean;
}

/**
 * A small colored dot representing the liturgical color.
 */
export const LiturgicalColorDot: React.FC<{ theme: ColorTheme; className?: string }> = ({
  theme,
  className,
}) => (
  <span
    className={cn('w-2 h-2 rounded-full inline-block shrink-0', className)}
    style={{ backgroundColor: theme.hex }}
    aria-hidden="true"
  />
);

/**
 * Standardized badge for liturgical ranks and cycles.
 * Handles the "stone" style for ferias and themed styles for others.
 */
export const LiturgicalBadge: React.FC<LiturgicalBadgeProps> = ({
  children,
  theme,
  rawRank,
  variant,
  className,
  showDot = false,
}) => {
  // Logic to determine the final style
  const isFeria = rawRank === 'FERIA' || rawRank === 'WEEKDAY';

  // Base classes for the badge to match LiturgicalCard styling
  const baseClasses =
    'text-[11px] md:text-[12px] px-2.5 py-1 rounded font-bold uppercase tracking-wider h-auto border';

  if (variant === 'stone' || isFeria) {
    return (
      <Badge
        variant="outline"
        className={cn(baseClasses, 'bg-stone-100 text-stone-500 border-stone-200', className)}
      >
        <div className="flex items-center gap-1">
          {showDot && theme && <LiturgicalColorDot theme={theme} />}
          {children}
        </div>
      </Badge>
    );
  }

  return (
    <Badge
      variant={variant === 'default' ? 'default' : 'outline'}
      className={cn(
        baseClasses,
        theme ? cn('bg-white/50', theme.badge) : 'bg-stone-50 text-stone-600 border-stone-200',
        className
      )}
    >
      <div className="flex items-center gap-1">
        {showDot && theme && <LiturgicalColorDot theme={theme} />}
        {children}
      </div>
    </Badge>
  );
};
/**
 * A badge specifically for displaying liturgical colors with a dot and optional name.
 */
export const LiturgicalColorBadge: React.FC<{
  theme: ColorTheme;
  colorName?: string;
  className?: string;
}> = ({ theme, colorName, className }) => (
  <Badge
    variant="outline"
    className={cn(
      'text-[11px] md:text-[12px] px-2.5 py-1 h-auto rounded font-medium uppercase tracking-wider border bg-white/50',
      className
    )}
  >
    <div className="flex items-center gap-1.5">
      <LiturgicalColorDot theme={theme} className="w-2 h-2" />
      {colorName && <span>{colorName}</span>}
    </div>
  </Badge>
);
