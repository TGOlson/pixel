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
