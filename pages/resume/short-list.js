import React from "react";

const List = ({ title = "Default", entries = [] }) => {
  return (
    <div>
      <h2 className="text-3xl font-normal mb-2">{title}</h2>
      <ul className="mb-4 font-light">{entries.join(" | ")}</ul>
    </div>
  );
};

export default List;
