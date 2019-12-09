import React from "react";

const ListHeader = ({ searchType: { str, searchType } }) => {
  let mainHExtra = null;
  let subHExtra = null;

  if (str && searchType === "user") {
    mainHExtra = `${str}'s `;
    subHExtra = ` by ${str}`;
  }

  if (str && searchType === "tag") {
    mainHExtra = `#${str} `;
    subHExtra = ` tagged: #${str}`;
  }

  return (
    <React.Fragment>
      <h1>{mainHExtra}Photos!</h1>
      <p>Here is a list of all the photos{subHExtra}!</p>
    </React.Fragment>
  );
};

export default ListHeader;
