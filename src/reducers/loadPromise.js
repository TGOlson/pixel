const initialState = {
  initialLoad: null,
  contractState: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'INITIAL_LOAD_PROMISE':
      return { ...state, initialLoad: payload.promise };

    case 'CONTRACT_STATE_PROMISE':
      return { ...state, contractState: payload.promise };

    default: return state;
  }
};
