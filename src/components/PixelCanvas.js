import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { event, select } from 'd3-selection';
import { zoom } from 'd3-zoom';

class PixelCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewportDim: [800, 600], // TODO: size to window or something
    };
  }

  componentDidMount() {
    this.initOffscreenCanvas();
    this.initImageCanvas();
    this.initInteractiveCanvas();
    this.renderCanvases();
  }

  componentDidUpdate(prevProps) {
    this.renderCanvases(prevProps);
  }

  // Note: this can only be called with a d3 event handler
  getCurrentPixel = () => {
    const {
      dimensions: [imageX, imageY],
      transform: { x, y, k },
    } = this.props;

    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    const pixelX = Math.floor((event.offsetX - x) / k) - offsetX;
    const pixelY = Math.floor((event.offsetY - y) / k) - offsetY;

    if (pixelX < 0 || pixelX >= imageX || pixelY < 0 || pixelY >= imageY) {
      return [null, null];
    }

    return [pixelX, pixelY];
  }

  isHoverChange = ({ hover: [nextX, nextY] }) => {
    const [prevX, prevY] = this.props.hover;

    return nextX !== prevX ||
           nextY !== prevY;
  }

  isTransformChange = ({ transform }) => {
    const prevTransform = this.props;

    return transform.x !== prevTransform.x ||
           transform.y !== prevTransform.y ||
           transform.k !== prevTransform.k;
  }

  initOffscreenCanvas = () => {
    const [x, y] = this.props.dimensions;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = x;
    this.offscreenCanvas.height = y;

    this.offscreenContext = this.offscreenCanvas.getContext('2d');
  }

  initImageCanvas = () => {
    const canvas = select(this.imageCanvas);

    // reset zoom to any previous value
    canvas.call(zoom().transform, this.props.transform);

    const [dimX, dimY] = this.state.viewportDim;
    this.imageContext = canvas.node().getContext('2d');

    this.imageContext.fillStyle = 'white';
    this.imageContext.fillRect(0, 0, dimX, dimY);

    this.imageContext.imageSmoothingEnabled = false;
    this.imageContext.mozImageSmoothingEnabled = false;
    this.imageContext.webkitImageSmoothingEnabled = false;
    this.imageContext.msImageSmoothingEnabled = false;
  }

  initInteractiveCanvas = () => {
    const {
      onZoom,
      onZoomEnd,
      onPixelHover,
      onPixelSelect,
      hover,
    } = this.props;

    const canvas = select(this.interactiveCanvas);

    // reset zoom to any previous value
    canvas.call(zoom().transform, this.props.transform);

    canvas.call(zoom()
      .scaleExtent([1, 60])
      .on('zoom', () => onZoom(event.transform))
      .on('end', onZoomEnd));

    canvas.on('mousemove', () => {
      const pixel = this.getCurrentPixel();

      const isHoverChange =
        pixel[0] !== hover[0] ||
        pixel[1] !== hover[1];

      return isHoverChange ? onPixelHover(pixel) : null;
    });

    canvas.on('click', () => onPixelSelect(this.getCurrentPixel()));

    this.interactiveContext = canvas.node().getContext('2d');
    this.interactiveContext.imageSmoothingEnabled = false;
    this.interactiveContext.mozImageSmoothingEnabled = false;
    this.interactiveContext.webkitImageSmoothingEnabled = false;
    this.interactiveContext.msImageSmoothingEnabled = false;
  }

  renderCanvases = (prevProps) => {
    // TODO: debounce to last?
    window.requestAnimationFrame(() => {
      // Note: only re-render the image canvas on transform changes
      // otherwise the changes only impact the interactive canvas
      // and re-rendering would be unnecessary overhead
      if (!prevProps || this.isTransformChange(prevProps)) {
        this.renderImageCanvas();
      }

      // Note: always re-ender the interactive canvas
      // it's very low cost, and any prop change should trigger
      // some sort of change on this canvas as well
      this.renderInteractiveCanvas();
    });
  }

  renderImageCanvas = () => {
    const {
      dimensions: [imageX, imageY],
      transform: { x, y, k },
      imageData,
    } = this.props;

    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    // update offscreen canvas
    // TODO: this won't work once async updates are coming in
    // May need to update the offscreen canvas continually
    this.offscreenContext.putImageData(imageData, 0, 0);

    // update viewport
    this.imageContext.save();

    this.imageContext.clearRect(0, 0, viewX, viewY);

    this.imageContext.translate(x, y);
    this.imageContext.scale(k, k);

    this.imageContext.drawImage(this.offscreenCanvas, offsetX, offsetY);
    this.imageContext.restore();
  }

  renderInteractiveCanvas = () => {
    const {
      hover: [hoverX, hoverY],
      selected,
      transform: { x, y, k },
      dimensions: [imageX, imageY],
      showGrid,
      gridZoomLevel,
    } = this.props;

    const context = this.interactiveContext;
    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    // clear previous state
    context.clearRect(0, 0, viewX, viewY);


    // translate and render hover/selected
    context.save();

    context.translate(x, y);
    context.scale(k, k);

    // render hovered pixels
    context.fillStyle = 'blue';
    context.globalAlpha = '0.4';
    context.fillRect(hoverX + offsetX, hoverY + offsetY, 1, 1);

    // render selected pixels
    context.fillStyle = 'blue';
    context.globalAlpha = '1.0';

    selected.forEach(([selectedX, selectedY]) => {
      context.fillRect(selectedX + offsetX, selectedY + offsetY, 1, 1);
    });

    context.restore();

    // render grid, if necessary
    if (showGrid && k >= gridZoomLevel) {
      context.fillStyle = 'white';

      // increase linearly from k=10 to k=20
      // when k>20 stay contast with 2px grid lines
      const gridWidth = Math.min(2, 1 + ((k - 10) / 10));

      // TODO: drawing from offsetX to viewX is probably overkill in a lot of cases
      // it is drawing a grid on the entire viewport
      // in some cases the image may not fill the entire view port
      for (let diffX = x % k; diffX < viewX; diffX += k) {
        context.fillRect(diffX - 1, 0, gridWidth, viewY);
      }

      for (let diffY = y % k; diffY < viewY; diffY += k) {
        context.fillRect(0, diffY - 1, viewX, gridWidth);
      }
    }
  }

  render() {
    const [dimX, dimY] = this.state.viewportDim;

    const containerStyle = {
      position: 'relative',
      width: dimX,
      height: dimY,
      border: '1px solid grey',
    };

    const imageCanvasStyle = {
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 0,
    };

    const interactiveCanvasStyle = {
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: 1,
    };

    return (
      <div style={containerStyle}>
        <canvas
          ref={(canvas) => { this.imageCanvas = canvas; }}
          style={imageCanvasStyle}
          width={dimX}
          height={dimY}
        />
        <canvas
          ref={(canvas) => { this.interactiveCanvas = canvas; }}
          style={interactiveCanvasStyle}
          width={dimX}
          height={dimY}
        />
      </div>
    );
  }
}


PixelCanvas.propTypes = {
  hover: PropTypes.arrayOf(PropTypes.number).isRequired,
  selected: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onPixelHover: PropTypes.func.isRequired,
  onPixelSelect: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
  onZoomEnd: PropTypes.func.isRequired,
  imageData: PropTypes.instanceOf(ImageData).isRequired,
  dimensions: PropTypes.arrayOf(PropTypes.number).isRequired,
  transform: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    k: PropTypes.number,
  }).isRequired,
  showGrid: PropTypes.bool.isRequired,
  gridZoomLevel: PropTypes.number.isRequired,
};

export default PixelCanvas;
