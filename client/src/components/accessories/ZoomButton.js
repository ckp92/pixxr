import "../../styles/accessories/ZoomButton.css";
import React from "react";

const ZoomButton = ({ content, onClick, id }) => {
  return (
    <button id={id} onClick={onClick} className="zoom-button">
      {content}
    </button>
  );
};

export default ZoomButton;
