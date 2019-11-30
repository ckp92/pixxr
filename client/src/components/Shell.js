import "../styles/Shell.css";
import React, { Component } from "react";

class Shell extends Component {
  render() {
    return <div className="shell">{this.props.children}</div>;
  }
}

export default Shell;
