import "../../styles/header/MenuButton.css";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getPhotos, setPage, setSearchType } from "../../actions";

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

    if (type === "button") {
      return (
        <button
          onClick={() => this.onMyPhotosClick(path)}
          className="menu-link menu-link-button"
        >
          {content}
          <i className={icon} />
        </button>
      );
    }
  };

  onMyPhotosClick = path => {
    const {
      getPhotos,
      setPage,
      setSearchType,
      history,
      auth: { id, username }
    } = this.props;

    if (path === "photos") {
      setSearchType({ searchType: null, value: null, str: null });
      getPhotos(0, null, null);
      setPage(0);
      history.push("/photos");
    }

    if (path === "user") {
      setSearchType({ searchType: "user", value: id, str: username });
      getPhotos(0, "user", id);
      setPage(0);
      history.push(`/user/${id}/photos`);
    }
  };

  render() {
    return this.renderContent();
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, { getPhotos, setPage, setSearchType })(
  withRouter(MenuButton)
);
