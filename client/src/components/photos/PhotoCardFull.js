import "../../styles/photos/PhotoCardFull.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LikesCounter from "../accessories/LikesCounter";
import ConfigButtons from "../accessories/ConfigButtons";
import UnderlineButton from "../accessories/UnderlineButton";
import Comments from "../accessories/Comments";
import CommentsForm from "../accessories/CommentsForm";

class PhotoCardFull extends Component {
  renderConfig = () => {
    const {
      auth: { id },
      user_id
    } = this.props;

    if (id === user_id) {
      return <ConfigButtons />;
    }
  };

  onUsernameClick = e => {};

  renderTags = () => {
    const { tags } = this.props;

    if (!tags) return;

    return tags.map(tag => <UnderlineButton key={tag} content={`#${tag}`} />);
  };

  // render separate comments component with this + new comment form. Put form on top and each comment will be shown in order of newest first
  renderComments = () => {
    const { comments, id } = this.props;
    return (
      <div className="comments-container">
        <CommentsForm photoId={id} />
        <Comments comments={comments} />
      </div>
    );
  };

  render() {
    const {
      image_url,
      username,
      haveILiked,
      title,
      likes,
      id,
      type
    } = this.props;
    return (
      <div className="photo-card-full">
        <div className="card-full-top">
          <img src={image_url} alt={title} />
        </div>
        <div className="card-full-bottom">
          <div className="stats-full">
            <LikesCounter
              likes={likes}
              haveILiked={haveILiked}
              photoId={id}
              type={type}
            />
            <div className="config-buttons">{this.renderConfig()}</div>
          </div>
          <div className="title">
            <h4>
              {title} -{" "}
              <UnderlineButton
                content={username}
                onClick={e => this.onUsernameClick(e)}
                id="title-underline-button"
              />
            </h4>
          </div>
          <div className="tags">{this.renderTags()}</div>
          {this.renderComments()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, {})(PhotoCardFull);
