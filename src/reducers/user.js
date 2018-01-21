const initialState = {
  address: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'USER_ADDRESS_FETCHED':
      return { ...state, address: payload.address };

    default: return state;
  }
};
