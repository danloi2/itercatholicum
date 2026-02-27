import { useState, useMemo } from 'react';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import PrayersCommandPalette from '@/components/PrayersCommandPalette';
import { BookOpen, Quote, ArrowLeft, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

// Type for prayer structure
interface Prayer {
  id: string;
  title: Record<string, string>;
  content: Record<string, string[]>;
  category?: string;
}

// Dynamically load all prayers from the orationes directory
const prayerModules = import.meta.glob('@/data/orationes/*.json', { eager: true });
const allPrayers = Object.values(prayerModules).map((mod: any) => mod.default as Prayer);

interface PrayersPageProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

export default function PrayersPage({ language, setLanguage }: PrayersPageProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'LIST' | 'READ'>('LIST');
  const [selectedPrayerId, setSelectedPrayerId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const prayers = useMemo(() => allPrayers, []);

  const selectedPrayer = useMemo(
    () => prayers.find((p) => p.id === selectedPrayerId),
    [prayers, selectedPrayerId]
  );

  const pageTitle = language === 'la' ? 'Orationes' : 'Oraciones';

  const pageTitleNode = (
    <div className="flex items-center gap-2">
      <NavigationMenu className="h-auto">
        <NavigationMenuList className="h-auto">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              onClick={() => {
                setViewMode('LIST');
                setSelectedPrayerId(null);
              }}
              className={cn(
                'flex items-center justify-center bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shrink-0 transition-all hover:scale-105 active:scale-95 group border-none outline-none data-[state=open]:scale-105 [&>svg]:hidden',
                viewMode === 'READ' ? 'h-11 md:h-14 px-4 md:px-6' : 'h-14 md:h-20 px-8 md:px-12'
              )}
            >
              <span
                className={cn(
                  'font-bold tracking-tight text-white group-hover:text-white/90 whitespace-nowrap',
                  viewMode === 'READ' ? 'text-sm md:text-lg' : 'text-xl md:text-3xl'
                )}
              >
                {pageTitle}
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-1 bg-[#fdfbf7] border-[#c49b9b] shadow-xl rounded-md min-w-[220px] animate-in fade-in zoom-in-95 duration-200">
                <ScrollArea className="max-h-[350px]">
                  <div className="p-1 space-y-1">
                    {prayers.map((prayer) => (
                      <button
                        key={prayer.id}
                        onClick={() => {
                          setSelectedPrayerId(prayer.id);
                          setViewMode('READ');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={cn(
                          'w-full text-left p-2.5 text-sm hover:bg-[#ebd6d6] rounded cursor-pointer text-[#3d0c0c] font-serif block transition-colors',
                          selectedPrayerId === prayer.id && 'bg-[#ebd6d6] font-bold'
                        )}
                      >
                        {prayer.title[language]}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Prayer Chip (only in READ mode) */}
      {viewMode === 'READ' && selectedPrayer && (
        <div className="flex items-center shrink-0 animate-in slide-in-from-left-2 duration-300">
          <span className="text-[#c49b9b] opacity-50 mx-1 md:mx-2 text-xl md:text-2xl">/</span>
          <div className="flex flex-col items-center justify-center bg-linear-to-r from-amber-600 to-orange-600 px-4 md:px-8 h-11 md:h-14 rounded-xl shadow-lg">
            <span className="font-bold tracking-tight text-white text-sm md:text-lg whitespace-nowrap">
              {selectedPrayer.title[language]}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <UnifiedHeader
        language={language}
        setLanguage={setLanguage}
        pageTitle={pageTitleNode}
        centerChildren
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {viewMode === 'LIST' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 bg-[#8B0000]/5 rounded-full mb-2">
                <BookOpen className="w-8 h-8 text-[#8B0000]" />
              </div>
              <h2 className="text-2xl font-bold text-[#3d0c0c]">
                {language === 'la' ? 'Thesaurus Precum' : 'Tesoro de Oraciones'}
              </h2>
              <p className="text-[#522b2b] font-serif italic opacity-70">
                {language === 'la' ? '"Domine, doce nos orare..."' : '"Señor, enséñanos a orar..."'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {prayers.map((prayer) => (
                <button
                  key={prayer.id}
                  onClick={() => {
                    setSelectedPrayerId(prayer.id);
                    setViewMode('READ');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-4 p-4 md:p-5 bg-white border border-[#c49b9b]/20 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all text-left group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-stone-50 flex items-center justify-center group-hover:bg-[#8B0000]/10 transition-colors">
                    <Quote className="w-6 h-6 md:w-7 md:h-7 text-[#8B0000]/40 group-hover:text-[#8B0000]/60" />
                  </div>
                  <div className="flex flex-col gap-1.5 items-start overflow-hidden">
                    <h3 className="text-lg md:text-xl font-black tracking-tight text-[#3d0c0c] leading-tight line-clamp-1">
                      {prayer.title[language]}
                    </h3>
                    <div className="h-1 w-6 bg-[#8B0000]/10 rounded-full group-hover:w-10 group-hover:bg-[#8B0000]/30 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            {prayers.length === 0 && (
              <div className="text-center py-20 bg-stone-50 rounded-3xl border border-dashed border-[#c49b9b]/30">
                <BookOpen className="w-12 h-12 text-[#c49b9b]/40 mx-auto mb-4" />
                <p className="text-[#522b2b] font-serif">
                  {language === 'la' ? 'Nulla oratio inventa' : 'No se encontraron oraciones'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            {selectedPrayer && (
              <div
                className="relative p-4 md:p-8 mt-4 mx-auto shadow-2xl rounded-sm min-h-[40vh] overflow-hidden"
                style={{
                  backgroundColor: 'rgb(253, 251, 247)',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23c49b9b' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              >
                {/* Paper texture overlay */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    background:
                      'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
                  }}
                />

                <div
                  className="relative font-serif text-[#3d0c0c] text-justify leading-relaxed"
                  style={{ fontSize: '1.1rem' }}
                >
                  {selectedPrayer.content[language].map((line, idx) => {
                    if (idx === 0) {
                      const firstLetter = line[0];
                      const restOfLine = line.substring(1);
                      return (
                        <span key={idx} className="block mb-4">
                          <span className="float-left text-7xl font-bold text-[#8b0000] leading-[0.8] mr-2 mt-1 font-serif drop-shadow-sm select-none">
                            {firstLetter}
                          </span>
                          {restOfLine}
                        </span>
                      );
                    }
                    return (
                      <p key={idx} className="mb-4">
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Decorative Footer */}
                <div className="mt-8 flex justify-center opacity-40">
                  <svg
                    width="100"
                    height="20"
                    viewBox="0 0 100 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 10C20 10 30 0 50 0C70 0 80 10 100 10C80 10 70 20 50 20C30 20 20 10 0 10Z"
                      fill="#8B0000"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer language={language} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative bg-linear-to-r from-amber-600 to-orange-600 shadow-amber-200/50"
          title={language === 'la' ? 'Index' : 'Contenido'}
        >
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none uppercase">
            {language === 'la' ? 'Index' : 'Contenido'}
          </span>
        </button>

        <button
          onClick={() => {
            const randomId = prayers[Math.floor(Math.random() * prayers.length)].id;
            setSelectedPrayerId(randomId);
            setViewMode('READ');
          }}
          className="flex items-center justify-center w-12 h-12 text-white rounded-full shadow-2xl hover:scale-105 transition-all active:scale-95 group relative bg-linear-to-r from-[#8B0000] to-[#522b2b] shadow-[#8B0000]/30"
          title={language === 'la' ? 'Temere' : 'Aleatorio'}
        >
          <Shuffle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none uppercase">
            {language === 'la' ? 'Temere' : 'Aleatorio'}
          </span>
        </button>

        <button
          onClick={() => {
            if (viewMode === 'READ') {
              setViewMode('LIST');
            } else {
              navigate('/');
            }
          }}
          className="flex items-center justify-center w-12 h-12 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200 bg-white/90 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700"
          title={language === 'la' ? 'Retro' : 'Atrás'}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-[#8B0000]" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none uppercase">
            {language === 'la' ? 'Retro' : 'Atrás'}
          </span>
        </button>
      </div>

      <PrayersCommandPalette
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onSelect={(id) => {
          setSelectedPrayerId(id);
          setViewMode('READ');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        prayers={prayers}
      />
    </div>
  );
}
