import "../../styles/accessories/ConfigButtons.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ZoomButton from "./ZoomButton";

class ConfigButtons extends Component {
  onEditClick = e => {
    const { photoId, history } = this.props;

    e.stopPropagation();

    history.push(`/photos/edit/${photoId}`);
  };

  render() {
    return (
      <div className="config-buttons">
        {" "}
        <ZoomButton
          onClick={e => this.onEditClick(e)}
          content={<i className="fas fa-pencil-alt" />}
        />
        <ZoomButton content={<i className="far fa-trash-alt" />} />
      </div>
    );
  }
}

// remove this if not necessary
const mapStateToProps = ({ photos }) => {
  return { photos };
};

export default connect(mapStateToProps, {})(withRouter(ConfigButtons));
