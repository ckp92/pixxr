import "../../styles/accessories/LikesCounter.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleLike, toggleShowLikes } from "../../actions";
import ZoomButton from "./ZoomButton";
import UnderlineButton from "./UnderlineButton";

class LikesCounter extends Component {
  componentWillUnmount = () => {
    const { showLikes, toggleShowLikes } = this.props;
    // turn off on unmount
    if (showLikes) toggleShowLikes(false);
  };

  onHeartClick = e => {
    e.stopPropagation();
    const { haveILiked, toggleLike, type, photoId } = this.props;

    // if already liked, clicking will pass 'false' to unlike
    if (haveILiked) {
      toggleLike(photoId, false, type);
    } else {
      toggleLike(photoId, true, type);
    }
  };

  renderIcon = () => {
    const { haveILiked } = this.props;

    return haveILiked ? "fas fa-heart red" : "far fa-heart";
  };

  renderLikes = () => {
    const { type } = this.props;

    if (type === "multi") return this.props.numLikes;

    if (type === "single") {
      const { likes } = this.props;

      if (!likes) return;

      // no likes
      if (!likes.length) return "0";

      let str = `by ${likes[0].username}`;

      // 1 like
      if (likes.length === 1) return <UnderlineButton content={str} />;

      // 2 likes
      if (likes.length > 1) str += ` and ${likes.length - 1} other`;

      // 3+ likes
      if (likes.length > 2) str += "s";

      return <UnderlineButton onClick={this.onLikesClick} content={str} />;
    }
  };

  onLikesClick = () => {
    const { showLikes, toggleShowLikes } = this.props;

    if (!showLikes) toggleShowLikes(true);
  };

  render() {
    return (
      <div className="likes-counter">
        <ZoomButton
          onClick={e => this.onHeartClick(e)}
          content={<i className={this.renderIcon()} />}
        />
        {this.renderLikes()}
      </div>
    );
  }
}

const mapStateToProps = ({ photos, showLikes }) => {
  return { photos, showLikes };
};

export default connect(mapStateToProps, { toggleLike, toggleShowLikes })(
  LikesCounter
);

// add onlcick to icon btn
