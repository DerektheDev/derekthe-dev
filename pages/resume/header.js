import Image from "next/image";
import derek from "../../public/derek-linkedin.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faMobile,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import styles from "./header.module.css";

const iconStyle = {
  fontSize: 30,
  color: "#fb923c",
  width: "20px",
};

const contactItems = [
  {
    text: "derekthedev@icloud.com",
    link: "mailto:derekthedev@icloud.com",
    icon: faPaperPlane,
  },
  {
    text: "309.840.0133",
    link: "tel:13098400133",
    icon: faMobile,
  },
  {
    text: "/in/derekthedev",
    link: "https://www.linkedin.com/in/derekthedev/",
    icon: faLinkedinIn,
  },
  {
    text: "DeKalb, Illinois",
    icon: faMapPin,
  },
];

const Header = () => (
  <header className={styles.header}>
    <section className={styles.leftSection}>
      <div className={styles.nameWrapper}>
        <div className={styles.highlightBar} />
        <h1 className={styles.name}>Derek Montgomery</h1>
        <h2 className={styles.title}>Rails | React | Front-End | AI</h2>
      </div>
      <p className={styles.description}>
        Partnering with high-standards individuals to build beautiful,
        performant, accessible, and exciting software with humans in mind.
      </p>
    </section>
    <div className={styles.photoContainer}>
      <div className={styles.photoBorder}>
        <Image
          src={derek}
          alt="Derek Montgomery"
          width={150}
          height={150}
          className={styles.photo}
        />
      </div>
    </div>
    <nav className={styles.contactNav}>
      <ul className={styles.contactList}>
        {contactItems.map(({ text, link, icon }) => (
          <li key={text} className={styles.contactItem}>
            <FontAwesomeIcon
              icon={icon}
              style={iconStyle}
              className={styles.contactIcon}
            />
            <span>
              {link ? (
                <a href={link} className={styles.contactLink}>
                  {text}
                </a>
              ) : (
                text
              )}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Header;
