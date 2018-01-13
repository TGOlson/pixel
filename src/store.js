import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import message from './reducers/message';

const reducer = combineReducers({
  message,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger),
);

export default store;
