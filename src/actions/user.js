export const getAccounts = web3 => new Promise((resolve, reject) => {
  web3.eth.getAccounts((error, accounts) => (
    error
      ? reject(error)
      : resolve({
        type: 'USER_ADDRESS_FETCHED',
        payload: { address: accounts[0] },
      })
  ));
});

export default getAccounts;
