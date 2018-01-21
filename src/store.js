import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import pixel from './reducers/pixel';
import canvas from './reducers/canvas';
import web3 from './reducers/web3';

const reducer = combineReducers({
  routing: routerReducer,
  pixel,
  canvas,
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
