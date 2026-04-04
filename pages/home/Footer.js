import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { contactLinks } from "../../data/home-data";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Contact">
      <div className={styles.divider} />
      <div className={styles.linksContainer}>
        {contactLinks.map(({ href, label, icon, ariaLabel }) => (
          <a key={label} href={href} aria-label={ariaLabel}
            className={`contact-link ${styles.contactLink}`}>
            <FontAwesomeIcon icon={icon} className={styles.contactIcon} aria-hidden="true" />
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
