import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { fetchPrices, fetchStates } from './actions/pixel';
import store from './store';
import App from './components/App';
import Home from './containers/Home';
import About from './containers/About';
import './styles/index.less';


const history = syncHistoryWithStore(browserHistory, store);

// run initial actions
store.dispatch(fetchPrices());
store.dispatch(fetchStates());

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
