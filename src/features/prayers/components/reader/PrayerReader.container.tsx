import React from 'react';
import PrayerReaderView from './PrayerReader.view';
import type { Prayer } from '../../services/prayerService';

interface PrayerReaderContainerProps {
  language: 'es' | 'la';
  selectedPrayer: Prayer;
}

const PrayerReaderContainer: React.FC<PrayerReaderContainerProps> = ({
  language,
  selectedPrayer,
}) => {
  // Any future logic for prayers (e.g. tracking progress, secondary translations) goes here
  return (
    <PrayerReaderView
      language={language}
      title={
        language === 'la' && selectedPrayer.title.la
          ? selectedPrayer.title.la
          : selectedPrayer.title.es
      }
      content={selectedPrayer.content[language]}
    />
  );
};

export default PrayerReaderContainer;
