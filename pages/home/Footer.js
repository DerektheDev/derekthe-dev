import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { contactLinks } from "../../data/home-data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className="relative z-10 max-w-4xl mx-auto px-6 pb-10" aria-label="Contact">
      <div className={styles.divider} />
      <div className={styles.linksContainer}>
        {contactLinks.map(({ href, label, icon, ariaLabel }) => (
          <a key={label} href={href} aria-label={ariaLabel}
            className="contact-link flex items-center gap-2 text-[12px] text-gray-300 hover:text-orange-400 transition-colors tracking-[0.06em]">
            <FontAwesomeIcon icon={icon} className="w-3.5 opacity-60" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
      <p className={styles.copyright}>
        © 2026 Derek Montgomery
      </p>
    </footer>
  );
}
