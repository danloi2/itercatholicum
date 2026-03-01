import AboutModal from '@features/home/components/AboutModal';
import { GitHubIcon } from '@shared/components/icons/GitHubIcon';
import { StoleIcon } from '@shared/components/icons/StoleIcon';
import { useGitHubVersion } from '@shared/hooks/useGitHubVersion';

interface FooterProps {
  language: 'es' | 'la';
}

export default function Footer({ language }: FooterProps) {
  const version = useGitHubVersion();

  return (
    <footer className="py-6 px-4 text-center border-t border-[#c49b9b]/30 bg-[#f4e2e2]/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-left">
          <StoleIcon size={32} color="#8B0000" className="opacity-80" />
          <div>
            <p className="text-lg font-bold text-[#522b2b]">
              Iter <span className="text-[#8B0000]">Catholicum</span>
            </p>
            <p className="text-sm text-[#8B0000]/80 mt-1">
              © {new Date().getFullYear()} Daniel Losada •{' '}
              {language === 'la' ? 'Licentia MIT' : 'Licencia MIT'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AboutModal
            language={language}
            trigger={
              <button className="text-sm font-bold text-[#522b2b] hover:text-[#8B0000] transition-colors cursor-pointer uppercase tracking-widest">
                {language === 'la' ? 'De Iter Catholico' : 'Acerca de'}
              </button>
            }
          />
          <span className="text-[#c49b9b]">|</span>
          <a
            href="https://github.com/danloi2/itercatholicum"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-sm font-bold text-[#522b2b] hover:text-[#8B0000] transition-colors uppercase tracking-widest"
            title="GitHub Repository"
          >
            <GitHubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
          <div className="hidden sm:flex items-center bg-[#ebd6d6]/50 px-2 py-0.5 rounded-full border border-[#c49b9b]/30">
            <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-tighter">
              {version.startsWith('v') ? version : `v${version}`}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
