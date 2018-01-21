const fs = require('fs');
const path = require('path');

const addresses = [
  null,
  '0x627306090abab3a6e1400e9345bc60c78a8bef57',
  '0xf17f52151ebef6c7334fad080c5704d77216b732',
  '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
  '0x821aea9a577a9b44299b9c15c88cf3087f3b5544',
  '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2',
  '0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e',
  '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
  '0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5',
  '0x6330a553fc93768f612722bb8c2ec78ac90b3bbc',
  '0x5aeda56215b167893e80b4fe645ba6d5bab767de',
];

const randomInt = max =>
  Math.floor(Math.random() * Math.floor(max));

const randomPixel = () => {
  const isOwned = randomInt(2) === 0;

  return {
    state: isOwned ? randomInt(16) : 0,
    price: isOwned ? randomInt(1000) : 1,
    owner: isOwned ? addresses[randomInt(11)] : null,
  };
};

const randomPixels = (num) => {
  const data = [];
  let i;

  for (i = 0; i < num; i += 1) {
    data.push(randomPixel());
  }

  return data;
};

console.log('Generating test data');

const pixels = randomPixels(1000 * 1000);
const states = pixels.map(p => p.state);
const prices = pixels.map(p => p.price);
// const owners = pixels.map(p => p.owner);

// This will hit problems if the address list ever has more than 256 addresses
// simplifies generating test data for now
const owners = new Uint8Array(1000000);

for (let i = 0; i < pixels.length; i++) {
  const { owner } = pixels[i];

  if (owner === null) {
    owners[i] = 0;
  } else {
    const ownerIndex = addresses.indexOf(owner);

    if (ownerIndex < 0) throw new Error(`Unable to find owner index for ${owner}`);

    owners[i] = ownerIndex;
  }
}

const outputDir = path.join(__dirname, '../public/data');
const outputPath = f => path.join(outputDir, `/${f}`);

console.log(`Making outputdir: ${outputDir}`);

fs.mkdir(outputDir, () => {
  console.log('Writing test data');

  // TODO: two 4bit numbers can be combined into a single byte
  fs.writeFileSync(outputPath('states.buffer'), Buffer.from(states));

  const uint32 = new Uint16Array(prices);
  const uint8 = new Uint8Array(uint32.buffer);

  // TODO: better format than json?
  fs.writeFileSync(outputPath('prices.buffer'), Buffer.from(uint8));

  fs.writeFileSync(outputPath('addresses.json'), JSON.stringify(addresses));
  fs.writeFileSync(outputPath('owners.buffer'), Buffer.from(owners));
});
