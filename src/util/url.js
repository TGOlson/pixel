import { DIMENSION } from './constants';

const round = (n, x) => Math.floor(x * (10 ** n)) / (10 ** n);

const BASE_X = DIMENSION / 2;
const BASE_Y = DIMENSION / 2;

// TODO: should use better regex
export const pathToTransform = (path) => {
  if (path.indexOf('/@') >= 0) {
    const tail = path.slice(2);
    const [pxStr, pyStr, kStr] = tail.split(',');

    const px = parseInt(pxStr, 10);
    const py = parseInt(pyStr, 10);
    const k = parseFloat(kStr, 10);

    const x = (BASE_X - px) * k;
    const y = (BASE_Y - py) * k;

    return { x, y, k };
  }

  return null;
};

export const transformToPath = ({ x, y, k }) => {
  const px = BASE_X - Math.round(x / k);
  const py = BASE_Y - Math.round(y / k);
  const kRounded = round(2, k);

  return `/@${px},${py},${kRounded}`;
};
