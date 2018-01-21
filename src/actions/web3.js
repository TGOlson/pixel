import Web3 from 'web3';

export const getWeb3 = () => (dispatch) => {
  // Check if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    const instance = new Web3(web3.currentProvider); // eslint-disable-line no-undef

    dispatch({
      type: 'WEB3_INITIALIZED',
      payload: { instance, injected: true },
    });
  } else {
    // Fallback to localhost if no web3 injection. We've configured this to
    // use the development console's port by default.
    // Note: in the future this should be able to use a production node.
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');

    const instance = new Web3(provider);

    dispatch({
      type: 'WEB3_INITIALIZED',
      payload: { instance, injected: false },
    });
  }
};

export default getWeb3;
