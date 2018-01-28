export const getUserAddress = web3 => new Promise((resolve, reject) => {
  web3.eth.getAccounts((error, accounts) => (
    error
      ? reject(error)
      : resolve({
        type: 'USER_ADDRESS_FETCHED',
        payload: { address: accounts[0] },
      })
  ));
});

export const checkForAddressChange = () => (dispatch, getState) => {
  const { web3, user } = getState();
  const previousAddress = user.address;

  web3.instance.eth.getAccounts((error, accounts) => (
    previousAddress === accounts[0]
      ? null
      : dispatch({
        type: 'USER_ADDRESS_FETCHED',
        payload: { address: accounts[0] },
      })
  ));
};
