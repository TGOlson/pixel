import { getHexBytesReversed } from '../util/color';
import { DIMENSION } from '../util/constants';

const initialState = {
  hexValues: null,
  imageData: null,
  states: null,
  prices: null,
  lastUpdateReceived: null,
  owners: null,
  addresses: [],
  stateEventsById: {},
  priceEventsById: {},
  transferEventsById: {},
  initialPrice: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    // Initial state /////////////////////////////////////////////////////////////////////////////////////////

    case 'PIXEL_STATES_FETCHED': {
      const { states } = payload;
      const hexValues = new Uint32Array(states.byteLength);

      states.forEach((x, i) => {
        hexValues[i] = getHexBytesReversed(x);
      });

      const dataArray = new Uint8ClampedArray(hexValues.buffer);
      const imageData = new ImageData(dataArray, DIMENSION);

      return {
        ...state,
        states,
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
      hexValues[id] = getHexBytesReversed(pixelState);

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

    default: return state;
  }
};
