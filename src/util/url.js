import { DIMENSION } from './constants';

const round = (n, x) => Math.floor(x * (10 ** n)) / (10 ** n);

const viewX = 900;
const viewY = 656;

const offsetX = (viewX - DIMENSION) / 2;
const offsetY = (viewY - DIMENSION) / 2;


// TODO: should use better regex
// TODO: needs to take in viewX and viewY
export const pathToTransform = (path) => {
  if (path.indexOf('/@') >= 0) {
    const tail = path.slice(2);
    const [xStr, yStr, kStr] = tail.split(',');

    const midPixelX = parseInt(xStr, 10);
    const midPixelY = parseInt(yStr, 10);
    const k = parseFloat(kStr, 10);

    const x = (viewX / 2) - (k * offsetX) - (k * midPixelX);
    const y = (viewY / 2) - (k * offsetY) - (k * midPixelY);

    return { x, y, k };
  }

  return null;
};

// TODO: needs to take in viewX and viewY
export const transformToPath = ({ x, y, k }) => {
  const midPixelX = Math.round((viewX / (k * 2)) - (x / k) - offsetX);
  const midPixelY = Math.round((viewY / (k * 2)) - (y / k) - offsetY);

  const kRounded = round(2, k);

  return `/@${midPixelX},${midPixelY},${kRounded}`;
};
