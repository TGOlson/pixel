import { zoomIdentity } from 'd3-zoom';

import { DIMENSION } from '../util/constants';
import { getImageData } from '../util/image';


const initialState = {
  hover: [null, null],
  transform: zoomIdentity,
  showGrid: true,
  gridZoomLevel: 10,
  selected: [],
  settingsOpen: false,

  // constants, could/should fetch from server
  dimensions: [DIMENSION, DIMENSION],
  imageData: null,
  prices: null,
};

const pixelEquals = ([x1, y1], [x2, y2]) =>
  x1 === x2 && y1 === y2;

// const round = (n, x) => Math.round(x * (10 ** n)) / (10 ** n);

const indexOfWith = (f, x, arr) =>
  arr.reduce((accum, y, index) => (f(x, y) ? index : accum), -1);


export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PIXEL_STATES_FETCHED': {
      // TODO: probably inefficient to convert to uint8 array before again changing to another uin8 array
      // look into using some other typed array
      const states = new Uint8ClampedArray(payload.buffer);
      const imageData = getImageData(states, DIMENSION, DIMENSION);

      return { ...state, imageData };
    }

    case 'PIXEL_PRICES_FETCHED': {
      // TODO: consider what format these prices should be stored in
      const prices = new Uint16Array(payload.buffer);

      return { ...state, prices };
    }

    case 'PIXEL_HOVER':
      return { ...state, hover: payload.pixel };

    case 'CANVAS_ZOOM':
      return { ...state, transform: payload.transform };

    // TODO: canvas needs to be notified
    // case 'RESET_CANVAS':
    //   return { ...state, transform: zoomIdentity };

    // TODO: should display current centered pixel
    // case 'CANVAS_ZOOM_END': {
    //   const { x, y, k } = state.transform;
    //   // TODO: these should be the current centered coordinates
    //   // /@40,100,1.5
    //   const xx = Math.round(x / k);
    //   const yy = Math.round(y / k);
    //   const kk = round(2, k);
    //
    //   window.history.replaceState({}, 'foo', `/@${xx},${yy},${kk}`);
    //
    //   return state;
    // }

    case 'SHOW_GRID':
      return { ...state, showGrid: payload.showGrid };

    case 'PIXEL_SELECT': {
      const { selected } = state;

      const index = indexOfWith(pixelEquals, payload.pixel, selected);

      const newSelected = index >= 0
        ? [...selected.slice(0, index), ...selected.slice(index + 1)]
        : [...selected, payload.pixel];

      return { ...state, selected: newSelected };
    }

    case 'CLEAR_SELECT':
      return { ...state, selected: [] };

    // TODO: not correct, needs to parse centered pixel
    // case LOCATION_CHANGE: {
    //   const path = payload.pathname;
    //
    //   // debugger;
    //   if (path.indexOf('/@') >= 0) {
    //     const tail = path.slice(2);
    //     const tk = tail.split(',');
    //     console.log(tk);
    //     const transform = state.transform.translate(tk[0], tk[1]).scale(tk[2]);
    //
    //     return { ...state, transform };
    //     // return state;
    //   }
    //
    //   return state;
    // }

    case 'SETTINGS_MODAL':
      return { ...state, settingsOpen: payload.open };

    default: return state;
  }
};
