import { CHECK_ALPHANUMERIC } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case CHECK_ALPHANUMERIC:
      return action.payload;
    default:
      return state;
  }
};
