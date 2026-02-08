import React from 'react';
import { useGitHubVersion } from '@/hooks/useGitHubVersion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from './ui/dialog';
import { Info, Cpu, ExternalLink, Shield } from 'lucide-react';
import { GitHubIcon } from './icons/GitHubIcon';

interface AboutModalProps {
  language: 'es' | 'la';
  trigger?: React.ReactNode;
}

export default function AboutModal({ language, trigger }: AboutModalProps) {
  const version = useGitHubVersion();

  const content = {
    es: {
      title: 'Acerca de Iter Catholicum',
      appDesc:
        'Iter Catholicum es una herramienta diseñada para facilitar la vivencia de la liturgia católica. Desde el calendario litúrgico hasta la lectura de la Palabra, buscamos ofrecer una experiencia fluida y hermosa.',
      version: 'Versión',
      technologies: 'Tecnologías',
      author: 'Autor y Desarrollador',
      license: 'Licencia MIT',
      links: {
        github: 'Repositorio GitHub',
        researcher: 'Investigador EHU',
      },
    },
    la: {
      title: 'De Iter Catholico',
      appDesc:
        'Iter Catholicum instrumentum est ad liturgiam catholicam facilius vivendam designatum. A calendario liturgico usque ad Verbi lectionem, experientiam fluenter ac pulchram praebere volumus.',
      version: 'Versio',
      technologies: 'Technologiae',
      author: 'Auctor et Evolutor',
      license: 'Licentia MIT',
      links: {
        github: 'Repositorium GitHub',
        researcher: 'Inquisitor EHU',
      },
    },
  };

  const t = content[language];

  const technologies = [
    { name: 'React 19', url: 'https://react.dev' },
    { name: 'TypeScript', url: 'https://www.typescriptlang.org' },
    { name: 'Vite', url: 'https://vitejs.dev' },
    { name: 'Tailwind CSS 4', url: 'https://tailwindcss.com' },
    { name: 'Lucide Icons', url: 'https://lucide.dev' },
    { name: 'Radix UI', url: 'https://www.radix-ui.com' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-medium text-slate-700">
            <Info className="w-4 h-4" />
            {t.title}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh] bg-[#fdfbf7] border-[#c49b9b]/30 font-serif">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-[#3d0c0c]">
            <div className="w-10 h-10 bg-[#8B0000]/10 rounded-xl flex items-center justify-center text-[#8B0000]">
              <Info className="w-6 h-6" />
            </div>
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-left mt-4 text-base leading-relaxed text-[#522b2b]">
            {t.appDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#c49b9b] uppercase tracking-widest mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> {t.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <a
                    key={tech.name}
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/50 border border-[#c49b9b]/20 rounded-lg text-xs font-semibold text-[#522b2b] hover:bg-white hover:shadow-md transition-all group"
                  >
                    {tech.name}
                    <ExternalLink className="w-3 h-3 text-[#c49b9b] group-hover:text-[#8B0000] transition-all" />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#8B0000]/5 rounded-2xl border border-[#8B0000]/10">
              <h3 className="text-sm font-bold text-[#8B0000] uppercase tracking-widest mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> {t.license}
              </h3>
              <p className="text-sm text-[#522b2b] font-medium opacity-80">
                © {new Date().getFullYear()} Daniel Losada
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#c49b9b] uppercase tracking-widest mb-3 flex items-center gap-2">
                <GitHubIcon className="w-4 h-4" /> {t.author}
              </h3>
              <div className="space-y-4">
                <p className="text-lg font-bold text-[#3d0c0c]">Daniel Losada</p>

                <div className="flex flex-col gap-2">
                  <a
                    href="https://github.com/danloi2/itercatholicum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 rounded-xl transition-all group font-bold text-[#8B0000] mt-4"
                  >
                    <GitHubIcon className="w-5 h-5" />
                    {t.links.github}
                    <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                  <a
                    href="https://github.com/danloi2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all group font-medium text-stone-700"
                  >
                    <Shield className="w-4 h-4" />
                    {t.links.researcher}
                    <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#c49b9b]/20">
              <div className="flex items-center justify-between text-xs font-bold text-[#c49b9b] uppercase tracking-[0.2em]">
                <span>{t.version}</span>
                <span className="text-[#8B0000] bg-[#8B0000]/10 px-2 py-0.5 rounded-full">
                  {version.startsWith('v') ? version : `v${version}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
