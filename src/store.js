import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import canvas from './reducers/canvas';
import contract from './reducers/contract';
import pixel from './reducers/pixel';
import user from './reducers/user';
import web3 from './reducers/web3';

const reducer = combineReducers({
  routing: routerReducer,
  canvas,
  contract,
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
  applyMiddleware(thunk, logger),
);

export default store;
