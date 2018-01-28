import { zoomIdentity } from 'd3-zoom';

import { DIMENSION } from '../util/constants';

const initialState = {
  hover: null,
  transform: zoomIdentity,
  showGrid: true,
  gridZoomLevel: 10,
  selected: [],
  settingsOpen: false,

  // constants, could/should fetch from server
  dimensions: [DIMENSION, DIMENSION],
};


export default (state = initialState, { type, payload }) => {
  switch (type) {
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

      const index = selected.indexOf(payload.pixel);

      const newSelected = index >= 0
        ? [...selected.slice(0, index), ...selected.slice(index + 1)]
        : [...selected, payload.pixel];

      return { ...state, selected: newSelected };
    }

    case 'CLEAR_SELECT':
      return { ...state, selected: [] };

    case 'PIXEL_PURCHASE_SUCCESS':
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

    default: return state;
  }
};
