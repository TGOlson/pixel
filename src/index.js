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

import './styles/index.less';

import Pixel from '../build/contracts/Pixel.json';

window.Pixel = Pixel;
window.store = store;


const history = syncHistoryWithStore(browserHistory, store);

// run initial actions
store.dispatch(PixelActions.fetchPrices());
store.dispatch(PixelActions.fetchStates());
store.dispatch(PixelActions.fetchOwners());
store.dispatch(PixelActions.fetchAddresses());

// Wait for window to load to avoid race conditions with web3 injection timing.
window.addEventListener('load', () => {
  const web3 = store.dispatch(getWeb3());
  store.dispatch(getAccounts());

  window.web3 = web3;

  // set default account so we can run transactions
  // TODO: this should be handled by a user reducer
  web3.eth.defaultAccount = web3.eth.accounts[0];

  const PixelContract = web3.eth.contract(Pixel.abi);

  // TODO: use truffle-contract or something similar to help with contract loading
  // this will be especially useful in different environments
  const pixelContract = PixelContract.at(Pixel.networks['4447'].address);
  window.pixelContract = pixelContract;

  const setState = pixelContract.SetState();

  setState.watch((error, event) => {
    if (error) {
      console.error('pixel contract error', error);
    } else {
      const { _fromState, _toState, _tokenId } = event.args;
      const fromState = parseInt(_fromState, 10);
      const toState = parseInt(_toState, 10);
      const tokenId = parseInt(_tokenId, 10);

      console.log(fromState, toState, tokenId);

      // TODO: put updates that come before the canvas is loaded in a queue
      // run the updates after the canvas is ready
      if (!store.getState().pixel.hexValues) {
        console.log('Skipping pixel state change');
      };

      // TODO: this could be batched to avoid bursts of updates
      store.dispatch({
        type: 'PIXEL_STATE_CHANGE',
        payload: { id: tokenId, state: toState },
      });
    }
  });

  // test contract by running this in the console
  // pixelContract.pixelStates(0).toString();
  // pixelContract.setState(0, 1);
  // pixelContract.pixelStates(0).toString();
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} >
        <IndexRoute component={Home} />
        <Route path="/about" component={About} />
        <Route path="/profile/:address" component={Profile} />
        <Route path="/:coords" component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'), // eslint-disable-line no-undef
);
