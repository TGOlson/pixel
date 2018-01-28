const initialState = {
  purchaseSuccessModalOpen: false,
  purchaseErrorModalOpen: false,
  settingsModalOpen: false, // todo: unused
};

export default (state = initialState, { type, payload }) => { // eslint-disable-line no-unused-vars
  switch (type) {
    // TODO: clear other modals
    case 'PIXEL_PURCHASE_SUCCESS':
      return { ...state, purchaseSuccessModalOpen: true };

    case 'PIXEL_PURCHASE_ERROR':
      return { ...state, purchaseErrorModalOpen: true };

    case 'SETTINGS_MODAL_OPEN':
      return { ...state, settingsModalOpen: true };

    case 'MODAL_DISMISS':
      return initialState;

    default: return state;
  }
};
