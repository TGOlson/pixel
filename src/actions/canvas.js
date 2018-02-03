import { transformToPath } from '../util/url';


export const onPixelHover = pixel => ({
  type: 'PIXEL_HOVER',
  payload: { pixel },
});

// Note: normally these state based switches are better handled at the component/props level
// however, this is a function that gets passed into the PixelCanvas component
// which contains a lot of internal state, and generally ignores prop updates
export const onPixelSelect = pixel => (dispatch, getState) => {
  const { mode, selectedColor } = getState().navbar;

  if (mode === 'Color') {
    dispatch({
      type: 'PIXEL_COLOR',
      payload: { pixel, color: selectedColor },
    });
  } else {
    dispatch({
      type: 'PIXEL_SELECT',
      payload: { pixel },
    });
  }
};

export const onPixelPurchase = pixel => ({
  type: 'PIXEL_SELECT',
  payload: { pixel },
});

export const onClearSelections = pixel => ({
  type: 'CLEAR_SELECT',
  payload: { pixel },
});

export const onCanvasZoom = transform => ({
  type: 'CANVAS_ZOOM',
  payload: { transform },
});

export const onCanvasZoomEnd = () => (dispatch, getState) => {
  const { transform } = getState().canvas;

  const path = transformToPath(transform);
  window.history.replaceState({}, 'pixel', path);

  dispatch({
    type: 'CANVAS_ZOOM_END',
    payload: null,
  });
};

export default onCanvasZoomEnd;
