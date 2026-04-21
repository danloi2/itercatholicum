import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { parseBibleReference, getBibleReferenceUrl } from '@features/bible/utils/bibleNavigation';
import { type Lectura, getLecturaLabel } from '../services/lectionaryService';
import { ContentCanvas, CanvasInitial } from '@shared/components/ContentCanvas';
import { cn } from '@shared/lib/utils';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/ui/hover-card';
import { BIBLE_BOOKS } from '@features/bible/constants/bibleVersions';
import { BIBLE_INCIPITS } from '@shared/constants/bibleIncipits';

interface MassReadingProps {
  lectura: Lectura;
  index: number;
  language: 'es' | 'la';
  id?: string;
  allTypes?: string[];
}

// ── Liturgical symbols ───────────────────────────────────────────────────

const LiturgicalMark = ({ children, className }: { children: string; className?: string }) => {
  const isRes = children.includes('R') || children.includes('℟');
  const isVer = children.includes('V') || children.includes('℣');
  
  // Normalize to the beautiful specialized characters
  const char = isRes ? '℟' : (isVer ? '℣' : children);
  
  // Tooltip text
  const tooltip = isRes 
    ? "Responsorio (Respuesta del pueblo)" 
    : (isVer ? "Versículo (lo dice el lector, salmista o celebrante)" : "");

  if (!tooltip) {
    return (
      <span className={cn(
        "font-serif font-black text-[#c45a5a] drop-shadow-sm italic",
        "text-[1.35em] leading-none select-none",
        "tracking-tighter inline-block align-middle",
        className
      )}>
        {char}
      </span>
    );
  }

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span 
          className={cn(
            "font-serif font-black text-[#c45a5a] drop-shadow-sm italic cursor-help",
            "text-[1.35em] leading-none select-none",
            "tracking-tighter inline-block align-middle",
            className
          )} 
          style={{ 
            fontFamily: '"EB Garamond", Georgia, serif', 
            fontVariant: 'small-caps',
            textDecoration: 'none'
          }}
        >
          {char}
        </span>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-auto max-w-[300px] p-3 text-xs font-sans bg-[#fdfbf7] border-[#c49b9b] shadow-xl">
        <div className="flex items-center gap-2">
           <span className="font-serif font-black text-[#c45a5a] text-lg">{char}</span>
           <span className="font-medium text-[#3d0c0c]">{tooltip}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const GospelCross = () => (
    <div className="flex flex-col items-start justify-center my-6 text-[#8B0000]">
        <svg viewBox="0 0 100 100" className="w-12 h-12 fill-current">
            {/* Artistic cross with Crismón */}
            <path d="M50 5 L50 95 M40 15 L60 15 M50 5 C65 5 65 35 50 35 M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
    </div>
);

// ── Sub-components for different reading parts ───────────────────────────

/**
 * Renders the header with title (left) and reference (right)
 */
const ReadingHeader = ({ title, reference, isChant, language }: { 
    title: string; 
    reference?: string; 
    isChant: boolean;
    language: 'es' | 'la';
}) => {
    // Extract forma breve/larga/longe/brevis into a badge instead of text
    const shapeMatch = title.match(/\((forma.*?)\)/i);
    const cleanTitle = title.replace(/\s*\((forma.*?)\)\s*/i, '').trim();
    const badgeText = shapeMatch ? shapeMatch[1] : null;

    return (
        <div className="flex justify-between items-baseline mb-6 border-b border-[#8B0000]/10 pb-2">
            <div className="flex flex-col gap-1">
                <h2 className={cn(
                    "text-[#8B0000] uppercase tracking-wider font-sans",
                    isChant ? "text-[1.125em] md:text-[1.25em] font-normal lowercase first-letter:uppercase" : "text-[1.25em] md:text-[1.5em] font-bold"
                )} style={!isChant ? { fontVariant: 'small-caps' } : undefined}>
                    {cleanTitle}
                </h2>
                {badgeText && (
                    <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[0.6em] md:text-[0.65em] font-bold font-sans uppercase tracking-widest bg-[#8B0000]/10 text-[#8B0000]">
                        {badgeText}
                    </span>
                )}
            </div>
            {reference && (() => {
                const parsed = parseBibleReference(reference);
                if (parsed) {
                    return (
                        <Link 
                            to={getBibleReferenceUrl(parsed)}
                            className="inline-flex items-center gap-1.5 text-[#8B0000] font-sans text-[0.875em] md:text-[1em] font-medium opacity-80 whitespace-nowrap ml-4 hover:opacity-100 hover:underline transition-all underline-offset-4 decoration-[#8B0000]/30 group/ref"
                            title={language === 'la' ? 'Vade ad Bibliam' : 'Ir a la Biblia'}
                        >
                            <Book className="w-3.5 h-3.5 opacity-40 group-hover/ref:opacity-100 transition-opacity" />
                            {reference}
                        </Link>
                    );
                }
                return (
                    <span className="text-[#8B0000] font-sans text-[0.875em] md:text-[1em] font-medium opacity-80 whitespace-nowrap ml-4">
                        {reference}
                    </span>
                );
            })()}
        </div>
    );
};

/**
 * Sans-serif rubric style for incipits/acclamations
 */
const Rubric = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("font-sans text-[#3d0c0c] text-[1em] md:text-[1.125em] mb-4 italic opacity-90", className)}>
        {children}
    </div>
);

/**
 * Renders a psalm text with indentation and red markers.
 */
function PsalmBody({ text }: { text: string }) {
  const stanzas = text
    .split('\n\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="space-y-8 text-[#3d0c0c]">
      {stanzas.map((stanza, si) => {
        const lines = stanza.split('\n').filter((l) => l.length > 0);
        
        return (
          <div key={si} className="pl-8 md:pl-12 border-l-2 border-[#8B0000]/5 py-1">
            <p className="font-serif leading-loose text-[1.125em] md:text-[1.25em] relative">
              <span className="absolute -left-8 md:-left-10 mt-1">
                <LiturgicalMark>℣</LiturgicalMark>
              </span>
              {lines.map((line, li) => {
                const trimmed = line.trim();
                const endsWithR = trimmed.endsWith(' R.') || trimmed.endsWith(' R');
                const content = endsWithR 
                  ? trimmed.replace(/\s+R\.?$/, '') 
                  : trimmed;

                return (
                  <React.Fragment key={li}>
                    {li > 0 && <br />}
                    {content}
                    {endsWithR && (
                      <span className="ml-2">
                        <LiturgicalMark>℟</LiturgicalMark>
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders a generic reading body with drop caps and indented rubrics.
 */
function ReadingBody({ 
    text, 
    type,
    language,
    showInitial
}: { 
    text: string; 
    type: string;
    language: 'es' | 'la';
    showInitial?: boolean;
}) {
  const paragraphs = text
    .split('\n\n')
    .map((p) => p.trimEnd())
    .filter((p) => p.length > 0);
  
  const normType = type.toUpperCase();
  const isGospel = normType.includes('GOSPEL');
  const isComment = normType.includes('COMMENT') || normType.includes('COMENT');
  const isAcclamation = normType.includes('ACCLAMATION');

  return (
    <div className="text-justify font-serif leading-relaxed text-[1.125em] md:text-[1.25em] text-[#3d0c0c]">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n').filter((l) => l.length > 0);
        return (
          <p 
            key={pIdx} 
            className={cn("mb-6 pl-6 md:pl-8 -indent-6 md:-indent-8")}
          >
            {lines.map((line, li) => {
              const isFirstGlobalLine = pIdx === 0 && li === 0;
              return (
                <React.Fragment key={li}>
                  {li > 0 && <br />}
                  {isFirstGlobalLine && showInitial ? (
                    <>
                      <CanvasInitial className={isGospel ? "text-[#8B0000] scale-125 mr-4" : "text-[#3d0c0c]"}>
                        {line.charAt(0).toUpperCase()}
                      </CanvasInitial>
                      <span>{line.substring(1)}</span>
                    </>
                  ) : (
                    line
                  )}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}

      {/* Final Acclamation (not for comments/acclamations) */}
      {!isComment && !isAcclamation && (
        <Rubric className="mt-12 pl-6 md:pl-10 border-l-2 border-[#8B0000]/10 py-2 font-serif text-[1em] md:text-[1em] not-italic text-[#3d0c0c] opacity-100">
            {language === 'la' ? 'Verbum Domini.' : (isGospel ? 'Palabra del Señor.' : 'Palabra de Dios.')}
        </Rubric>
      )}
    </div>
  );
}


// ── Main component ─────────────────────────────────────────────────────────

export const MassReading: React.FC<MassReadingProps> = ({ lectura, index, language, id, allTypes }) => {
  const normType = lectura.type.toUpperCase();
  const isGospel = normType.includes('GOSPEL');
  const isPsalm = normType.includes('PSALM');
  const isAcclamation = normType.includes('ACCLAMATION');
  const isComment = normType.includes('COMMENT') || normType.includes('COMENT');
  const isChant = isPsalm || isAcclamation;
  
  const title = getLecturaLabel(lectura.type, language, allTypes);
  
  const introText = lectura.intro[language];
  const bodyText = lectura.text[language];

  // For comments and acclamations, we use a lighter position behavior or skip symbol logic
  // but we still want the cornice Α/Ω for continuity.
  
  return (
    <ContentCanvas className="mb-16" id={id} position={index % 2 === 0 ? 'odd' : 'even'}>
      {/* Header with Title and Reference (skip for comments if they are very short) */}
      <ReadingHeader 
        title={title} 
        reference={lectura.reference} 
        isChant={isChant || isComment}
        language={language}
      />

      {/* Global Intro (Red, Italic, Serif) */}
      {introText && (
          <div className="mb-4 px-2 md:px-6 flex flex-wrap gap-x-2 items-baseline">
              <span className="italic font-serif text-[#8B0000] text-[1.125em] md:text-[1.25em] leading-snug">
                  {isPsalm && (
                    <>
                      <LiturgicalMark className="text-[0.875em] mr-1">℟</LiturgicalMark>
                      <span className="inline-block w-2" />
                    </>
                  )}
                  {introText}
              </span>
          </div>
      )}

      {/* Book Incipit Line (Below Intro, same style as body text) */}
      {(() => {
        if (isPsalm || isComment || isAcclamation || !lectura.reference) return null;
        
        const getBookId = () => {
          const ref = lectura.reference!.toLowerCase();
          const sortedBooks = [...BIBLE_BOOKS].sort((a, b) => b.acronym.length - a.acronym.length);
          const book = sortedBooks.find(b => ref.includes(b.acronym.toLowerCase()));
          return book?.id;
        };

        const bookId = getBookId();
        const incipit = bookId ? BIBLE_INCIPITS[bookId]?.[language] : null;

        if (!incipit) return null;

        return (
          <div className="mb-8 px-2 md:px-6">
            {isGospel && <GospelCross />}
            <span className="font-serif text-[#3d0c0c] text-[1.125em] md:text-[1.25em] leading-snug">
              {incipit}
            </span>
          </div>
        );
      })()}
      
      {/* Body content */}
      <div className="animate-in fade-in duration-1000">
        {bodyText && (
            isPsalm ? (
                <PsalmBody text={bodyText} />
            ) : (
                <ReadingBody 
                    text={bodyText} 
                    type={lectura.type} 
                    language={language} 
                    showInitial={!isComment && !isAcclamation}
                />
            )
        )}
      </div>
    </ContentCanvas>
  );
};
