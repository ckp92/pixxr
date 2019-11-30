import "../../styles/header/Dropdown.css";
import React, { Component } from "react";

class Dropdown extends Component {
  render() {
    const { id, content, onDismiss } = this.props;
    return (
      <div className="dropdown" id={id} onClick={onDismiss}>
        <div className="dropdown-inner">
          <div className="dropdown-content">{content}</div>
        </div>
      </div>
    );
  }
}

export default Dropdown;
