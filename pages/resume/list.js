import React from "react";

const List = ({ title = "Default", entries = [] }) => {
  const firstHalf = entries.slice(0, Math.floor(entries.length / 2));
  const secondHalf = entries.slice(Math.floor(entries.length / 2));

  return (
    <div>
      <h2 className="text-3xl font-normal mb-2">{title}</h2>
      <ul className="mb-4 grid grid-cols-2 gap-4 font-light">
        {[firstHalf, secondHalf].map((entries, halfIndex) => {
          return (
            <div key={halfIndex}>
              {entries.map((entry, i) => (
                <li key={i} className="mb-2 leading-5">
                  {entry}
                </li>
              ))}
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default List;
