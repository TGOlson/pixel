import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import canvas from './reducers/canvas';
import contract from './reducers/contract';
import loadPromise from './reducers/loadPromise';
import pixel from './reducers/pixel';
import user from './reducers/user';
import web3 from './reducers/web3';

const reducer = combineReducers({
  routing: routerReducer,
  canvas,
  contract,
  loadPromise,
  pixel,
  user,
  web3,
});

const logger = createLogger({
  collapsed: true,
  predicate: (getState, action) => action.type !== 'PIXEL_HOVER',
});

const store = createStore(
  reducer,
  applyMiddleware(promise, thunk, logger),
);

export default store;
