import "../../styles/accessories/ShowLikesModal.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleShowLikes } from "../../actions";
import Modal from "../Modal";
import UnderlineButton from "./UnderlineButton";
import GenericButton from "../GenericButton";

// header, content, actions, onDismiss, id
class ShowLikesModal extends Component {
  renderContent = () => {
    const { likes } = this.props.photos.data[0];
    return (
      <div className="likes-list">
        {likes.map((like, i) => (
          <UnderlineButton key={i} content={like} />
        ))}
      </div>
    );
  };

  renderActions = () => {
    const { toggleShowLikes } = this.props;
    return (
      <GenericButton
        id="close-show-likes"
        color="generic"
        text="Close"
        onButtonClick={() => toggleShowLikes(false)}
      />
    );
  };

  render() {
    return (
      <Modal
        id="show-likes-modal"
        header={<h3>People who have liked this photo:</h3>}
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => this.props.toggleShowLikes(false)}
      />
    );
  }
}

const mapStateToProps = ({ photos }) => {
  return { photos };
};

export default connect(mapStateToProps, { toggleShowLikes })(ShowLikesModal);
