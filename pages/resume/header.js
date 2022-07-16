import React from "react";
import Image from "next/image";
import derek from "../../public/derek-2019.jpg";

const Header = () => (
  <header className="grid pb-6 mt-12 mb-4 border-b-4 border-orange-400 gap-12 grid-cols-[1fr_auto_1fr]">
    <section className="flex flex-col gap-2">
      <div className="relative">
        <div className="border-l-[30px] border-orange-400 h-full absolute -ml-12" />
        <h1 className="text-4xl font-semibold mb-2">Derek Montgomery</h1>
        <h2 className="text-2xl font-normal">Rails | React | Front-End</h2>
      </div>
      <p className="font-light">
        Partnering with high-standards individuals to build beautiful,
        performant, and exciting software with humans in mind.
      </p>
    </section>
    <div className="flex justify-center">
      <div className="border-black border-4 rounded-full flex">
        <Image
          src={derek}
          alt="Derek Montgomery"
          width={150}
          height={150}
          className="rounded-full"
        />
      </div>
    </div>
    <nav className="text-right font-light">
      <ul className="h-full flex flex-col justify-between">
        <li>
          <a href="mailto:montgomerygraphics@gmail.com">
            montgomerygraphics@gmail.com
          </a>
        </li>
        <li>
          <a href="tel:3098400133">309.840.0133</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/derekthedev/">
            /in/derekthedev/
          </a>
        </li>
        <li>Dekalb, Illinois</li>
      </ul>
    </nav>
  </header>
);

export default Header;
