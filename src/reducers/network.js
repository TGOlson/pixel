const initialState = {
  networkId: null,
  networkName: null,
  supported: true,
  blockNumber: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NETWORK_ID_FETCHED': {
      const { networkId, networkName, supported } = payload;

      return {
        ...state,
        networkId,
        networkName,
        supported,
      };
    }

    case 'BLOCK_NUMBER_FETCHED':
      return { ...state, blockNumber: payload.blockNumber };

    default: return state;
  }
};
