import React from "react";

const KeyPoint = ({
  highlightEntries,
  title = "Default Title",
  subtitle,
  entries = [],
}) => (
  <div className="mb-6">
    <h2 className="text-3xl font-normal mb-4">{title}</h2>
    {subtitle && <h3 className="text-2xl font-semibold">{subtitle}</h3>}

    {entries.map(
      (
        { title, subtitle, bullets, dateRange, location, suppressHighlight },
        index
      ) => {
        let highlightClass;
        if (highlightEntries && !suppressHighlight) {
          highlightClass =
            "md:border-l-[30px] border-orange-400 h-full absolute -ml-12";
        }

        return (
          <div key={index} className="mb-8">
            <div className="relative">
              <div className={highlightClass} />
              <div className="flex justify-between text-base font-light">
                {dateRange && (
                  <h3 className="text-orange-400">{dateRange.join(" - ")}</h3>
                )}
                <h3 className="text-gray-400">{location}</h3>
              </div>
              <h3 className="text-2xl font-normal">{title}</h3>
              <h4 className="text-2xl font-light mb-2">{subtitle}</h4>
            </div>
            <ul>
              {bullets.map((bullet, index) => (
                <li key={index} className="mb-2 font-light">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        );
      }
    )}
  </div>
);

export default KeyPoint;
