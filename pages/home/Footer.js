import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { contactLinks } from "../../data/home-data";

export default function Footer() {
  return (
    <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-10" aria-label="Contact">
      <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(251,146,60,0.3),transparent)', marginBottom: '2rem' }} />
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        {contactLinks.map(({ href, label, icon, ariaLabel }) => (
          <a key={label} href={href} aria-label={ariaLabel}
            className="contact-link flex items-center gap-2 text-[12px] text-gray-300 hover:text-orange-400 transition-colors tracking-[0.06em]">
            <FontAwesomeIcon icon={icon} className="w-3.5 opacity-60" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 10, color: '#aaa', letterSpacing: '0.1em', marginTop: '1.5rem' }}>
        © 2026 Derek Montgomery
      </p>
    </footer>
  );
}
