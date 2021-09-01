import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "connected-react-router";

import thunk from "redux-thunk";
import CreateRootReducer from "./reducers/index";

export default function configureStore(history, initialState = {}) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middlewares = [routerMiddleware(history), thunk];


  return createStore(
    CreateRootReducer(history),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
}
