import { DIMENSION, PIXEL_COLORS_HEX_REVERSED } from '../util/constants';

const getPixelHex = (x) => {
  const hex = PIXEL_COLORS_HEX_REVERSED[x];

  if (hex === undefined) {
    throw new Error(`Unable to find predefined hex value for pixel state '${x}'`);
  }

  return hex;
};

const initialState = {
  hexValues: null,
  imageData: null,
  prices: null,
  lastUpdateReceived: null,
  owners: null,
  stateEventsById: {},
  priceEventsById: {},
  transferEventsById: {},
  initialPrice: null,
  purchaseError: null,
  purchaseTransaction: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    // Initial state /////////////////////////////////////////////////////////////////////////////////////////

    case 'PIXEL_STATES_FETCHED': {
      const { states } = payload;
      const hexValues = new Uint32Array(states.byteLength);

      states.forEach((x, i) => {
        hexValues[i] = getPixelHex(x);
      });

      const dataArray = new Uint8ClampedArray(hexValues.buffer);
      const imageData = new ImageData(dataArray, DIMENSION);

      return {
        ...state,
        imageData,
        hexValues,
        lastUpdateReceived: new Date(),
      };
    }

    // TODO: consider what format these prices should be stored in
    case 'PIXEL_PRICES_FETCHED':
      return { ...state, prices: payload.prices };

    case 'PIXEL_OWNERS_FETCHED':
      return { ...state, owners: payload.owners, addresses: payload.addresses };

    case 'PIXEL_INITIAL_PRICE_FETCHED':
      return { ...state, initialPrice: payload.initialPrice };

    // State changes /////////////////////////////////////////////////////////////////////////////////////////

    case 'PIXEL_TRANSFER': {
      const { id, to } = payload;
      const { owners, addresses } = state;

      // Note: normally we don't want to mutate state values
      // But here, mutating the underlying buffer is very fast
      if (addresses[to] !== undefined) {
        owners[id] = addresses[to];
      } else {
        const index = addresses.length;
        addresses.push(to);
        owners[id] = index;
      }

      return { ...state, lastUpdateReceived: new Date() };
    }

    case 'PIXEL_PRICE_CHANGE': {
      const { id, price } = payload;
      const { prices } = state;

      // Note: normally we don't want to mutate state values
      // But here, mutating the underlying buffer is very fast
      prices[id] = price;

      return { ...state, lastUpdateReceived: new Date() };
    }

    case 'PIXEL_STATE_CHANGE': {
      const { id, state: pixelState } = payload;
      const { hexValues } = state;

      // Note: normally we don't want to mutate state values
      // But here, mutating the underlying buffer is very fast
      hexValues[id] = getPixelHex(pixelState);

      return { ...state, lastUpdateReceived: new Date() };
    }

    // Pixel events //////////////////////////////////////////////////////////////////////////////////////////

    case 'STATE_EVENTS_FETCHED': {
      const { id, events } = payload;
      const { stateEventsById } = state;

      const newStateEventsById = { ...stateEventsById, [id]: events };

      return { ...state, stateEventsById: newStateEventsById };
    }

    case 'PRICE_EVENTS_FETCHED': {
      const { id, events } = payload;
      const { priceEventsById } = state;

      const newPriceEventsById = { ...priceEventsById, [id]: events };

      return { ...state, priceEventsById: newPriceEventsById };
    }

    case 'TRANSFER_EVENTS_FETCHED': {
      const { id, events } = payload;
      const { transferEventsById } = state;

      const newTransferEventsById = { ...transferEventsById, [id]: events };

      return { ...state, transferEventsById: newTransferEventsById };
    }

    // Transaction events ////////////////////////////////////////////////////////////////////////////////////
    // TODO: probably a good candidate for another reducer

    case 'PIXEL_PURCHASE_SUCCESS':
      return { ...state, purchaseTransaction: payload.transaction };

    case 'PIXEL_PURCHASE_ERROR':
      return { ...state, purchaseError: payload.error };

    default: return state;
  }
};
