const initialState = {
  alertModal: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    // TODO: these could be broadcast as SET_ALERT_MODAL events
    // no other reducer listens to these...
    case 'PIXEL_PURCHASE_SUCCESS':
      return {
        ...state,
        alertModal: {
          type,
          data: { transaction: payload.transaction },
        },
      };

    case 'PIXEL_SET_STATE_SUCCESS':
      return {
        ...state,
        alertModal: {
          type,
          data: { transaction: payload.transaction },
        },
      };

    case 'SET_ALERT_MODAL':
      return { ...state, alertModal: payload };

    case 'NETWORK_ID_FETCHED': {
      if (!payload.supported) {
        const alertModal = {
          type: 'UNSUPPORTED_NETWORK',
          data: payload,
        };

        return { ...state, alertModal };
      }

      return state;
    }

    case 'MODAL_DISMISS':
      return initialState;

    default: return state;
  }
};
