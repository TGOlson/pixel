const fs = require('fs');
const path = require('path');

const randomInt = max =>
  Math.floor(Math.random() * Math.floor(max));

const randomPixel = () => {
  const isOwned = randomInt(2) === 0;

  return {
    state: isOwned ? randomInt(16) : 0,
    price: isOwned ? randomInt(1000) : 1,
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

const outputDir = path.join(__dirname, '../public/data');
const outputPath = f => path.join(outputDir, `/${f}`);

console.log(`Making outputdir: ${outputDir}`);

fs.mkdir(outputDir, () => {
  console.log('Writing test data');

  fs.writeFileSync(outputPath('states.buffer'), Buffer.from(states));

  // TODO: better format than json?
  fs.writeFileSync(outputPath('prices.json'), JSON.stringify(prices));
});
