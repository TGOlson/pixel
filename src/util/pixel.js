import { DIMENSION } from './constants';

export const idToCoords = id => ([
  id % DIMENSION,
  Math.floor(id / DIMENSION),
]);

export const coordsToId = (x, y) => x + (y * DIMENSION);
