import "../../styles/accessories/LikesCounter.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import ZoomButton from "./ZoomButton";
import UnderlineButton from "./UnderlineButton";

class LikesCounter extends Component {
  renderIcon = () => {
    const { haveILiked } = this.props;

    return haveILiked ? "fas fa-heart red" : "far fa-heart";
  };

  renderLikes = () => {
    const { type } = this.props;

    if (type === "multi") return this.props.numLikes;

    if (type === "single") {
      const { likes } = this.props;

      // no likes
      if (!likes.length) return "0";

      let str = `by ${likes[0]}`;

      // 1 like
      if (likes.length === 1) return str;

      // 2 likes
      if (likes.length > 1) str += ` and ${likes.length - 1} other`;

      // 3+ likes
      if (likes.length > 2) str += "s";

      return <UnderlineButton content={str} />;
    }
  };

  render() {
    return (
      <div className="likes-counter">
        <ZoomButton content={<i className={this.renderIcon()} />} />
        {this.renderLikes()}
      </div>
    );
  }
}

const mapStateToProps = ({ photos }) => {
  return { photos };
};

export default connect(mapStateToProps, {})(LikesCounter);

// add onlcick to icon btn
