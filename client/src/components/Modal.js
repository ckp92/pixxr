import "../styles/Modal.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";

class Modal extends Component {
  render() {
    const { header, content, actions, onDismiss, id } = this.props;
    return ReactDOM.createPortal(
      <div className="modal" id={id} onClick={onDismiss}>
        <div className="modal-inner" onClick={e => e.stopPropagation()}>
          <div className="modal-header">{header}</div>
          <div className="modal-content">{content}</div>
          <div className="modal-actions">{actions}</div>
        </div>
      </div>,
      document.querySelector("#modal")
    );
  }
}

export default Modal;
