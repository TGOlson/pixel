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

export const getBlockNumber = web3 => new Promise((resolve, reject) => {
  web3.eth.getBlockNumber((error, blockNumber) => (
    error
      ? reject(error)
      : resolve({
        type: 'BLOCK_NUMBER_FETCHED',
        payload: { blockNumber },
      })
  ));
});

export default getNetworkId;
