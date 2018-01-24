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

import PixelContractSpec from '../build/contracts/Pixel.json';

window.PixelContractSpec = PixelContractSpec;
window.store = store;


const history = syncHistoryWithStore(browserHistory, store);

// Wait for window to load to avoid race conditions with web3 injection timing.
window.addEventListener('load', () => {
  const web3 = store.dispatch(getWeb3());
  store.dispatch(getAccounts());

  window.web3 = web3;

  // set default account so we can run transactions
  // TODO: this should be handled by a user reducer
  web3.eth.defaultAccount = web3.eth.accounts[0];

  const PixelContract = web3.eth.contract(PixelContractSpec.abi);

  // TODO: use truffle-contract or something similar to help with contract loading
  // this will be especially useful in different environments
  const pixelContract = PixelContract.at(PixelContractSpec.networks['4447'].address);
  window.pixelContract = pixelContract;

  store.dispatch({
    type: 'PIXEL_CONTRACT_INITIALIZED',
    payload: { instance: pixelContract },
  });

  // run initial actions
  store.dispatch(PixelActions.fetchPrices());
  store.dispatch(PixelActions.fetchStates());
  store.dispatch(PixelActions.fetchOwners());
  // store.dispatch(PixelActions.fetchAddresses());


  // TODO: generic event handler
  pixelContract.StateChange().watch((error, event) => {
    if (error) {
      console.error('pixel contract error', error);
    } else {
      const { _tokenId, _state } = event.args;
      const id = parseInt(_tokenId, 10);
      const state = parseInt(_state, 10);

      // console.log(fromState, toState, tokenId);

      // TODO: put updates that come before the canvas is loaded in a queue
      // run the updates after the canvas is ready
      if (!store.getState().pixel.hexValues) {
        console.log('Skipping pixel state change');
        return;
      }

      // TODO: this could be batched to avoid bursts of updates
      store.dispatch({
        type: 'PIXEL_STATE_CHANGE',
        payload: { id, state },
      });
    }
  });

  // Wait until web3 setup to render
  // TODO: kinda hacky, should find better system
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
});
