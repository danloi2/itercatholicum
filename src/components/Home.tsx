import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Book, Church, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnifiedHeader from '@/components/UnifiedHeader';
import Footer from '@/components/Footer';
import DayCard from '@/components/DayCard';
import { useCalendar } from '@/hooks/use-calendar';

interface HomeProps {
  language: 'es' | 'la';
  setLanguage: (lang: 'es' | 'la') => void;
}

const Home: React.FC<HomeProps> = ({ language, setLanguage }) => {
  const navigate = useNavigate();
  const { data: calendarData, generateData } = useCalendar();
  const [targetYear] = React.useState(new Date().getFullYear());

  React.useEffect(() => {
    generateData(targetYear, language);
  }, [targetYear, language, generateData]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayData = calendarData[todayStr]?.[0];

  const content = {
    es: {
      heroSubtitle:
        'Tu compañero espiritual digital: Calendario, Biblia, Misa y Oración en un solo lugar.',
      sections: {
        calendar: {
          title: 'Calendario Litúrgico',
          description: 'Consulta las festividades y tiempos litúrgicos del año.',
        },
        bible: {
          title: 'Sagrada Biblia',
          description: 'La Palabra de Dios a tu alcance.',
        },
        mass: {
          title: 'Santa Misa',
          description: 'Sigue el orden de la Santa Misa (Próximamente).',
        },
        prayers: {
          title: 'Oraciones',
          description: 'Devocionario y oraciones cristianas (Próximamente).',
        },
      },
    },
    la: {
      heroSubtitle:
        'Comes tuus spiritualis digitalis: Calendarium, Biblia, Missa et Oratio in uno loco.',
      sections: {
        calendar: {
          title: 'Calendarium Liturgicum',
          description: 'Festa et tempora liturgica anni consule.',
        },
        bible: {
          title: 'Sacra Biblia',
          description: 'Verbum Dei in manibus tuis.',
        },
        mass: {
          title: 'Sancta Missa',
          description: 'Ordinem Sanctae Missae sequere (Mox venturum).',
        },
        prayers: {
          title: 'Orationes',
          description: 'Devotionarium et orationes christianae (Mox venturum).',
        },
      },
    },
  };

  const t = content[language];
  const fullText = t.heroSubtitle;

  const [displayText, setDisplayText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [typingSpeed, setTypingSpeed] = React.useState(70);

  React.useEffect(() => {
    let timer: any;

    const handleType = () => {
      setDisplayText((current) => {
        if (!isDeleting) {
          // Typing
          if (current.length < fullText.length) {
            setTypingSpeed(70);
            return fullText.substring(0, current.length + 1);
          } else {
            // End of typing, wait before deleting
            setTypingSpeed(3000); // 3 seconds pause
            setIsDeleting(true);
            return current;
          }
        } else {
          // Deleting
          if (current.length > 0) {
            setTypingSpeed(40);
            return fullText.substring(0, current.length - 1);
          } else {
            // End of deleting, wait before restarting
            setTypingSpeed(1000);
            setIsDeleting(false);
            return '';
          }
        }
      });
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText, typingSpeed]);

  const sections = [
    {
      id: 'calendar',
      title: t.sections.calendar.title,
      icon: <Calendar className="w-7 h-7" />,
      description: t.sections.calendar.description,
      color: 'text-[#8B0000] bg-[#fdfbf7]',
      path: '/calendar',
    },
    {
      id: 'bible',
      title: t.sections.bible.title,
      icon: <Book className="w-7 h-7" />,
      description: t.sections.bible.description,
      color: 'text-[#522b2b] bg-[#fdfbf7]',
      path: '/bible',
    },
    {
      id: 'mass',
      title: t.sections.mass.title,
      icon: <Church className="w-7 h-7" />,
      description: t.sections.mass.description,
      color: 'text-[#8B0000] bg-[#fdfbf7]',
      path: '/mass',
    },
    {
      id: 'prayers',
      title: t.sections.prayers.title,
      icon: <Heart className="w-7 h-7" />,
      description: t.sections.prayers.description,
      color: 'text-[#522b2b] bg-[#fdfbf7]',
      path: '/prayers',
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#fdfbf7]">
      <UnifiedHeader language={language} setLanguage={setLanguage} />

      {/* Today's Liturgical Card Section (Restored to Top) */}
      <div className="bg-[#fefdfa] border-b border-[#c49b9b]/20 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-center items-center">
            {todayData && (
              <div className="w-full max-w-2xl transform transition-all duration-500 animate-in fade-in slide-in-from-top-2">
                <div
                  onClick={() => navigate('/calendar')}
                  className="cursor-pointer hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <DayCard day={todayData} isToday={true} language={language} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-4">
        {/* Buttons Grid Section */}
        <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => navigate(section.path)}
                className="group relative flex flex-col items-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#c49b9b]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center hover:bg-[#fefdfa] hover:border-[#8B0000]/30"
              >
                <div
                  className={cn(
                    'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4 border border-[#c49b9b]/50 shadow-inner group-hover:scale-110 transition-transform duration-500',
                    section.color
                  )}
                >
                  {React.cloneElement(section.icon as any, {
                    className: 'w-5 h-5 md:w-6 md:h-6',
                  })}
                </div>
                <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-1.5 group-hover:text-[#8B0000] transition-colors">
                  {section.title}
                </h2>
                <p className="text-[#8B0000]/80 text-[11px] md:text-xs leading-relaxed serif italic">
                  {section.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Typewriter Animation Section (Keep Below Buttons) */}
        <div className="py-6 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm md:text-[20px] text-[#522b2b] italic font-serif leading-tight opacity-90 inline-flex items-center text-center px-4">
                {displayText}
                <span className="w-0.5 h-4 md:h-6 bg-[#8B0000] ml-1.5 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Home;
