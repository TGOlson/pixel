import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { event, select } from 'd3-selection';
import { zoom } from 'd3-zoom';

import { coordsToId, idToCoords } from '../util/pixel';

class PixelCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = { prevHover: null };

    // Note: don't use state here. Parts of the render cycle use lifecycle hooks
    // that aren't all compatible with setState.
    this.lastUpdateReceived = null;
  }

  componentDidMount() {
    this.initOffscreenCanvas();
    this.initImageCanvas();
    this.initInteractiveCanvas();
    this.renderCanvases();

    // window.addEventListener('resize', (e) => {
    //   console.log(e);
    //   const [dimX, dimY] = this.viewportDimensions();
    //
    //   this.renderCanvases();
    //
    //   this.imageCanvas.width = dimX;
    //   this.imageCanvas.height = dimY;
    //
    //   this.interactiveCanvas.width = dimX;
    //   this.interactiveCanvas.height = dimY;
    //
    //
    //   this.imageContext.imageSmoothingEnabled = false;
    //   this.imageContext.mozImageSmoothingEnabled = false;
    //   this.imageContext.webkitImageSmoothingEnabled = false;
    //   this.imageContext.msImageSmoothingEnabled = false;
    // });
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

    const [viewX, viewY] = this.viewportDimensions();

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    const pixelX = Math.floor((event.offsetX - x) / k) - offsetX;
    const pixelY = Math.floor((event.offsetY - y) / k) - offsetY;

    if (pixelX < 0 || pixelX >= imageX || pixelY < 0 || pixelY >= imageY) {
      return null;
    }

    return coordsToId(pixelX, pixelY);
  }

  isTransformChange = ({ transform }) => {
    const prevTransform = this.props.transform;

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
    const [dimX, dimY] = this.viewportDimensions();

    canvas.node().width = dimX;
    canvas.node().height = dimY;

    // reset zoom to any previous value
    canvas.call(zoom().transform, this.props.transform);

    const context = canvas.node().getContext('2d');
    this.imageContext = context;

    context.fillStyle = 'white';
    context.fillRect(0, 0, dimX, dimY);

    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;

    context.shadowColor = '#999';
    context.shadowBlur = 10;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
  }

  initInteractiveCanvas = () => {
    const {
      onZoom,
      onZoomEnd,
      onPixelHover,
      onPixelSelect,
    } = this.props;

    const canvas = select(this.interactiveCanvas);
    const [dimX, dimY] = this.viewportDimensions();

    canvas.node().width = dimX;
    canvas.node().height = dimY;

    // reset zoom to any previous value
    canvas.call(zoom().transform, this.props.transform);

    canvas.call(zoom()
      .scaleExtent([0.5, 60])
      .on('zoom', () => onZoom(event.transform))
      .on('end', onZoomEnd));

    canvas.on('mousemove', () => {
      const pixel = this.getCurrentPixel(true);

      if (pixel !== this.state.prevHover) {
        onPixelHover(pixel);
        this.setState({ prevHover: pixel });
      }
    });

    canvas.on('click', () => {
      const pixel = this.getCurrentPixel();

      if (pixel !== null) {
        onPixelSelect(pixel);
      }
    });

    this.interactiveContext = canvas.node().getContext('2d');
    this.interactiveContext.imageSmoothingEnabled = false;
    this.interactiveContext.mozImageSmoothingEnabled = false;
    this.interactiveContext.webkitImageSmoothingEnabled = false;
    this.interactiveContext.msImageSmoothingEnabled = false;
  }

  viewportDimensions = () => {
    const isEven = x => x % 2 === 0;

    // TODO: this is a pretty big hack. should move this to state
    // also, should handle window resize events
    const dimX = this.imageCanvas.offsetWidth;
    const dimY = this.imageCanvas.offsetHeight;

    return [
      isEven(dimX) ? dimX : dimX + 1,
      isEven(dimY) ? dimY : dimY + 1,
    ];
  };

  renderCanvases = (prevProps) => {
    // TODO: debounce to last?
    window.requestAnimationFrame(() => {
      // Note: only re-render the image canvas on transform changes
      // otherwise the changes only impact the interactive canvas
      // and re-rendering would be unnecessary overhead
      if (!prevProps
        || this.isTransformChange(prevProps)
        || this.lastUpdateReceived < this.props.lastUpdateReceived
      ) {
        console.log('rendering');

        this.renderImageCanvas();

        this.lastUpdateReceived = this.props.lastUpdateReceived;
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

    const [viewX, viewY] = this.viewportDimensions();

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
      modifiedPixels,
      transform: { x, y, k },
      dimensions: [imageX, imageY],
      showGrid,
      gridZoomLevel,
    } = this.props;

    const context = this.interactiveContext;
    const [viewX, viewY] = this.viewportDimensions();

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    // clear previous state
    context.clearRect(0, 0, viewX, viewY);

    // translate and render hover/selected
    context.save();

    context.translate(x, y);
    context.scale(k, k);

    // draw modified pixels
    modifiedPixels.forEach(([id, rgbaHex]) => {
      const [modifiedX, modifiedY] = idToCoords(id);

      const color = rgbaHex.slice(0, 7);
      const alpha = parseInt(rgbaHex.slice(7), 16) / 255;

      context.fillStyle = color;
      context.globalAlpha = alpha;

      context.fillRect(modifiedX + offsetX, modifiedY + offsetY, 1, 1);
    });

    context.globalAlpha = 1.0;
    context.restore();

    // render grid, if necessary
    if (showGrid && k >= gridZoomLevel) {
      context.fillStyle = 'white';

      const lineWidth = 1;

      const dX = (offsetX * k) + x;
      const dY = (offsetY * k) + y;
      const startX = Math.max(0, dX);
      const startY = Math.max(0, dY);

      const endX = Math.min(viewX, ((viewX - offsetX) * k) + x)
      const endY = Math.min(viewY, ((viewY - offsetY) * k) + y)

      for (let diffX = dX; diffX <= endX + 1; diffX += k) {
        context.fillRect(diffX, startY, lineWidth, endY);
      }


      for (let diffY = dY; diffY <= endY + 1; diffY += k) {
        context.fillRect(startX, diffY, endX, lineWidth);
      }
    }
  }

  render() {
    const containerStyle = {
      flex: 1,
      position: 'relative',
    };

    const imageCanvasStyle = {
      top: 0,
      left: 0,
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
    };

    const interactiveCanvasStyle = {
      ...imageCanvasStyle,
      zIndex: 0,
    };

    return (
      <div style={containerStyle}>
        <canvas
          ref={(canvas) => { this.imageCanvas = canvas; }}
          style={imageCanvasStyle}
        />
        <canvas
          ref={(canvas) => { this.interactiveCanvas = canvas; }}
          style={interactiveCanvasStyle}
        />
      </div>
    );
  }
}


PixelCanvas.propTypes = {
  modifiedPixels: PropTypes.arrayOf(PropTypes.array).isRequired,
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
  lastUpdateReceived: PropTypes.instanceOf(Date).isRequired,
};

export default PixelCanvas;
