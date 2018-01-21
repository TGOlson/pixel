export const fetchStates = () =>
  dispatch =>
    fetch('/data/states.buffer')
      .then(r => r.arrayBuffer())
      .then(buffer => dispatch({
        type: 'PIXEL_STATES_FETCHED',
        payload: { buffer },
      }));

export const fetchPrices = () =>
  dispatch =>
    fetch('/data/prices.buffer')
      .then(r => r.arrayBuffer())
      .then(buffer => dispatch({
        type: 'PIXEL_PRICES_FETCHED',
        payload: { buffer },
      }));

export const fetchOwners = () =>
  dispatch =>
    fetch('/data/owners.buffer')
      .then(r => r.arrayBuffer())
      .then(buffer => dispatch({
        type: 'PIXEL_OWNERS_FETCHED',
        payload: { buffer },
      }));

export const fetchAddresses = () =>
  dispatch =>
    fetch('/data/addresses.json')
      .then(r => r.json())
      .then(addresses => dispatch({
        type: 'OWNER_ADDRESSES_FETCHED',
        payload: { addresses },
      }));
