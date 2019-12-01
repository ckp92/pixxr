import "../styles/FormShell.css";
import React, { Component } from "react";

class FormShell extends Component {
  render() {
    return <div className="form-shell">{this.props.children}</div>;
  }
}

export default FormShell;
