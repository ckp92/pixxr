import "../../styles/accessories/ZoomButton.css";
import React from "react";

const ZoomButton = ({ content, onClick }) => {
  return (
    <button onClick={onClick} className="zoom-button">
      {content}
    </button>
  );
};

export default ZoomButton;
