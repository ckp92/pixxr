import { SET_SEARCH_TYPE } from "../actions/types";

export default (
  state = { searchType: null, value: null, str: null },
  action
) => {
  switch (action.type) {
    case SET_SEARCH_TYPE:
      return action.payload;
    default:
      return state;
  }
};
