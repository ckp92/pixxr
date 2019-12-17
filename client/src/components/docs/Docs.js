import "../../styles/docs/Docs.css";
import React, { Component } from "react";
import content from "./content";
import Shell from "../Shell";
import Section from "./Section";

class Docs extends Component {
  renderContent = () => {
    return content.map(({ heading, list }) => (
      <Section key={heading} heading={heading} list={list} />
    ));
  };

  render() {
    return (
      <div className="docs">
        <Shell
          header={<h1>Docs!</h1>}
          content={this.renderContent()}
          type="normal"
        />
      </div>
    );
  }
}

export default Docs;
