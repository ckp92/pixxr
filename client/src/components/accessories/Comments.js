import "../../styles/accessories/Comments.css";
import React, { Component } from "react";
import formatNewLine from "../../utils/formatNewLine";
import formatDate from "../../utils/formatDate";
import UnderlineButton from "./UnderlineButton";

class Comments extends Component {
  renderContent = () => {
    const { comments } = this.props;

    if (!comments) return <div className="comment no-comments">Loading...</div>;

    if (!comments.length)
      return <div className="comment no-comments">No Comments Yet</div>;

    return comments.map((comment, i) => {
      const { comment_text, user_id, username, created_at } = comment;

      return (
        <div key={i} className="comment">
          <div className="comment-info">
            <UnderlineButton
              id="comment-username"
              onClick={this.onUsernameClick(user_id)}
              content={username}
            />
            <div className="comment-date">{formatDate(created_at)}</div>
          </div>
          <div className="comment-text">{formatNewLine(comment_text)}</div>
        </div>
      );
    });
  };

  onUsernameClick = user_id => {};

  render() {
    return <div className="comments">{this.renderContent()}</div>;
  }
}

export default Comments;
