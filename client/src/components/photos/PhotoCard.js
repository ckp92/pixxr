import "../../styles/photos/PhotoCard.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LikesCounter from "../accessories/LikesCounter";
import ConfigButtons from "../accessories/ConfigButtons";

class PhotoCard extends Component {
  onClick = () => {
    const { history, id } = this.props;

    history.push(`/photos/${id}`);
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
      id
    } = this.props;
    return (
      <div className="photo-card" onClick={this.onClick}>
        <div className="card-top">
          <img src={image_url} alt={title} />
        </div>
        <div className="card-bottom">
          <h4>
            {title} by {username}
          </h4>
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
