import "../../styles/header/EmailModal.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { closeEmailModal } from "../../actions";
import Modal from "../Modal";
import GenericButton from "../GenericButton";

class EmailModal extends Component {
  // Modal header
  renderHeader = () => {
    const { emailStatus } = this.props;

    if (emailStatus && emailStatus.success) return <h3>Success!</h3>;
    if (emailStatus && emailStatus.error) return <h3>Oops!</h3>;
  };

  // Modal content
  renderContent = () => {
    const { emailStatus } = this.props;

    return <p>{emailStatus.message}</p>;
  };

  // Modal actions
  renderActions = () => {
    const { closeEmailModal } = this.props;
    return (
      <GenericButton
        id="email-modal-btn"
        text="Ok"
        color="generic"
        onButtonClick={closeEmailModal}
      />
    );
  };

  render() {
    const { closeEmailModal } = this.props;
    return (
      <Modal
        id="email-modal"
        onDismiss={closeEmailModal}
        header={this.renderHeader()}
        content={this.renderContent()}
        actions={this.renderActions()}
      />
    );
  }
}

const mapStateToProps = ({ emailStatus }) => {
  return { emailStatus };
};

export default connect(mapStateToProps, { closeEmailModal })(EmailModal);
