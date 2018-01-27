import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

import * as PixelActions from './actions/pixel';
import { getAccounts } from './actions/user';
import { getWeb3 } from './actions/web3';

import App from './components/App';
import Home from './containers/Home';
import About from './containers/About';
import Profile from './containers/Profile';
import Pixel from './containers/Pixel';

import './styles/index.less';

const history = syncHistoryWithStore(browserHistory, store);

const initialLoadPromise = store.dispatch(getWeb3()).then(() => {
  const web3 = store.getState().web3.instance;
  window.web3 = web3;

  store.dispatch(PixelActions.loadContract(web3));
  return store.dispatch(getAccounts(web3));
}).then(() => {
  const state = store.getState();

  // add useful bits to the window for debugging
  window.pixelContract = state.contract.pixel;
  window.defaultAccount = state.user.address;

  // TODO: think this can be dropped
  // only useful for console testing
  window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
});

const contractStatePromise = initialLoadPromise.then(() => {
  const contract = store.getState().contract.pixel;

  return Promise.all([
    store.dispatch(PixelActions.fetchPrices(contract)),
    store.dispatch(PixelActions.fetchStates(contract)),
    store.dispatch(PixelActions.fetchOwners(contract)),
  ]);
});

store.dispatch({
  type: 'INITIAL_LOAD_PROMISE',
  payload: { promise: initialLoadPromise },
});

store.dispatch({
  type: 'CONTRACT_STATE_PROMISE',
  payload: { promise: contractStatePromise },
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} >
        <IndexRoute component={Home} />
        <Route path="/about" component={About} />
        <Route path="/profile/:address" component={Profile} />
        <Route path="/pixel/:id" component={Pixel} />
        <Route path="/:coords" component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'), // eslint-disable-line no-undef
);
