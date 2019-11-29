import "../styles/GenericButton.css";
import React, { Component } from "react";

class GenericButton extends Component {
  renderButton = () => {
    const { color, type, onButtonClick, text, id } = this.props;

    const className = `generic-button ${color}`;

    return (
      <button id={id} className={className} type={type} onClick={onButtonClick}>
        {text}
      </button>
    );
  };
  render() {
    return this.renderButton();
  }
}

export default GenericButton;
