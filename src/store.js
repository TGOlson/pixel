import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';

import pixelcanvas from './reducers/pixelcanvas';

const reducer = combineReducers({
  routing: routerReducer,
  pixelcanvas,
});

const logger = createLogger({
  predicate: (getState, action) => action.type !== 'PIXEL_HOVER',
});

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger),
);

export default store;
