import { MENU_DROPDOWN_CLICK } from "../actions/types";

export default (state = false, action) => {
  switch (action.type) {
    case MENU_DROPDOWN_CLICK:
      return action.payload;
    default:
      return state;
  }
};
