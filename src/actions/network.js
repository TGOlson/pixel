export const getNetworkId = web3 => new Promise((resolve, reject) => {
  web3.version.getNetwork((error, networkId) => (
    error
      ? reject(error)
      : resolve({
        type: 'NETWORK_ID_FETCHED',
        payload: { networkId },
      })
  ));
});

export default getNetworkId;
