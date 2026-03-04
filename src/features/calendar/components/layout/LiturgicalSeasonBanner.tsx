import { SEASON_INFO, CYCLE_MAP } from '@shared/constants/config';
import { normalizeLiturgicalColor } from '@shared/lib/liturgy-engine';
import { cn } from '@shared/lib/utils';

interface SeasonBannerProps {
  seasonKey: string;
  language?: string;
  sundayCycle?: string;
  year?: number;
}

export default function LiturgicalSeasonBanner({
  seasonKey,
  language = 'es',
  sundayCycle,
  year,
}: SeasonBannerProps) {
  const info = SEASON_INFO[seasonKey];
  if (!info) return null;

  const title = language === 'la' && info.latTitle ? info.latTitle : info.title;
  const desc = language === 'la' && info.latDesc ? info.latDesc : info.desc;

  // Determine theme based on seasonKey
  // Some seasonKeys like ORDINARY_TIME_1 need mapping to colors
  const colorMap: Record<string, string> = {
    ADVENT: 'purple',
    CHRISTMAS: 'white',
    LENT: 'purple',
    HOLY_WEEK: 'red',
    EASTER: 'white',
    ORDINARY_TIME_1: 'green',
    ORDINARY_TIME_2: 'green',
  };

  const { theme } = normalizeLiturgicalColor({ colors: [colorMap[seasonKey] || 'green'] });
  const hex = theme.hex;

  const localizedSundayCycle = sundayCycle ? CYCLE_MAP[language]?.[sundayCycle] || sundayCycle : '';
  const weekdayCycle = year
    ? year % 2 !== 0
      ? language === 'la'
        ? 'Annus I'
        : 'Año I'
      : language === 'la'
        ? 'Annus II'
        : 'Año II'
    : '';

  return (
    <div
      id={`banner-${seasonKey}`}
      className="group relative overflow-hidden rounded-2xl px-6 py-8 mb-6 flex items-center justify-center text-center shadow-sm border transition-all duration-500 hover:shadow-md hover:scale-[1.005]"
      style={{
        background: `linear-gradient(135deg, ${hex}18 0%, ${hex}08 50%, transparent 100%)`,
        borderColor: `${hex}20`,
      }}
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${hex}22 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, ${hex}11 0%, transparent 60%)`,
        }}
      />

      {/* Vertical accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: `${hex}90` }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {(localizedSundayCycle || weekdayCycle || year) && (
          <div
            className={cn(
              'mb-[1em] px-[1.25em] py-[0.5em] rounded-full text-[0.875em] font-black tracking-[0.2em] uppercase shadow-sm border backdrop-blur-md transition-all duration-300',
              theme.badge
            )}
            style={{
              backgroundColor: `${hex}15`,
              borderColor: `${hex}30`,
              color: hex,
            }}
          >
            {localizedSundayCycle}
            {localizedSundayCycle && weekdayCycle && ' • '}
            {weekdayCycle}
            {(localizedSundayCycle || weekdayCycle) && year && ' - '}
            {year}
          </div>
        )}

        <h2
          className={cn(
            'text-[1.5em] sm:text-[1.875em] md:text-[2.25em] font-black tracking-tight leading-none capitalize mb-[0.1em]',
            theme.text
          )}
          style={{ textShadow: `0 2px 12px ${hex}20` }}
        >
          {title}
        </h2>
        <p className="text-[0.875em] md:text-[1em] text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
          {desc}
        </p>
      </div>
    </div>
  );
}
