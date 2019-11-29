import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import landingReducer from "./landingReducer";
import uniqueUsernameReducer from "./uniqueUsernameReducer";
import signupModeReducer from "./signupModeReducer";
import authReducer from "./authReducer";
import setUsernameReducer from "./setUsernameReducer";
import checkAlphanumericReducer from "./checkAlphanumericReducer";

export default combineReducers({
  landingOn: landingReducer,
  uniqueUsername: uniqueUsernameReducer,
  signupMode: signupModeReducer,
  auth: authReducer,
  wasUsernameSuccessfullySet: setUsernameReducer,
  isAlphanumeric: checkAlphanumericReducer,
  form: formReducer
});
