import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Nav() {
  return (
    <nav className="rise d1 relative z-10 flex justify-center gap-10 px-6 py-5 border-b border-white/[0.05]" aria-label="Main navigation">
      <a href="/resume" className="text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors">
        Resume
      </a>
      <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors"
        aria-label="LinkedIn (opens in new tab)">
        <FontAwesomeIcon icon={faLinkedinIn} className="w-3 h-3" />
        LinkedIn
      </a>
      <a href="https://github.com/derekthedev" target="_blank" rel="noreferrer"
        className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-gray-300 hover:text-orange-400 transition-colors"
        aria-label="GitHub (opens in new tab)">
        <FontAwesomeIcon icon={faGithub} className="w-3 h-3" />
        GitHub
      </a>
    </nav>
  );
}
