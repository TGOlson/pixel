const initialState = {
  instance: null,
  injected: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'WEB3_INITIALIZED': {
      const { instance, injected } = payload;

      return { ...state, instance, injected };
    }

    default: return state;
  }
};
