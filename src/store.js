import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import canvas from './reducers/canvas';
import contract from './reducers/contract';
import loadPromise from './reducers/loadPromise';
import modal from './reducers/modal';
import navbar from './reducers/navbar';
import network from './reducers/network';
import pixel from './reducers/pixel';
import user from './reducers/user';
import web3 from './reducers/web3';

const reducer = combineReducers({
  routing: routerReducer,
  canvas,
  contract,
  loadPromise,
  modal,
  navbar,
  network,
  pixel,
  user,
  web3,
});

const filterLogTypes = [
  'PIXEL_HOVER',
  'CANVAS_ZOOM',
];

const logger = createLogger({
  collapsed: true,
  predicate: (getState, { type }) => !filterLogTypes.includes(type),
});

const store = createStore(
  reducer,
  applyMiddleware(promise, thunk, logger),
);

export default store;
