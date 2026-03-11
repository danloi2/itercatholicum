import React from 'react';
import { Search, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@ui/dialog';
import { type DailyLectiones, getLecturaLabel } from '../../services/lectionaryService';

interface MassReadingSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lectiones: DailyLectiones | null;
  language?: 'la' | 'es';
}

interface TextMatch {
  id: string;
  title: string;
  snippet: string;
}

export default function MassReadingSearch({
  open,
  onOpenChange,
  lectiones,
  language = 'la',
}: MassReadingSearchProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [matches, setMatches] = React.useState<TextMatch[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setInputValue('');
      setMatches([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (!inputValue.trim() || inputValue.length < 2 || !lectiones) {
      setMatches([]);
      return;
    }

    const normalize = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const query = normalize(inputValue);
    const results: TextMatch[] = [];

    const allTypes = lectiones.lecturas.map((l) => l.type);

    lectiones.lecturas.forEach((lectura, index) => {
      const fullText = [lectura.intro[language], lectura.text[language]]
        .filter(Boolean)
        .join(' ');
      const normalizedText = normalize(fullText);

      if (normalizedText.includes(query)) {
        const idx = normalizedText.indexOf(query);
        const start = Math.max(0, idx - 40);
        const end = Math.min(fullText.length, idx + query.length + 80);
        let snippet = fullText.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < fullText.length) snippet = snippet + '...';

        results.push({
          id: `lectura-${index}`,
          title: getLecturaLabel(lectura.type, language, allTypes),
          snippet,
        });
      }
    });

    setMatches(results);
  }, [inputValue, lectiones, language]);

  const handleSelect = (id: string) => {
    onOpenChange(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && matches.length > 0) {
      handleSelect(matches[0].id);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="font-bold text-[#8B0000] bg-[#8B0000]/10 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 gap-0 bg-[#fdfbf7] border-2 border-[#8B0000]/20 sm:rounded-xl overflow-hidden">
        <DialogTitle className="sr-only">
          {language === 'la' ? 'Quaerere in lectionibus' : 'Buscar en las lecturas'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {language === 'la'
            ? 'Quaerere verba in hodiernis lectionibus.'
            : 'Busca palabras en las lecturas de hoy.'}
        </DialogDescription>
        <div className="flex flex-col h-full">
          {/* Search Input */}
          <div className="flex items-center border-b border-[#c49b9b] px-4">
            <Search className="w-5 h-5 text-[#8B0000] mr-2 opacity-50" />
            <input
              ref={inputRef}
              className="flex w-full h-14 py-3 text-lg bg-transparent outline-none placeholder:text-[#c49b9b] text-[#3d0c0c] font-serif"
              placeholder={language === 'la' ? 'Quaerere in texto...' : 'Buscar en el texto...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">
            {matches.length > 0 ? (
              <div className="flex flex-col gap-1">
                {matches.map((match, idx) => (
                  <button
                    key={`${match.id}-${idx}`}
                    onClick={() => handleSelect(match.id)}
                    className="flex flex-col p-4 rounded-xl hover:bg-[#8B0000]/5 transition-all text-left border border-transparent hover:border-[#8B0000]/10 group"
                  >
                    <span className="text-sm font-bold text-[#8B0000] mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 opacity-70" />
                        <span className="opacity-60 font-serif uppercase tracking-widest text-[10px]">
                          {match.title.replace(/\s*\((forma.*?)\)\s*/i, '').trim()}
                        </span>
                      </div>
                      {match.title.match(/\((forma.*?)\)/i) && (
                        <span className="inline-flex w-fit items-center px-1.5 py-0.5 rounded-full text-[0.55em] font-bold font-sans uppercase tracking-widest bg-[#8B0000]/10 text-[#8B0000] ml-2">
                          {match.title.match(/\((forma.*?)\)/i)![1]}
                        </span>
                      )}
                    </span>
                    <p className="text-[#3d0c0c] font-serif leading-relaxed line-clamp-3">
                      {highlightMatch(match.snippet, inputValue)}
                    </p>
                  </button>
                ))}
              </div>
            ) : inputValue.length >= 2 ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#c49b9b]">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">
                  {language === 'la' ? 'Nulla inventa' : 'No se encontraron resultados'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-[#c49b9b]">
                <p className="text-center font-serif italic max-w-sm">
                  {language === 'la'
                    ? 'Scribe ad minus duo elementa ad quaerendum.'
                    : 'Escribe al menos dos letras para buscar.'}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-[#c49b9b] px-4 py-3 text-[10px] text-[#8B0000]/50 flex justify-between uppercase tracking-tighter bg-[#8B0000]/5">
            <span>{language === 'la' ? 'Intra ad eligendum' : 'Enter para seleccionar'}</span>
            <span>Esc para cerrar</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
