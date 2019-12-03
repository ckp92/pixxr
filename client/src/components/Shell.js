import "../styles/Shell.css";
import React, { Component } from "react";

class Shell extends Component {
  render() {
    return (
      <div className="shell">
        <div className="shell-header">{this.props.header}</div>
        <div className="shell-content">{this.props.content}</div>
        <div className="shell-footer">{this.props.footer}</div>
      </div>
    );
  }
}

export default Shell;
