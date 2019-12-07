import "../../styles/accessories/UnderlineButton.css";
import React from "react";

const UnderlineButton = ({ content, onClick, id }) => {
  return (
    <button id={id} onClick={onClick} className="underline-button">
      {content}
    </button>
  );
};

export default UnderlineButton;
