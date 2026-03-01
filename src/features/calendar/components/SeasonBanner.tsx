import { SEASON_INFO } from '@shared/constants/config';

interface SeasonBannerProps {
  seasonKey: string;
  language?: string;
}

export default function SeasonBanner({ seasonKey, language = 'es' }: SeasonBannerProps) {
  const info = SEASON_INFO[seasonKey];
  if (!info) return null;

  const title = language === 'la' && info.latTitle ? info.latTitle : info.title;
  const desc = language === 'la' && info.latDesc ? info.latDesc : info.desc;

  return (
    <div
      id={`banner-${seasonKey}`}
      className="group relative overflow-hidden rounded-2xl p-4 mb-4 text-center shadow-lg shadow-primary-900/5 transition-all duration-500 hover:shadow-xl hover:scale-[1.01]"
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl z-0"></div>
      <div className="absolute inset-0 bg-linear-to-br from-primary-500/10 to-indigo-500/10 z-0"></div>
      <div className="relative z-10">
        <h2 className="text-xl font-black bg-linear-to-br from-primary-700 to-indigo-700 bg-clip-text text-transparent tracking-tight mb-1">
          {title}
        </h2>
        <p className="text-sm text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
