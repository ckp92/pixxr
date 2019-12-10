import "../../styles/accessories/Title.css";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setSearchType, getPhotos, setPage } from "../../actions";
import formatDate from "../../utils/formatDate";
import UnderlineButton from "../accessories/UnderlineButton";

class Title extends Component {
  onUsernameClick = (e, userId, username) => {
    const { setSearchType, history, getPhotos, setPage } = this.props;
    e.stopPropagation();

    // set state so it's correct for when we push to users route
    setSearchType({ searchType: "user", value: userId, str: username });
    setPage(0);
    getPhotos(0, "user", userId);
    history.push(`/user/${userId}/photos`);
  };

  render() {
    const { title, username, userId, created_at, id } = this.props;
    return (
      <div id={id} className="title">
        <h4>
          {title} -{" "}
          <UnderlineButton
            content={username}
            onClick={e => this.onUsernameClick(e, userId, username)}
          />
        </h4>
        <p>{formatDate(created_at)}</p>
      </div>
    );
  }
}

export default connect(null, { setSearchType, getPhotos, setPage })(
  withRouter(Title)
);
