const initialState = {
  instance: null,
  injected: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'WEB3_INITIALIZED': {
      const { instance, injected } = payload;

      // Put web3 on the window for debugging
      window.web3 = instance;

      return { ...state, instance, injected };
    }

    default: return state;
  }
};
