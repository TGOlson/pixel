const initialState = {
  mode: 'Purchase',
  showPixelInfo: true,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NAVBAR_MODE_CHANGE':
      return { ...state, mode: payload.mode };

    case 'SHOW_PIXEL_INFO':
      return { ...state, showPixelInfo: payload.showPixelInfo };

    default: return state;
  }
};
