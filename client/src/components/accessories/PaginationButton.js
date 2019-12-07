import "../../styles/accessories/PaginationButton.css";
import React from "react";

const PaginationButton = ({ content, onClick, id }) => {
  return (
    <button id={id} onClick={onClick} className="pagination-button">
      {content}
    </button>
  );
};

export default PaginationButton;
