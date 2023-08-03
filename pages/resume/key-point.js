const KeyPoint = ({
  highlightEntries,
  title = "Default Title",
  subtitle,
  entries = [],
}) => (
  <div className="flex flex-col justify-between gap-6 only:h-full">
    <h2 className="text-3xl font-normal">{title}</h2>
    {subtitle && <h3 className="text-2xl font-semibold">{subtitle}</h3>}

    {entries.map(
      (
        {
          title,
          subtitle,
          titleLink,
          bullets,
          dateRange,
          location,
          suppressHighlight,
        },
        index
      ) => {
        let highlightClass;
        if (highlightEntries && !suppressHighlight) {
          highlightClass =
            "md:border-l-[30px] border-orange-400 h-full absolute -ml-12";
        }

        return (
          <div key={index} className="flex flex-col gap-2">
            <div className="relative">
              <div className={highlightClass} />
              <div className="flex justify-between text-base font-light">
                {dateRange && (
                  <h3 className="text-orange-400">{dateRange.join(" - ")}</h3>
                )}
                {/* <h3 className="text-gray-400">{location}</h3> */}
              </div>
              <h3 className="text-2xl font-normal">
                {titleLink ? (
                  <a
                    href={titleLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline"
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              <h4 className="text-2xl font-light">{subtitle}</h4>
            </div>
            <ul className="flex flex-col gap-2">
              {bullets.map((bullet, index) => (
                <li key={index} className="font-light">
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
