const initialState = {
  mode: 'Purchase',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NAVBAR_MODE_CHANGE':
      return { ...state, mode: payload.mode };

    default: return state;
  }
};
