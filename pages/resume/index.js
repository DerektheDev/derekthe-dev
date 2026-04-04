import List from "./list";
import ShortList from "./short-list";
import KeyPoint from "./key-point";
import {
  jobs,
  schools,
  skills,
  built,
  brands,
  // interests,
  proficiencies,
  industries,
} from "../../data/resume-data";
import Header from "./header";
import styles from "./index.module.css";

export default function Resume() {
  return (
    <main className={styles.main}>
      <Header />
      <section className={styles.grid}>
        <div className={styles.col}>
          <KeyPoint
            title="Recent Work Experience"
            entries={jobs}
            highlightEntries
          />
        </div>
        <div className={styles.col}>
          <KeyPoint title="Education" entries={schools} />
          <ShortList title="Tech" entries={proficiencies} />
          <List title="Skills & Competencies" entries={skills} />
          <List title="What I've Built" entries={built} />
          <List title="Brands Served" entries={brands} />
          <List title="Industries Served" entries={industries} />
          {/* <ShortList title="Interests" entries={interests} /> */}
        </div>
      </section>
    </main>
  );
}
