import styles from "./list.module.css";

const List = ({ title = "Default", entries = [] }) => {
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));

  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {[firstHalf, secondHalf].map((entries, halfIndex) => {
          return (
            <ul key={halfIndex} className={styles.column}>
              {entries.map((entry, i) => (
                <li key={i} className={styles.item}>
                  {entry}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default List;
