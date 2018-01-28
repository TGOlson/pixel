import PixelContractSpec from '../../build/contracts/Pixel.json';

export const loadContract = (web3) => {
  const PixelContract = web3.eth.contract(PixelContractSpec.abi);

  // TODO: use truffle-contract or something similar to help with contract loading
  // this will be especially useful in different environments
  const pixelContract = PixelContract.at(PixelContractSpec.networks['4447'].address);

  return {
    type: 'PIXEL_CONTRACT_INITIALIZED',
    payload: { instance: pixelContract },
  };
};

export const fetchInitialPrice = pixelContract => new Promise((resolve, reject) =>
  pixelContract.initialPrice((err, res) => {
    if (err) return reject(err);
    return resolve({
      type: 'PIXEL_INITIAL_PRICE_FETCHED',
      payload: { initialPrice: res },
    });
  }));

// export const fetchStates = () =>
//   dispatch =>
//     fetch('/data/states.buffer')
//       .then(r => r.arrayBuffer())
//       .then(buffer => dispatch({
//         type: 'PIXEL_STATES_FETCHED',
//         payload: { buffer },
//       }));

// TODO: this is obviously outrageous...
// we can't fetch all contract events on each app load, but fine for dev
// in the future we should provide some cached state known at block N, and apps just need to fetch from there
export const fetchStates = (pixelContract, toBlock) => new Promise((resolve) => {
  const buffer = new ArrayBuffer(1000 * 1000);
  const states = new Uint8ClampedArray(buffer);
  states.fill(0);

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.StateChange({}, { fromBlock: 0, toBlock });

  events.get((err, evs) => {
    evs.forEach(({ args }) => {
      const { _tokenId, _state } = args;
      states[_tokenId] = _state;
    });

    resolve({
      type: 'PIXEL_STATES_FETCHED',
      payload: { states },
    });
  });
});

// export const fetchPrices = () =>
//   dispatch =>
//     fetch('/data/prices.buffer')
//       .then(r => r.arrayBuffer())
//       .then(buffer => dispatch({
//         type: 'PIXEL_PRICES_FETCHED',
//         payload: { buffer },
//       }));

export const fetchPrices = (pixelContract, toBlock) => new Promise((resolve) => {
  // TODO: can't realistically store 1M big numbers
  const prices = new Array(1000 * 1000);
  // const buffer = new ArrayBuffer(1000 * 1000 * 2);
  // const prices = new Uint16Array(buffer);
  // prices.fill(1);

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.PriceChange({}, { fromBlock: 0, toBlock });

  events.get((err, evs) => {
    evs.forEach(({ args }) => {
      const { _tokenId, _price } = args;
      prices[_tokenId] = _price;
    });

    resolve({
      type: 'PIXEL_PRICES_FETCHED',
      payload: { prices },
    });
  });
});

// export const fetchOwners = () =>
//   dispatch =>
//     fetch('/data/owners.buffer')
//       .then(r => r.arrayBuffer())
//       .then(buffer => dispatch({
//         type: 'PIXEL_OWNERS_FETCHED',
//         payload: { buffer },
//       }));
//
// export const fetchAddresses = () =>
//   dispatch =>
//     fetch('/data/addresses.json')
//       .then(r => r.json())
//       .then(addresses => dispatch({
//         type: 'OWNER_ADDRESSES_FETCHED',
//         payload: { addresses },
//       }));

export const fetchOwners = (pixelContract, toBlock) => new Promise((resolve) => {
  const buffer = new ArrayBuffer(1000 * 1000);
  const owners = new Uint8ClampedArray(buffer);
  owners.fill(0);

  const addresses = [null];
  const addressesIndexMap = { null: 0 };

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.Transfer({}, { fromBlock: 0, toBlock });

  events.get((err, evs) => {
    evs.forEach(({ args }) => {
      const { _tokenId, _to } = args;

      // if the owner is already in our index map, use that
      if (addressesIndexMap[_to]) {
        owners[_tokenId] = addressesIndexMap[_to];
      } else {
        // otherwise, add the owner to the owner list and the index to the index map
        const idx = addresses.length;
        addresses.push(_to);
        addressesIndexMap[_to] = idx;
        owners[_tokenId] = idx;
      }
    });

    resolve({
      type: 'PIXEL_OWNERS_FETCHED',
      payload: { owners, addresses },
    });
  });
});

const formatSetStateEvent = ({ blockNumber, args, transactionIndex }) => ({
  type: 'SetState',
  blockNumber,
  transactionIndex,
  args: { state: parseInt(args._state.toString(), 10) },
});

const formatPriceChangeEvent = ({ blockNumber, args, transactionIndex }) => ({
  type: 'PriceChange',
  blockNumber,
  transactionIndex,
  args: { state: args._price.toString() },
});

const formatTransferEvent = ({ blockNumber, args, transactionIndex }) => ({
  type: 'Transfer',
  blockNumber,
  transactionIndex,
  args: { state: args._to.toString() },
});

export const getSetStateEvents = id => (dispatch, getState) => {
  const state = getState();
  const pixelContract = state.contract.pixel;

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.StateChange({ _tokenId: id }, { fromBlock: 0 });

  events.get((err, evs) => {
    const formattedEvents = evs.map(formatSetStateEvent);

    dispatch({
      type: 'STATE_EVENTS_FETCHED',
      payload: { id, events: formattedEvents },
    });
  });
};

export const getPriceChangeEvents = id => (dispatch, getState) => {
  const state = getState();
  const pixelContract = state.contract.pixel;

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.PriceChange({ _tokenId: id }, { fromBlock: 0 });

  events.get((err, evs) => {
    const formattedEvents = evs.map(formatPriceChangeEvent);

    dispatch({
      type: 'PRICE_EVENTS_FETCHED',
      payload: { id, events: formattedEvents },
    });
  });
};

export const getTransferEvents = id => (dispatch, getState) => {
  const state = getState();
  const pixelContract = state.contract.pixel;

  // TODO: is fromBlock a bad idea? will results be too slow on the main net?
  // also, should at least update to when contract was deployed
  const events = pixelContract.Transfer({ _tokenId: id }, { fromBlock: 0 });

  events.get((err, evs) => {
    const formattedEvents = evs.map(formatTransferEvent);

    dispatch({
      type: 'TRANSFER_EVENTS_FETCHED',
      payload: { id, events: formattedEvents },
    });
  });
};

const isUserRejection = ({ message }) => message.includes('User denied transaction signature');

export const purchasePixels = ids => (dispatch, getState) => {
  const state = getState();
  const from = state.user.address;
  const pixelContract = state.contract.pixel;
  const { prices, initialPrice } = state.pixel;

  const value = ids.map(x => prices[x] || initialPrice).reduce((x, y) => x.add(y));

  pixelContract.purchaseMany.estimateGas(ids, { from, value }, (estimateError, gasEstimate) => {
    if (estimateError) throw estimateError;

    pixelContract.purchaseMany(ids, { from, value, gas: gasEstimate + 2 }, (error, transaction) => {
      if (error) {
        // Note: don't alert on user rejections
        if (isUserRejection(error)) return;

        dispatch({
          type: 'PIXEL_PURCHASE_ERROR',
          payload: { error: error.message },
        });
      } else {
        dispatch({
          type: 'PIXEL_PURCHASE_SUCCESS',
          payload: { transaction },
        });
      }
    });
  });
};
