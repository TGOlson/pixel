const initialState = {
  pixel: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PIXEL_CONTRACT_INITIALIZED':
      return { ...state, pixel: payload.instance };

    default: return state;
  }
};
