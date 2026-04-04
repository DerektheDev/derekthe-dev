import { useState } from "react";
import ReactCardFlip from "react-card-flip";

import { data as greekData } from "../../data/greek-data";
import styles from "./index.module.css";

export default function GreekCards() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <main className={styles.main}>
      {greekData.map((letter) => (
        <ReactCardFlip isFlipped={isFlipped} key={letter.name}>
          <div className={styles.card} onClick={() => setIsFlipped(true)}>
            <p className={styles.letter}>{letter.lower}</p>
          </div>
          <div className={styles.card} onClick={() => setIsFlipped(false)}>
            <p className={styles.name}>{letter.name}</p>
          </div>
        </ReactCardFlip>
      ))}
    </main>
  );
}
