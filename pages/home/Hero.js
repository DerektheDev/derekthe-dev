import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import derek from "../../public/derek-linkedin.jpg";
import { techStack } from "../../data/home-data";
import AuroraBackground from "./AuroraBackground";
import NeuralBackground from "./NeuralBackground";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={`relative ${styles.heroOuter}`}>
      <AuroraBackground />
      <NeuralBackground />
      <div className="mesh-bg">
        <div className={`blob ${styles.blob1}`} />
        <div className={`blob ${styles.blob2}`} />
        <div className={`blob ${styles.blob3}`} />
        <div className={`blob ${styles.blob4}`} />
      </div>
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">

        <div className={`rise d2 mx-auto mb-10 relative ${styles.photoWrapper}`}>
          <div className="w-full h-full rounded-full overflow-hidden photo-ring">
            <Image src={derek} alt="Derek Montgomery" width={148} height={148} className="object-cover w-full h-full" priority />
          </div>
        </div>

        <div>
          <p className="rise d3 text-[22px] text-orange-400 tracking-[0.12em] mb-3">
            Hey, I'm
          </p>

          <h1 className="rise d4 hero-name text-white mb-6">
            Derek Montgomery
          </h1>

          <p className="rise d5 text-[20px] text-gray-400 mb-5 leading-relaxed">
            Senior Software Engineer at{" "}
            <a href="https://www.oreilly.com/" target="_blank" rel="noreferrer" className="text-gray-200 font-medium hover:text-orange-400 transition-colors">O'Reilly Media</a>
          </p>

          <div className="rise d5 tech-row my-9">
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

          <p className="rise d6 text-[15px] text-gray-400 leading-relaxed max-w-xl mx-auto mb-10">
            With over <span className="text-gray-200 font-medium">15 years</span> building digital products, I've got experience{" "}
            <span className="text-gray-200 font-medium">leading</span> engineering teams,{" "}
            <span className="text-gray-200 font-medium">building</span> startups, and{" "}
            <span className="text-gray-200 font-medium">consulting</span> for large corporations.
          </p>

          <div className="rise d6 flex gap-4 justify-center">
            <a href="/resume" className="btn-fill text-[15px] px-8 py-3 rounded-lg tracking-wide">
              View Resume
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
