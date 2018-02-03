const Pixel = artifacts.require('./Pixel.sol'); // eslint-disable-line no-undef

const log = (...x) => console.log(...x); // eslint-disable-line no-console

const fill = (n, x) => new Array(n).fill(x);

const range = (x, y) => {
  const xs = [];

  for (let i = x; i <= y; i += 1) {
    xs.push(i);
  }

  return xs;
};

const seedData = (instance, accounts) => {
  log('Seeding dev data...');

  return instance.initialPrice().then((initialPrice) => {
    const setup = (pixels, states) =>
      instance.purchaseMany(pixels, { from: accounts[0], value: initialPrice.mul(pixels.length) })
        .then(() => instance.setStates(pixels, states));

    return Promise.all([
      setup(range(0, 15), fill(16, 0)),
      setup(range(1000, 1015), fill(16, 1)),
      setup(range(2000, 2015), fill(16, 2)),
      setup(range(3000, 3015), fill(16, 3)),
      setup(range(4000, 4015), fill(16, 4)),
      setup(range(5000, 5015), fill(16, 5)),
      setup(range(6000, 6015), fill(16, 6)),
      setup(range(7000, 7015), fill(16, 7)),
      setup(range(8000, 8015), fill(16, 8)),
      setup(range(9000, 9015), fill(16, 9)),
      setup(range(10000, 10015), fill(16, 10)),
      setup(range(11000, 11015), fill(16, 11)),
      setup(range(12000, 12015), fill(16, 12)),
      setup(range(13000, 13015), fill(16, 13)),
      setup(range(14000, 14015), fill(16, 14)),
      setup(range(15000, 15015), fill(16, 15)),
    ]);
  }).then(() => log('Seed complete!'));
};

module.exports = (deployer, network, accounts) => {
  if (network === 'development' || network === 'develop') {
    deployer.deploy(Pixel)
      .then(() => Pixel.deployed())
      .then(instance => seedData(instance, accounts));
  } else {
    throw new Error('Not ready to deploy outside of dev!');
  }
};
