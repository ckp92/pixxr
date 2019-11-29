import { TOGGLE_LANDING } from "../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case TOGGLE_LANDING:
      return action.payload;
    default:
      return state;
  }
};
