import { PIXEL_COLORS_HEX, PIXEL_COLORS_HEX_BYTES_REVERSED } from '../util/constants';

export const getHex = (x) => {
  const hex = PIXEL_COLORS_HEX[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return hex;
};

export const getHexBytesReversed = (x) => {
  const hex = PIXEL_COLORS_HEX_BYTES_REVERSED[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return hex;
};
