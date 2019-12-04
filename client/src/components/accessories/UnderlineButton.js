import "../../styles/accessories/UnderlineButton.css";
import React from "react";

const UnderlineButton = ({ content, onClick }) => {
  return (
    <button onClick={onClick} className="underline-button">
      {content}
    </button>
  );
};

export default UnderlineButton;
