/* eslint-disable */

const Pixel = artifacts.require("./Pixel.sol");

const oneEther = '1000000000000000000'; // wei
// const initialPrice = '100000000000000'; // wei

const seedData = (instance, accounts) => {
  console.log('Seeding dev data...');

  return instance.initialPrice()
    .then(initialPrice => instance.purchaseMany([0, 1, 2, 3, 4], { from: accounts[0], value: initialPrice.mul(5) }))
    .then(() => instance.setStates([0, 1, 2, 3, 4], [10, 10, 10, 10, 10]))
    .then(() => console.log('Seed complete!'));
};

module.exports = (deployer, network, accounts) => {
  const res = deployer.deploy(Pixel);

  if (network == "development") {
    deployer.deploy(Pixel)
      .then(() => Pixel.deployed())
      .then(instance => seedData(instance, accounts));
  } else {
    throw new Error('Not ready to deploy outside of dev!');
  }
};
