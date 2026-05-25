import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn, faGithub, faThreads } from "@fortawesome/free-brands-svg-icons";
import styles from "./Nav.module.css";

export default function Nav() {
  return (
    <nav className={`rise d1 ${styles.nav}`} aria-label="Main navigation">
      <a href="/resume" className={styles.link}>
        Resume
      </a>
      <a href="https://www.linkedin.com/in/derekthedev/" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="LinkedIn profile (opens in new tab)">
        <FontAwesomeIcon icon={faLinkedinIn} className={styles.icon} />
      </a>
      <a href="https://github.com/derekthedev" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="GitHub profile (opens in new tab)">
        <FontAwesomeIcon icon={faGithub} className={styles.icon} />
      </a>
      <a href="https://www.threads.com/@derekthedev" target="_blank" rel="noreferrer"
        className={styles.linkWithIcon}
        aria-label="Threads profile (opens in new tab)">
        <FontAwesomeIcon icon={faThreads} className={styles.icon} />
      </a>
    </nav>
  );
}
