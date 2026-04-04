import styles from "./short-list.module.css";

const List = ({ title = "Default", entries = [] }) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.list}>{entries.join(" | ")}</ul>
    </div>
  );
};

export default List;
