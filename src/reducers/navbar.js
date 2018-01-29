const initialState = {
  mode: 'Purchase',
  settingsOpen: false,
  showPixelInfo: true,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'NAVBAR_MODE_CHANGE':
      return { ...state, mode: payload.mode };

    case 'SETTINGS_MODAL_TOGGLE':
      return { ...state, settingsOpen: payload.open };

    case 'SHOW_PIXEL_INFO':
      return { ...state, showPixelInfo: payload.showPixelInfo };

    default: return state;
  }
};
