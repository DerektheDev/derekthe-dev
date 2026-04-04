import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={`rise d1 ${styles.nav}`} aria-label="Main navigation">
      <a href="/resume" className={styles.link}>
        Resume
      </a>
      <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="LinkedIn (opens in new tab)">
        <FontAwesomeIcon icon={faLinkedinIn} className={styles.icon} />
        LinkedIn
      </a>
      <a href="https://github.com/derekthedev" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="GitHub (opens in new tab)">
        <FontAwesomeIcon icon={faGithub} className={styles.icon} />
        GitHub
      </a>
    </nav>
  );
}
