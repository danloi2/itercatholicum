import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/components/Home';
import CalendarViewPage from '@/components/CalendarViewPage';
import BibleReaderPage from '@/components/BibleReaderPage';
import PrayersPage from '@/components/PrayersPage';
import FeaturePlaceholder from '@/components/FeaturePlaceholder';

export default function App() {
  const [language, setLanguage] = useState<'es' | 'la'>('es');

  return (
    <Routes>
      <Route path="/" element={<Home language={language} setLanguage={setLanguage} />} />
      <Route
        path="/calendar"
        element={<CalendarViewPage language={language} setLanguage={setLanguage} />}
      />
      <Route
        path="/bible"
        element={<BibleReaderPage language={language} setLanguage={setLanguage} />}
      />
      <Route
        path="/mass"
        element={
          <FeaturePlaceholder title="Santa Misa" language={language} setLanguage={setLanguage} />
        }
      />
      <Route
        path="/prayers"
        element={<PrayersPage language={language} setLanguage={setLanguage} />}
      />
    </Routes>
  );
}
