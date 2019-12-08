import React from "react";

export default text => {
  return text.split("\n").map((line, i) => {
    return <p key={i}>{line}</p>;
  });
};
