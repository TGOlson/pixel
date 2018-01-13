export const setMessage = message =>
  dispatch => dispatch({
    type: 'SET_MESSAGE',
    payload: { message },
  });

export const foo = () => null;
