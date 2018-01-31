import { transformToPath } from '../util/url';

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
