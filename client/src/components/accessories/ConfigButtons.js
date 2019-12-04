import "../../styles/accessories/ConfigButtons.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import ZoomButton from "./ZoomButton";

class ConfigButtons extends Component {
  renderIcon = () => {
    const { haveILiked } = this.props;

    return haveILiked ? "fas fa-heart red" : "far fa-heart";
  };

  render() {
    return (
      <div className="config-buttons">
        {" "}
        <ZoomButton content={<i className="fas fa-pencil-alt" />} />
        <ZoomButton content={<i className="far fa-trash-alt" />} />
      </div>
    );
  }
}

const mapStateToProps = ({ photos, auth }) => {
  return { photos };
};

export default connect(mapStateToProps, {})(ConfigButtons);

// add onlcick to icon btn
