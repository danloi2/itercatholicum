import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import { HomePage } from '@features/home';
import { CalendarPage } from '@features/calendar';
import { BiblePage } from '@features/bible';
import { PrayersPage } from '@features/prayers';
import { MassPage } from '@features/mass';
import { SettingsProvider } from '@shared/context/SettingsContext';

export default function App() {
  const [language, setLanguage] = useState<'es' | 'la'>('es');

  return (
    <SettingsProvider>
      <Routes>
        <Route element={<AppLayout language={language} setLanguage={setLanguage} />}>
          <Route path="/" element={<HomePage language={language} />} />
          <Route
            path="/calendar"
            element={<CalendarPage language={language} year={new Date().getFullYear()} />}
          />
          <Route path="/bible" element={<BiblePage language={language} />} />
          <Route path="/mass" element={<MassPage language={language} />} />
          <Route path="/prayers" element={<PrayersPage language={language} />} />
        </Route>
      </Routes>
    </SettingsProvider>
  );
}
