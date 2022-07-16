const List = ({ title = "Default", entries = [] }) => {
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));

  return (
    <div>
      <h2 className="text-3xl font-normal mb-2">{title}</h2>
      <div className="grid grid-cols-1 gap-x-4 font-light md:grid-cols-2">
        {[firstHalf, secondHalf].map((entries, halfIndex) => {
          return (
            <ul key={halfIndex} className="flex flex-col gap-y-2">
              {entries.map((entry, i) => (
                <li key={i} className="leading-5">
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
