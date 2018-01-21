import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import canvas from './reducers/canvas';
import pixel from './reducers/pixel';
import user from './reducers/user';
import web3 from './reducers/web3';

const reducer = combineReducers({
  routing: routerReducer,
  canvas,
  pixel,
  user,
  web3,
});

const logger = createLogger({
  predicate: (getState, action) => action.type !== 'PIXEL_HOVER',
});

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger),
);

export default store;
