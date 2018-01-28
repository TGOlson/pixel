import Web3 from 'web3';

export const getWeb3 = () => new Promise((resolve) => {
  // Wait for window to load to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    // Check if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      const instance = new Web3(web3.currentProvider); // eslint-disable-line no-undef

      resolve({
        type: 'WEB3_INITIALIZED',
        payload: { instance, injected: true },
      });
    }

    // Fallback to localhost if no web3 injection. We've configured this to
    // use the development console's port by default.
    // Note: in the future this should be able to use a production node.
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');

    const instance = new Web3(provider);

    resolve({
      type: 'WEB3_INITIALIZED',
      payload: { instance, injected: false },
    });
  });
});

export default getWeb3;
