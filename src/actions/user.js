export const getAccounts = () =>
  (dispatch, getState) => {
    const state = getState();
    const web3 = state.web3.instance;

    web3.eth.getAccounts((err, accounts) => {
      dispatch({
        type: 'USER_ADDRESS_FETCHED',
        payload: { address: accounts[0] },
      });
    });
  };

export default getAccounts;
