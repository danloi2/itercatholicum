import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';

interface FeaturePlaceholderProps {
  title: string;
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({
  title,
  language,
  setLanguage,
}) => {
  const navigate = useNavigate();

  const content = {
    es: {
      placeholder:
        'Esta sección está actualmente en desarrollo. Pronto podrás consultar contenido sagrado aquí.',
      back: 'Volver al Inicio',
    },
    la: {
      placeholder: 'Haec sectio nunc in progressu est. Mox sacrum contentum hic consulere poteris.',
      back: 'Redire ad Initium',
    },
  };

  const t = content[language];

  return (
    <>
      <UnifiedHeader language={language} setLanguage={setLanguage} pageTitle={title} />

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fdfbf7]">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl border border-stone-200 text-center font-serif text-[#5c4033]">
          <div className="w-20 h-20 bg-[#f4ecd8] rounded-full flex items-center justify-center text-[#8b5a2b] mx-auto mb-6">
            <Construction className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="leading-relaxed italic">{t.placeholder}</p>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center justify-center w-12 h-12 rounded-full shadow-xl hover:scale-105 transition-all active:scale-95 group relative border border-stone-200',
            'bg-white/80 backdrop-blur-sm bg-linear-to-b from-stone-50 to-white text-slate-700'
          )}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-[#5c4033] text-[#f4ecd8] text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none">
            {language === 'la' ? 'INITIUM' : 'INICIO'}
          </span>
        </button>
      </div>
      <Footer language={language} />
    </>
  );
};

export default FeaturePlaceholder;
