import { PIXEL_COLORS_HEX, PIXEL_COLORS_HEX_REVERSED } from '../util/constants';

export const getHex = (x) => {
  const hex = PIXEL_COLORS_HEX[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return `#${hex.toString(16)}`;
};

export const getHexBytesReversed = (x) => {
  const hex = PIXEL_COLORS_HEX_REVERSED[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return hex;
};
