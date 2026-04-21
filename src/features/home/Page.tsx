import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Book, Church, Heart } from 'lucide-react';
import { cn } from '@shared/lib/utils';
import { useLayout } from '@app/layout/LayoutContext';

import SecondHeader from './components/SecondHeader';

interface PageProps {
  language: 'es' | 'la';
}

const Page: React.FC<PageProps> = ({ language }) => {
  const navigate = useNavigate();
  const { setHeaderProps } = useLayout();

  useEffect(() => {
    setHeaderProps({
      centerChildren: true,
    }); // Center second header content
  }, [setHeaderProps]);

  const content = {
    es: {
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
          description: 'Sigue el orden de la Santa Misa',
        },
        prayers: {
          title: 'Oraciones',
          description: 'Devocionario y oraciones de la tradición cristiana.',
        },
      },
    },
    la: {
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
          description: 'Ordinem Sanctae Missae sequere.',
        },
        prayers: {
          title: 'Orationes',
          description: 'Devotionarium et orationes christianae.',
        },
      },
    },
  };

  const t = content[language];

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
      disabled: true,
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
    <div className="flex flex-col flex-1">
      <SecondHeader language={language} />
      <div className="flex-1 flex flex-col pt-2 md:pt-6">
        <div className="flex-1 flex items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-2">
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
                  {React.isValidElement(section.icon)
                    ? React.cloneElement(
                        section.icon as React.ReactElement<{ className?: string }>,
                        {
                          className: 'w-5 h-5 md:w-6 md:h-6',
                        }
                      )
                    : section.icon}
                </div>
                <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-1.5 group-hover:text-[#8B0000] transition-colors">
                  {section.title}
                </h2>
                <p className="text-[#8B0000]/80 text-sm md:text-xl leading-relaxed font-serif italic">
                  {section.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
