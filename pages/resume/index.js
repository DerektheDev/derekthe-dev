import List from "./list";
import ShortList from "./short-list";
import KeyPoint from "./key-point";
import {
  jobs,
  schools,
  skills,
  built,
  brands,
  interests,
} from "../../data/resume-data";
import Header from "./header";

export default function Resume() {
  return (
    <main className="max-w-screen-lg mx-auto my-12 px-6 md:px-12">
      <Header />
      <section className="grid gap-x-10 gap-y-4 grid-cols-1 md:grid-cols-2">
        <div className="shrink-0 flex flex-col gap-6 justify-between">
          <KeyPoint
            title="Recent Work Experience"
            entries={jobs}
            highlightEntries
          />
        </div>
        <div className="shrink-0 flex flex-col gap-6 justify-between">
          <KeyPoint title="Education" entries={schools} />
          <List title="Skills & Competencies" entries={skills} />
          <List title="What I've Built" entries={built} />
          <List title="Brands Served" entries={brands} />
          <ShortList title="Interests" entries={interests} />
        </div>
      </section>
    </main>
  );
}
