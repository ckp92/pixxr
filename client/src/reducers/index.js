import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import landingReducer from "./landingReducer";
import uniqueUsernameReducer from "./uniqueUsernameReducer";
import signupModeReducer from "./signupModeReducer";
import authReducer from "./authReducer";
import setUsernameReducer from "./setUsernameReducer";
import checkAlphanumericReducer from "./checkAlphanumericReducer";
import brandDropdownReducer from "./brandDropdownReducer";
import menuDropdownReducer from "./menuDropdownReducer";
import formReviewReducer from "./formReviewReducer";
import emailReducer from "./emailReducer";
import photosReducer from "./photosReducer";
import currentPageReducer from "./currentPageReducer";

export default combineReducers({
  landingOn: landingReducer,
  uniqueUsername: uniqueUsernameReducer,
  signupMode: signupModeReducer,
  auth: authReducer,
  wasUsernameSuccessfullySet: setUsernameReducer,
  isAlphanumeric: checkAlphanumericReducer,
  isBrandDropdownOn: brandDropdownReducer,
  isMenuDropdownOn: menuDropdownReducer,
  isFormReviewOn: formReviewReducer,
  emailStatus: emailReducer,
  photos: photosReducer,
  currentPage: currentPageReducer,
  form: formReducer
});
