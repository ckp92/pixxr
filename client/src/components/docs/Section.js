import "../../styles/docs/Section.css";
import React from "react";

const Section = ({ list, heading }) => {
  const renderList = () => {
    return list.map((item, i) => <li key={i}>{item}</li>);
  };

  return (
    <div className="section">
      <h2 className="section-heading">{heading}</h2>
      <ul>{renderList()}</ul>
    </div>
  );
};

export default Section;
