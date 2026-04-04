import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import derek from "../../public/derek-linkedin.jpg";
import { techStack } from "../../data/home-data";
import AuroraBackground from "./AuroraBackground";
import NeuralBackground from "./NeuralBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.heroOuter}>
      <AuroraBackground />
      <NeuralBackground />
      <div className="mesh-bg">
        <div className={`blob ${styles.blob1}`} />
        <div className={`blob ${styles.blob2}`} />
        <div className={`blob ${styles.blob3}`} />
        <div className={`blob ${styles.blob4}`} />
      </div>
      <section className={styles.section}>

        <div className={`rise d2 ${styles.photoWrapper}`}>
          <div className={`photo-ring ${styles.photoRingContainer}`}>
            <Image src={derek} alt="Derek Montgomery" width={148} height={148} className={styles.photo} priority />
          </div>
        </div>

        <div>
          <p className={`rise d3 ${styles.greeting}`}>
            Hey, I'm
          </p>

          <h1 className={`rise d4 hero-name ${styles.heroName}`}>
            Derek Montgomery
          </h1>

          <p className={`rise d5 ${styles.role}`}>
            Senior Software Engineer at{" "}
            <a href="https://www.oreilly.com/" target="_blank" rel="noreferrer" className={styles.oreillyLink}>O'Reilly Media</a>
          </p>

          <div className={`rise d5 tech-row ${styles.techRow}`}>
            {techStack.map(({ label, iconUrl, faIcon }) => (
              <span key={label} className="tech-item">
                {iconUrl
                  ? <img src={iconUrl} alt={label} />
                  : <FontAwesomeIcon icon={faIcon} className="fa-brain" />
                }
                {label}
              </span>
            ))}
          </div>

          <p className={`rise d6 ${styles.bio}`}>
            With over <span className={styles.highlight}>15 years</span> building digital products, I've got experience{" "}
            <span className={styles.highlight}>leading</span> engineering teams,{" "}
            <span className={styles.highlight}>building</span> startups, and{" "}
            <span className={styles.highlight}>consulting</span> for large corporations.
          </p>

          <div className={`rise d6 ${styles.buttonRow}`}>
            <a href="/resume" className={`btn-fill ${styles.resumeBtn}`}>
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
