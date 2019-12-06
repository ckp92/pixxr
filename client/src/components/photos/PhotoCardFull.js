import "../../styles/photos/PhotoCardFull.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import LikesCounter from "../accessories/LikesCounter";
import ConfigButtons from "../accessories/ConfigButtons";
import UnderLineButton from "../accessories/UnderlineButton";

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

  renderTags = () => {
    const { tags } = this.props;

    return tags.map(tag => <UnderLineButton key={tag} content={`#${tag}`} />);
  };

  // render separate comments component with this + new comment form. Put form on top and each comment will be shown in order of newest first
  renderComments = () => {
    const { comments } = this.props;

    if (!comments.length) return <p>No Comments Yet</p>;
  };

  render() {
    const { image_url, haveILiked, title, likes, id, type } = this.props;
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
          <div className="tags">{this.renderTags()}</div>
          <div className="comments">{this.renderComments()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(mapStateToProps, {})(PhotoCardFull);
