import React from 'react';
import { DecorativeSeparator } from '@shared/components/icons/DecorativeSeparator';

interface PrayerReaderViewProps {
  language: 'es' | 'la';
  title: string;
  content: string[];
}

const PrayerReaderView: React.FC<PrayerReaderViewProps> = ({ title, content }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div
        className="relative p-4 md:p-8 mx-auto shadow-2xl rounded-sm min-h-[40vh] overflow-hidden"
        style={{
          backgroundColor: 'rgb(253, 251, 247)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2' fill='%23c49b9b' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
          }}
        />

        <div className="relative font-serif text-[#3d0c0c] text-justify leading-[1.9]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold font-serif text-[#8b0000] italic">{title}</h2>
            <div className="w-24 h-0.5 bg-[#8b0000]/20 mx-auto mt-4" />
          </div>

          <div className="text-justify">
            {content.map((line, idx) => (
              <p key={idx} className="mb-1.5">
                {idx === 0 ? (
                  <>
                    <span className="text-5xl font-bold text-[#8b0000] font-serif mr-1">
                      {line.charAt(0).toUpperCase()}
                    </span>
                    {line.substring(1)}
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center opacity-40">
          <DecorativeSeparator />
        </div>
      </div>
    </div>
  );
};

export default PrayerReaderView;
