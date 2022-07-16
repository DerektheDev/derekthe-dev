import List from "./list";
import KeyPoint from "./key-point";
import { jobs, schools, skills, built, brands, interests } from "./data";
import Header from "./header";

export default function Resume() {
  return (
    <main className="max-w-screen-lg m-auto">
      <Header />
      <section className="grid grid-cols-2 gap-10">
        <div className="shrink-0">
          <KeyPoint
            title="Recent Work Experience"
            entries={jobs}
            highlightEntries
          />
        </div>
        <div className="shrink-0">
          <KeyPoint title="Education" entries={schools} />
          <List title="Skills & Competencies" entries={skills} />
          <List title="What I've Built" entries={built} />
          <List title="Brands Served" entries={brands} />
          <List title="Interests" entries={interests} />
        </div>
      </section>
    </main>
  );
}
