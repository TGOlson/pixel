import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

import App from './components/App';
import Home from './containers/Home';
import About from './containers/About';

import './styles/index.less';

const history = syncHistoryWithStore(browserHistory, store);

// TODO: move to actions dir?
fetch('/data/states.buffer')
  .then(r => r.arrayBuffer())
  .then(buffer => store.dispatch({
    type: 'PIXEL_STATES_FETCHED',
    payload: { buffer },
  }));

fetch('/data/prices.json')
  .then(r => r.arrayBuffer())
  .then(buffer => store.dispatch({
    type: 'PIXEL_PRICES_FETCHED',
    payload: { buffer },
  }));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} >
        <IndexRoute component={Home} />
        <Route path="/about" component={About} />
        <Route path="/:coords" component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'), // eslint-disable-line no-undef
);
