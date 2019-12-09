import "../../styles/photos/PhotoCardFull.css";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toggleShowLikes, setSearchType } from "../../actions";
import LikesCounter from "../accessories/LikesCounter";
import Title from "../accessories/Title";
import ConfigButtons from "../accessories/ConfigButtons";
import UnderlineButton from "../accessories/UnderlineButton";
import Comments from "../accessories/Comments";
import CommentsForm from "../accessories/CommentsForm";
import ShowLikesModal from "../accessories/ShowLikesModal";

class PhotoCardFull extends Component {
  renderLikesModal = () => {
    const { showLikes } = this.props;

    // header, content, actions, onDismiss, id
    if (showLikes) return <ShowLikesModal />;
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

  renderTags = () => {
    const { tags } = this.props;

    if (!tags) return;

    return tags.map(tag => (
      <UnderlineButton
        onClick={e => this.onTagClick(e, tag)}
        key={tag}
        content={`#${tag}`}
      />
    ));
  };

  onTagClick = (e, tag) => {
    const { setSearchType, history } = this.props;
    e.stopPropagation();

    setSearchType({ searchType: "tag", value: tag, str: tag });
    history.push(`/tag/${tag}/photos`);
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
      user_id,
      created_at,
      type
    } = this.props;
    return (
      <div className="photo-card-full">
        {this.renderLikesModal()}
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
          <Title
            id="card-full-title"
            title={title}
            username={username}
            userId={user_id}
            created_at={created_at}
          />
          <div className="tags">{this.renderTags()}</div>
          {this.renderComments()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, showLikes }) => {
  return { auth, showLikes };
};

export default connect(mapStateToProps, { toggleShowLikes, setSearchType })(
  withRouter(PhotoCardFull)
);
