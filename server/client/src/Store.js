import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import AllQuestion from "../src/Reducer/AllQuestion";
import SignUp from "../src/Reducer/SignUp";
import Login from "../src/Reducer/Login";
import Auth from "../src/Reducer/Auth";
import Question from "../src/Reducer/Question";
import AllTag from "./Reducer/AllTag";
import AddTag from "./Reducer/AddTag";
import AddQuestion from "./Reducer/AddQuestion";
import AllAnswer from "./Reducer/AllAnswer";
import AddAnswer from "./Reducer/AddAnswer";
let middleware = [thunk];
let currentstate = {};
let reducers = combineReducers({
  allQuestion: AllQuestion,
  signUp: SignUp,
  login: Login,
  auth: Auth,
  question: Question,
  allTag: AllTag,
  addTag: AddTag,
  addQuestion: AddQuestion,
  allAnswer: AllAnswer,
  addAnswer: AddAnswer
});
let store = createStore(
  reducers,
  currentstate,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
