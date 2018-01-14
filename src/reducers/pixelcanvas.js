const initialState = {
  hover: [null, null],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PIXEL_HOVER':
      return { ...state, hover: payload.pixel };

    default: return state;
  }
};
