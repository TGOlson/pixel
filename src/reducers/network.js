const initialState = {
  networkId: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NETWORK_ID_FETCHED': {
      /* eslint-disable no-console */
      // TODO: should be a modal
      switch (payload.networkId) {
        case '1': {
          console.error('Attempting to connect to mainnet. Not yet supported.');
          break;
        }
        case '2': {
          console.error('Attempting to connect to deprecated testnet. No supported.');
          break;
        }
        case '3': {
          console.error('Attempting to connect to testnet. Not yet supported.');
          break;
        }
        case '5777': break;
        default: {
          console.error(`Attempting to unknown network id ${payload.networkId}.`);
          break;
        }
      }
      /* eslint-enable */

      return { ...state, networkId: payload.networkId };
    }

    default: return state;
  }
};
