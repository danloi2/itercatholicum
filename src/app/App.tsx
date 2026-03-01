import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from '@features/home/pages/HomePage';
import CalendarPage from '@features/calendar/pages/CalendarPage';
import BiblePage from '@features/bible/pages/BiblePage';
import PrayersPage from '@features/prayers/pages/PrayersPage';
import FeaturePlaceholder from '@features/home/components/FeaturePlaceholder';

export default function App() {
  const [language, setLanguage] = useState<'es' | 'la'>('es');

  return (
    <Routes>
      <Route element={<AppLayout language={language} setLanguage={setLanguage} />}>
        <Route path="/" element={<Home language={language} />} />
        <Route
          path="/calendar"
          element={<CalendarPage language={language} year={new Date().getFullYear()} />}
        />
        <Route path="/bible" element={<BiblePage language={language} />} />
        <Route
          path="/mass"
          element={<FeaturePlaceholder title="Santa Misa" language={language} />}
        />
        <Route path="/prayers" element={<PrayersPage language={language} />} />
      </Route>
    </Routes>
  );
}
