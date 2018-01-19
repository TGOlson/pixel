import { zoomIdentity } from 'd3-zoom';
// import { LOCATION_CHANGE } from 'react-router-redux';


const randomInt = max =>
  Math.floor(Math.random() * Math.floor(max));

const randomPixels = (num) => {
  const data = [];
  let i;

  for (i = 0; i < num; i += 1) {
    data.push(randomInt(16));
  }

  return data;
};

const PIXEL_COLORS_RGBA = [
  [255, 255, 255, 255],
  [255, 255, 255, 255],
  [255, 255, 255, 255],
  [255, 255, 255, 255],
  [255, 200, 200, 255],
  [255, 200, 200, 255],
  [255, 200, 200, 255],
  [255, 200, 200, 255],
  [255, 150, 150, 255],
  [255, 150, 150, 255],
  [255, 150, 150, 255],
  [255, 150, 150, 255],
  [255, 100, 100, 255],
  [255, 100, 100, 255],
  [255, 100, 100, 255],
  [255, 100, 100, 255],
];

const pixelToRGBA = (pixel) => {
  const rgba = PIXEL_COLORS_RGBA[pixel];

  if (!rgba) throw new Error(`Unknown 4bit pixel number '${pixel}'`);

  return rgba;
};

// const rgbaToHex = ([r, g, b, a]) =>
//   `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`

const getImageData = (pixels, width, height) => {
  const data = new Uint8ClampedArray(width * height * 4);

  pixels.forEach((pixel, index) => {
    const [r, g, b, a] = pixelToRGBA(pixel);
    const x = index * 4;

    data[x + 0] = r;
    data[x + 1] = g;
    data[x + 2] = b;
    data[x + 3] = a;
  });

  return new ImageData(data, width); // eslint-disable-line no-undef
};

const DIM = 1000;
const initialState = {
  hover: [null, null],
  transform: zoomIdentity,
  showGrid: true,
  gridZoomLevel: 10,
  selected: [],
  settingsOpen: false,

  // constants, could/should fetch from server
  dimensions: [DIM, DIM],
  imageData: getImageData(randomPixels(DIM * DIM), DIM, DIM),
};

const pixelEquals = ([x1, y1], [x2, y2]) =>
  x1 === x2 && y1 === y2;

const round = (n, x) => Math.round(x * (10 ** n)) / (10 ** n);

const indexOfWith = (f, x, arr) =>
  arr.reduce((accum, y, index) => (f(x, y) ? index : accum), -1);

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'PIXEL_HOVER':
      return { ...state, hover: payload.pixel };

    case 'CANVAS_ZOOM':
      return { ...state, transform: payload.transform };

    // TODO: canvas needs to be notified
    // case 'RESET_CANVAS':
    //   return { ...state, transform: zoomIdentity };

    case 'CANVAS_ZOOM_END': {
      const { x, y, k } = state.transform;
      // TODO: these should be the current centered coordinates
      // /@40,100,1.5
      const xx = Math.round(x / k);
      const yy = Math.round(y / k);
      const kk = round(2, k);

      window.history.replaceState({}, 'foo', `/@${xx},${yy},${kk}`);

      return state;
    }

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
