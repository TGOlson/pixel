import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import store from './store';

import * as PixelActions from './actions/pixel';
import { getNetworkId, getBlockNumber } from './actions/network';
import { getUserAddress, checkForAddressChange } from './actions/user';
import { getWeb3 } from './actions/web3';
import eventHandler from './eventHandler';

import App from './components/App';
import Home from './containers/Home';
import About from './containers/About';
import Profile from './containers/Profile';
import PixelDetails from './containers/PixelDetails';

import './styles/index.less';

const history = syncHistoryWithStore(browserHistory, store);

const setWindowDebugObjects = () => {
  const state = store.getState();

  // add useful bits to the window for debugging
  window.store = store;
  window.web3 = state.web3.instance;
  window.pixelContract = state.contract.pixel;
  window.defaultAccount = state.user.address;

  // TODO: think this can be dropped
  // only useful for console testing
  // window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
};

const initialLoadPromise = store.dispatch(getWeb3()).then(() => {
  const web3 = store.getState().web3.instance;

  return Promise.all([
    store.dispatch(getNetworkId(web3)),
    store.dispatch(getUserAddress(web3)),
    store.dispatch(getBlockNumber(web3)),
  ]).then(() => {
    const { networkId } = store.getState().network;
    return store.dispatch(PixelActions.loadContract(web3, networkId));
  });
}).then(() => setWindowDebugObjects());

// TODO: components should initiate this promise if they rely on this data
// allows for this promise to be conditionally run depending on other props
const contractStatePromise = initialLoadPromise.then(() => {
  const contract = store.getState().contract.pixel;
  const { blockNumber } = store.getState().network;

  return Promise.all([
    store.dispatch(PixelActions.fetchPrices(contract, blockNumber)),
    store.dispatch(PixelActions.fetchStates(contract, blockNumber)),
    store.dispatch(PixelActions.fetchOwners(contract, blockNumber)),
    store.dispatch(PixelActions.fetchInitialPrice(contract)),
  ]).then(() => blockNumber);
}).then((blockNumber) => {
  const contract = store.getState().contract.pixel;

  // Start watching for events after initial states have been fetched.
  // Use the same blockNumber that was used to fetch initial state to make sure no events are missed.
  contract.allEvents({ fromBlock: blockNumber }).watch((err, event) => {
    if (err) {
      // TODO: ...?
      console.error('Error handling event stream', err);
    } else {
      eventHandler(store.dispatch, event);
    }
  });

  window.setInterval(() => store.dispatch(checkForAddressChange()), 1000);
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
        <Route path="/pixel/:id" component={PixelDetails} />
        <Route path="/:coords" component={Home} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app'), // eslint-disable-line no-undef
);
