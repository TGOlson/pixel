const getNetworkInfo = (networkId) => {
  switch (networkId) {
    case '1': return ['mainnet', false];
    case '2': return ['deprecated testnet', false];
    case '3': return ['testnet', false];
    case '4447': return ['local truffle', true];
    case '5777': return ['local ganache', true];
    default: return ['unknown', false];
  }
};

export const getNetworkId = web3 => new Promise((resolve, reject) => {
  web3.version.getNetwork((error, networkId) => {
    if (error) return reject(error);

    const [networkName, supported] = getNetworkInfo(networkId);

    resolve({
      type: 'NETWORK_ID_FETCHED',
      payload: { networkId, networkName, supported },
    });

    return null;
  });
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
