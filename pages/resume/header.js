import React from "react";
import Image from "next/image";
import derek from "../../public/derek-2019.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faMobile,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const iconStyle = {
  fontSize: 30,
  color: "#fb923c",
  width: "20px",
};

const contactItems = [
  {
    text: "hello@derekthe.dev",
    link: "mailto:hello@derekthe.dev",
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
  <header className="grid pb-6 mb-4 border-b-4 border-orange-400 gap-y-4 gap-x-12 grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
    <section className="flex flex-col gap-2 text-center md:text-left">
      <div className="relative">
        <div className="md:border-l-[30px] border-orange-400 h-full absolute -ml-12" />
        <h1 className="text-4xl font-semibold mb-2">Derek Montgomery</h1>
        <h2 className="text-2xl font-normal">Rails | React | Front-End</h2>
      </div>
      <p className="font-light">
        Partnering with high-standards individuals to build beautiful,
        performant, and exciting software with humans in mind.
      </p>
    </section>
    <div className="flex justify-center items-center">
      <div className="border-gray-600 border-4 rounded-full flex items-center">
        <Image
          src={derek}
          alt="Derek Montgomery"
          width={150}
          height={150}
          className="rounded-full"
        />
      </div>
    </div>
    <nav className="md:text-right font-light justify-self-center md:justify-self-end">
      <ul className="h-full flex flex-col justify-between align-start gap-2">
        {contactItems.map(({ text, link, icon }) => (
          <li key={text} className="flex gap-4 md:justify-end items-center">
            <FontAwesomeIcon
              icon={icon}
              style={iconStyle}
              className="md:order-2"
            />
            <span>
              {link ? (
                <a href={link} className="underline hover:no-underline">
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
