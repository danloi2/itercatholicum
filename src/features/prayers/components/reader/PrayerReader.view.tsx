import React from 'react';
import { ContentCanvas, CanvasHeader, CanvasInitial } from '@shared/components/ContentCanvas';

interface PrayerReaderViewProps {
  language: 'es' | 'la';
  title: string;
  content: string[];
}

const PrayerReaderView: React.FC<PrayerReaderViewProps> = ({ title, content }) => {
  return (
    <ContentCanvas className="animate-in fade-in slide-in-from-right-4 duration-500">
      <CanvasHeader title={title} />

      <div className="text-justify px-2 md:px-6">
        {content.map((line, idx) => (
          <p key={idx} className="mb-2">
            {idx === 0 ? (
              <>
                <CanvasInitial>{line.charAt(0).toUpperCase()}</CanvasInitial>
                {line.substring(1)}
              </>
            ) : (
              line
            )}
          </p>
        ))}
      </div>
    </ContentCanvas>
  );
};

export default PrayerReaderView;
