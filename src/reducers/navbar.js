const initialState = {
  mode: 'Purchase',
  showPixelInfo: true,
  selectedColor: 0xf0c674ff,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NAVBAR_MODE_CHANGE':
      return { ...state, mode: payload.mode };

    case 'SHOW_PIXEL_INFO':
      return { ...state, showPixelInfo: payload.showPixelInfo };

    case 'COLOR_SELECT_CHANGE':
      return { ...state, selectedColor: payload.color };

    default: return state;
  }
};
