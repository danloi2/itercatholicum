import React, { useState, useEffect } from 'react';

interface SecondHeaderProps {
  language: 'es' | 'la';
}

const SecondHeader: React.FC<SecondHeaderProps> = ({ language }) => {
  const content = {
    es: {
      heroSubtitle:
        'Tu compañero espiritual digital: Calendario, Biblia, Misa y Oración en un solo lugar.',
    },
    la: {
      heroSubtitle:
        'Comes tuus spiritualis digitalis: Calendarium, Biblia, Missa et Oratio in uno loco.',
    },
  };

  const t = content[language];
  const fullText = t.heroSubtitle;

  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(70);

  useEffect(() => {
    const handleType = () => {
      setDisplayText((current) => {
        if (!isDeleting) {
          if (current.length < fullText.length) {
            setTypingSpeed(70);
            return fullText.substring(0, current.length + 1);
          } else {
            setTypingSpeed(3000);
            setIsDeleting(true);
            return current;
          }
        } else {
          if (current.length > 0) {
            setTypingSpeed(40);
            return fullText.substring(0, current.length - 1);
          } else {
            setTypingSpeed(1000);
            setIsDeleting(false);
            return '';
          }
        }
      });
    };

    const timerId = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timerId);
  }, [displayText, isDeleting, fullText, typingSpeed]);

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[40px] mb-4">
      <p className="text-sm md:text-lg text-[#522b2b] italic font-serif leading-tight opacity-90 inline-flex items-center text-center px-4">
        {displayText}
        <span className="w-0.5 h-4 md:h-5 bg-[#8B0000] ml-1.5 animate-pulse" />
      </p>
    </div>
  );
};

export default SecondHeader;
