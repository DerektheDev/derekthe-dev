import styles from "./key-point.module.css";

const KeyPoint = ({
  highlightEntries,
  title = "Default Title",
  subtitle,
  entries = [],
}) => (
  <div className={styles.wrapper}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {subtitle && <h3 className={styles.sectionSubtitle}>{subtitle}</h3>}

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
        const showHighlight = highlightEntries && !suppressHighlight;

        return (
          <div key={index} className={styles.entry}>
            <div className={styles.entryInner}>
              {showHighlight && <div className={styles.highlightBar} />}
              <div className={styles.dateRow}>
                {dateRange && (
                  <h3 className={styles.dateLabel}>{dateRange.join(" - ")}</h3>
                )}
              </div>
              <h3 className={styles.entryTitle}>
                {titleLink ? (
                  <a
                    href={titleLink}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.entryLink}
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              <h4 className={styles.entrySubtitle}>{subtitle}</h4>
            </div>
            <ul className={styles.bullets}>
              {bullets.map((bullet, index) => (
                <li key={index} className={styles.bullet}>
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
