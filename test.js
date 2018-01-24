const Pixel = require('./build/contracts/Pixel.json');
const Web3 = require('web3');

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
const web3 = new Web3(provider);

const PixelContract = web3.eth.contract(Pixel.abi);

// TODO: use truffle-contract or something similar to help with contract loading
// this will be especially useful in different environments
const pixelContract = PixelContract.at(Pixel.networks['4447'].address);

console.log(pixelContract.maxSupply().toString());

const allEvents = pixelContract.allEvents({ fromBlock: 0, toBlock: 'latest' }, (err, ev) => {
  console.log(ev);
})

console.log(allEvents);
