import "../../styles/accessories/Title.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import formatDate from "../../utils/formatDate";
import UnderlineButton from "../accessories/UnderlineButton";

class Title extends Component {
  onUsernameClick = (e, userId) => {
    e.stopPropagation();
  };

  render() {
    const { title, username, userId, created_at, id } = this.props;
    return (
      <div id={id} className="title">
        <h4>
          {title} -{" "}
          <UnderlineButton
            content={username}
            onClick={e => this.onUsernameClick(e, userId)}
          />
        </h4>
        <p>{formatDate(created_at)}</p>
      </div>
    );
  }
}

export default connect(null, {})(Title);
