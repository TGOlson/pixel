const initialState = {
  purchaseSuccessModalOpen: false,
  purchaseErrorModalOpen: false,
};

export default (state = initialState, { type, payload }) => { // eslint-disable-line no-unused-vars
  switch (type) {
    // TODO: clear other modals
    case 'PIXEL_PURCHASE_SUCCESS':
      return { ...state, purchaseSuccessModalOpen: true };

    case 'PIXEL_PURCHASE_ERROR':
      return { ...state, purchaseErrorModalOpen: true };

    case 'PIXEL_SET_STATE_SUCCESS':
      return { ...state, purchaseSuccessModalOpen: true };

    case 'PIXEL_SET_STATE_ERROR':
      return { ...state, purchaseErrorModalOpen: true };

    case 'MODAL_DISMISS':
      return initialState;

    default: return state;
  }
};
