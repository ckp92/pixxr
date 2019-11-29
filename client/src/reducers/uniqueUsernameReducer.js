import { UNIQUE_USERNAME } from "../actions/types";

export default (state = null, action) => {
  switch (action.type) {
    case UNIQUE_USERNAME:
      return action.payload;
    default:
      return state;
  }
};
