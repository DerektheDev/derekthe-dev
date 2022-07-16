import React from "react";

const List = ({ title = "Default", entries = [] }) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-normal">{title}</h2>
      <ul className="font-light">{entries.join(" | ")}</ul>
    </div>
  );
};

export default List;
