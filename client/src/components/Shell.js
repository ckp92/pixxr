import "../styles/Shell.css";
import React, { Component } from "react";

class Shell extends Component {
  renderClassName = () => {
    const { type } = this.props;

    console.log(type);
    if (type === "normal") return "shell-content-full";
    if (type === "form") return "shell-content-form";
  };

  render() {
    return (
      <div className="shell">
        <div className="shell-header">{this.props.header}</div>
        <div className={this.renderClassName()}>{this.props.content}</div>
        <div className="shell-footer">{this.props.footer}</div>
      </div>
    );
  }
}

export default Shell;
