const initialState = {
  purchaseSuccessModalOpen: false,
  purchaseErrorModalOpen: false,
  errorModal: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SET_MODAL':
      return { ...state, modal: payload.modal };

    // TODO: clear other modals
    case 'PIXEL_PURCHASE_SUCCESS':
      return { ...state, purchaseSuccessModalOpen: true };

    case 'PIXEL_PURCHASE_ERROR':
      return { ...state, purchaseErrorModalOpen: true };

    case 'PIXEL_SET_STATE_SUCCESS':
      return { ...state, purchaseSuccessModalOpen: true };

    case 'PIXEL_SET_STATE_ERROR':
      return { ...state, purchaseErrorModalOpen: true };

    case 'SET_ERROR_MODAL':
      return { ...state, errorModal: payload };

    case 'MODAL_DISMISS':
      return initialState;

    default: return state;
  }
};
