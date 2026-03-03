import React from 'react';
import { cn } from '../../lib/utils';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

export type FABVariant = 'primary' | 'amber' | 'accent' | 'ghost' | 'danger' | 'brown';

interface FabProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: FABVariant;
  size?: 'sm' | 'md' | 'lg';
  iconAnimation?: string;
  show?: boolean;
  children?: React.ReactNode;
}

export const Fab: React.FC<FabProps> = ({
  icon,
  label,
  onClick,
  className,
  variant = 'primary',
  size = 'md',
  iconAnimation = 'group-hover:scale-110',
  show = true,
  children,
}) => {
  if (!show) return null;

  const variants = {
    primary: 'bg-linear-to-r from-primary-600 to-indigo-600 shadow-primary-200/50 text-white',
    amber: 'bg-linear-to-r from-amber-600 to-orange-600 shadow-amber-200/50 text-white',
    accent: 'bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30 text-white',
    brown: 'bg-linear-to-r from-[#5c4033] to-[#2d1a1a] shadow-[#5c4033]/30 text-white',
    ghost:
      'bg-white/90 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700 border border-stone-200',
    danger: 'bg-linear-to-r from-red-600 to-rose-600 shadow-red-200/50 text-white',
  };

  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: cn(
              (icon.props as { className?: string }).className,
              iconSize,
              'transition-transform',
              iconAnimation
            ),
          })
        : icon}
      {children}
      <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none uppercase tracking-wider">
        {label}
      </span>
    </button>
  );
};

interface FloatingTTSButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  language?: 'es' | 'la';
}

export const FloatingTTSButton: React.FC<FloatingTTSButtonProps> = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  language = 'es',
}) => {
  const handleToggle = () => {
    if (!isPlaying) {
      onPlay();
    } else if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  const getLabel = () => {
    if (!isPlaying) return language === 'la' ? 'Audire' : 'Escuchar';
    if (isPaused) return language === 'la' ? 'Resumere' : 'Continuar';
    return language === 'la' ? 'Intermittere' : 'Pausar';
  };

  return (
    <div className="flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isPlaying && (
        <Fab
          icon={<VolumeX />}
          label={language === 'la' ? 'Cessare' : 'Detener'}
          onClick={onStop}
          variant="ghost"
          size="md"
        />
      )}

      <Fab
        icon={
          !isPlaying ? (
            <Volume2 />
          ) : isPaused ? (
            <Play className="fill-current" />
          ) : (
            <Pause className="fill-current" />
          )
        }
        label={getLabel()}
        onClick={handleToggle}
        variant={isPlaying && !isPaused ? 'danger' : isPaused ? 'amber' : 'primary'}
        size="lg"
      >
        {isPlaying && !isPaused && (
          <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
        )}
      </Fab>
    </div>
  );
};

export default Fab;
