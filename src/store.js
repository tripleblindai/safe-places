import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { reducer } from "./redux";

const rootReducer = combineReducers({
  reducer
});

const persistConfig = {
  key: "root",
  storage,
  timeout: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers();

const store = createStore(persistedReducer, enhancer);

//axiosInterceptors.setupInterceptors(store);

// run the saga
//sagaMiddleware.run(watcherSaga);

export default () => {
  let persistor = persistStore(store);
  return { store, persistor };
};
