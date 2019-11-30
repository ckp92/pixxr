import "../../styles/header/MenuButton.css";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class MenuButton extends Component {
  renderContent = () => {
    const { type, path, icon, content } = this.props.options;

    if (type === "link") {
      return (
        <Link className="menu-link" to={path}>
          {content}
          <i className={icon} />
        </Link>
      );
    }

    if (type === "a") {
      return (
        <a
          className="menu-link"
          href={path}
          target={content === "Logout" ? "" : "_blank"}
          rel={content === "Logout" ? "" : "noopener noreferrer"}
        >
          {content}
          <i className={icon} />
        </a>
      );
    }
  };
  render() {
    return this.renderContent();
  }
}

export default MenuButton;
