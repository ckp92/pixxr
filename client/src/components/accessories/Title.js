import "../../styles/accessories/Title.css";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setSearchType } from "../../actions";
import formatDate from "../../utils/formatDate";
import UnderlineButton from "../accessories/UnderlineButton";

class Title extends Component {
  onUsernameClick = (e, userId, username) => {
    const { setSearchType, history } = this.props;
    e.stopPropagation();

    setSearchType({ searchType: "user", value: userId, str: username });
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

export default connect(null, { setSearchType })(withRouter(Title));
