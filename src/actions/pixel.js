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
export const fetchStates = () =>
  (dispatch, getState) => {
    const state = getState();
    const pixelContract = state.contract.pixel;
    const buffer = new ArrayBuffer(1000 * 1000);
    const states = new Uint8ClampedArray(buffer);
    states.fill(0);

    // TODO: is fromBlock a bad idea? will results be too slow on the main net?
    // also, should at least update to when contract was deployed
    const events = pixelContract.StateChange({}, { fromBlock: 0 });

    events.get((err, evs) => {
      evs.forEach(({ args }) => {
        const { _tokenId, _state } = args;
        states[_tokenId] = _state;
      });

      dispatch({
        type: 'PIXEL_STATES_FETCHED',
        payload: { states },
      });
    });
  };

// export const fetchPrices = () =>
//   dispatch =>
//     fetch('/data/prices.buffer')
//       .then(r => r.arrayBuffer())
//       .then(buffer => dispatch({
//         type: 'PIXEL_PRICES_FETCHED',
//         payload: { buffer },
//       }));

export const fetchPrices = () =>
  (dispatch, getState) => {
    const state = getState();
    const pixelContract = state.contract.pixel;
    const buffer = new ArrayBuffer(1000 * 1000 * 2);
    const prices = new Uint16Array(buffer);
    prices.fill(1);

    // TODO: is fromBlock a bad idea? will results be too slow on the main net?
    // also, should at least update to when contract was deployed
    const events = pixelContract.PriceChange({}, { fromBlock: 0 });

    events.get((err, evs) => {
      evs.forEach(({ args }) => {
        const { _tokenId, _price } = args;
        prices[_tokenId] = _price;
      });

      dispatch({
        type: 'PIXEL_PRICES_FETCHED',
        payload: { prices },
      });
    });
  };

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

export const fetchOwners = () =>
  (dispatch, getState) => {
    const state = getState();
    const pixelContract = state.contract.pixel;
    const buffer = new ArrayBuffer(1000 * 1000);
    const owners = new Uint8ClampedArray(buffer);
    owners.fill(0);

    const addresses = [null];
    const addressesIndexMap = { null: 0 };

    // TODO: is fromBlock a bad idea? will results be too slow on the main net?
    // also, should at least update to when contract was deployed
    const events = pixelContract.Transfer({}, { fromBlock: 0 });

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

      dispatch({
        type: 'PIXEL_OWNERS_FETCHED',
        payload: { owners },
      });

      dispatch({
        type: 'OWNER_ADDRESSES_FETCHED',
        payload: { addresses },
      });

      // dispatch({
      //   type: 'PIXEL_STATES_FETCHED',
      //   payload: { buffer: array },
      // });
    });
  };

const formatSetStateEvent = ({ blockNumber, args }) => ({
  type: 'SetState',
  blockNumber,
  args: { state: parseInt(args._state.toString(), 10) },
});

export const getSetStateEvents = id =>
  (dispatch, getState) => {
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
