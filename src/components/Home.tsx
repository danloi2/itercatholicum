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
    <>
      <UnifiedHeader language={language} setLanguage={setLanguage} />

      {/* Typewriter Animation Section */}
      <div className="bg-[#fefdfa] border-b border-[#c49b9b]/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[2em] flex flex-col justify-center items-center gap-6">
            <p className="text-base md:text-lg text-[#522b2b] italic leading-none opacity-80 inline-flex items-center text-center">
              {displayText}
              <span className="w-0.5 h-5 bg-[#8B0000] ml-1 animate-pulse" />
            </p>

            {/* Today's Liturgical Card */}
            {todayData && (
              <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div
                  onClick={() => navigate('/calendar')}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <DayCard day={todayData} isToday={true} language={language} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#fdfbf7]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => navigate(section.path)}
              className="group relative flex flex-col items-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-[#c49b9b] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center hover:bg-[#fefdfa]"
            >
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-[#c49b9b]/50 shadow-inner group-hover:scale-110 transition-transform duration-500',
                  section.color
                )}
              >
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-[#8B0000] transition-colors">
                {section.title}
              </h2>
              <p className="text-[#8B0000]/80 text-base leading-relaxed serif italic">
                {section.description}
              </p>
            </button>
          ))}
        </div>
      </main>
      <Footer language={language} />
    </>
  );
};

export default Home;
