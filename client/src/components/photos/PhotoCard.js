import "../../styles/photos/PhotoCard.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Title from "../accessories/Title";
import LikesCounter from "../accessories/LikesCounter";
import ConfigButtons from "../accessories/ConfigButtons";

class PhotoCard extends Component {
  // go to that photo
  onClick = () => {
    const { history, id } = this.props;

    history.push(`/photos/${id}`);
  };

  // only show if user owns photo
  renderConfig = () => {
    const { auth, user_id, id } = this.props;

    if (auth.id === user_id) {
      return <ConfigButtons photoId={id} />;
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
      user_id,
      created_at
    } = this.props;
    return (
      <div className="photo-card" onClick={this.onClick}>
        <div className="card-top">
          <img src={image_url} alt={title} />
        </div>
        <div className="card-bottom">
          <Title
            id="card-title"
            title={title}
            username={username}
            userId={user_id}
            created_at={created_at}
          />
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
