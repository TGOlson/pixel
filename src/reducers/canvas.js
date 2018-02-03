import { zoomIdentity } from 'd3-zoom';

import { DIMENSION } from '../util/constants';
import { pathToTransform } from '../util/url';

const initialState = {
  hover: null,
  transform: zoomIdentity,
  showGrid: true,
  gridZoomLevel: 10,
  selected: [],
  colored: {},

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
    // it ignores some events
    // case 'RESET_CANVAS':
    //   return { ...state, transform: zoomIdentity };

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

    case 'PIXEL_COLOR': {
      const { colored } = state;
      const { pixel, color } = payload;

      return {
        ...state,
        colored: { ...colored, [pixel]: color },
      };
    }

    case 'CLEAR_SELECT':
      return { ...state, selected: [] };

    case 'PIXEL_PURCHASE_SUCCESS':
      return { ...state, selected: [] };

    // TODO: use router export
    case '@@router/LOCATION_CHANGE': {
      const path = payload.pathname;

      // TODO: figure out better way to test path before attempting to parse
      const maybeTransform = pathToTransform(path);

      if (maybeTransform) {
        const { x, y, k } = maybeTransform;
        const transform = state.transform.translate(x, y).scale(k);

        return { ...state, transform };
      }

      return state;
    }

    default: return state;
  }
};
