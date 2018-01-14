import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import pixelcanvas from './reducers/pixelcanvas';

const reducer = combineReducers({
  pixelcanvas,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk, logger),
);

export default store;
