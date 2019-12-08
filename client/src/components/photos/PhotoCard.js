import "../../styles/photos/PhotoCard.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import LikesCounter from "../accessories/LikesCounter";
import ConfigButtons from "../accessories/ConfigButtons";
import UnderlineButton from "../accessories/UnderlineButton";

class PhotoCard extends Component {
  onClick = () => {
    const { history, id } = this.props;

    history.push(`/photos/${id}`);
  };

  onUsernameClick = e => {
    e.stopPropagation();
  };

  renderConfig = () => {
    const {
      auth: { id },
      user_id
    } = this.props;

    if (id === user_id) {
      return <ConfigButtons />;
    }
  };

  render() {
    const {
      image_url,
      numComments,
      haveILiked,
      numLikes,
      numTags,
      title,
      username,
      type,
      id,
      created_at
    } = this.props;
    return (
      <div className="photo-card" onClick={this.onClick}>
        <div className="card-top">
          <img src={image_url} alt={title} />
        </div>
        <div className="card-bottom">
          <div className="title">
            <h4>
              {title} -{" "}
              <UnderlineButton
                content={username}
                onClick={e => this.onUsernameClick(e)}
              />
            </h4>
            <p>{formatDate(created_at)}</p>
          </div>
          <div className="stats">
            <div className="left-stats">
              {" "}
              <LikesCounter
                photoId={id}
                numLikes={numLikes}
                haveILiked={haveILiked}
                type={type}
              />{" "}
              <i className="far fa-comment" /> {numComments}{" "}
              <i className="fas fa-hashtag" /> {numTags}
            </div>
            {this.renderConfig()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, {})(withRouter(PhotoCard));
