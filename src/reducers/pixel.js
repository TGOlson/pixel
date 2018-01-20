import { DIMENSION, PIXEL_COLORS_HEX_REVERSED } from '../util/constants';

const getPixelHex = (x) => {
  const hex = PIXEL_COLORS_HEX_REVERSED[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return hex;
};

const initialState = {
  imageData: null,
  prices: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PIXEL_STATES_FETCHED': {
      const states = new Uint8ClampedArray(payload.buffer);
      const hexValues = new Uint32Array(payload.buffer.byteLength);

      states.forEach((x, i) => {
        hexValues[i] = getPixelHex(x);
      });

      const dataArray = new Uint8ClampedArray(hexValues.buffer);
      const imageData = new ImageData(dataArray, DIMENSION);

      return { ...state, imageData };
    }

    case 'PIXEL_PRICES_FETCHED': {
      // TODO: consider what format these prices should be stored in
      const prices = new Uint16Array(payload.buffer);

      return { ...state, prices };
    }

    default: return state;
  }
};
