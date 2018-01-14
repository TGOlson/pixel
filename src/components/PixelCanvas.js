import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { event, select } from 'd3-selection';
import { zoom, zoomIdentity } from 'd3-zoom';

class PixelCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewportDim: [800, 600], // TODO: size to window or something
    };
  }

  componentDidMount() {
    this.initOffscreenCanvas();
    this.initViewportCanvas();
    this.renderViewport();
  }

  componentDidUpdate() {
    this.renderViewport();
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

  shouldRenderGrid = () => {
    const { showGrid, gridZoomLevel, transform } = this.props;

    return showGrid && transform.k >= gridZoomLevel;
  }

  initOffscreenCanvas = () => {
    const [x, y] = this.props.dimensions;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = x;
    this.offscreenCanvas.height = y;

    this.offscreenContext = this.offscreenCanvas.getContext('2d');
  }

  initViewportCanvas = () => {
    const { onZoom, onPixelHover, onPixelSelect } = this.props;

    const canvas = select(this.imageCanvas);

    // reset zoom to any previous value
    canvas.call(zoom().transform, this.props.transform);

    canvas.call(zoom()
      .scaleExtent([1, 60])
      .on('zoom', () => onZoom(event.transform)));

    canvas.on('mousemove', () => {
      const pixel = this.getCurrentPixel();

      if (this.isHoverChange({ hover: pixel })) {
        onPixelHover(pixel);
      }
    });

    canvas.on('click', () => {
      const pixel = this.getCurrentPixel();
      onPixelSelect(pixel);
    });

    const [dimX, dimY] = this.state.viewportDim;
    this.imageContext = canvas.node().getContext('2d');

    this.imageContext.fillStyle = 'white';
    this.imageContext.fillRect(0, 0, dimX, dimY);

    this.imageContext.imageSmoothingEnabled = false;
    this.imageContext.mozImageSmoothingEnabled = false;
    this.imageContext.webkitImageSmoothingEnabled = false;
    this.imageContext.msImageSmoothingEnabled = false;
  }

  renderViewport = () => {
    // TODO: consider adding back optimization checks
    // we don't always need to render everything on every prop change
    // if (this.isHoverChange(nextProps)) {
    // if (this.isTransformChange(nextProps)) {

    // TODO: debounce to last?
    window.requestAnimationFrame(() => {
      this.renderCanvas();
      this.renderSelected();

      // TODO: should hover be disabled until 2x zoom?
      this.renderHover();

      if (this.shouldRenderGrid()) {
        this.renderGrid();
      }
    });
  }

  renderCanvas = () => {
    const {
      dimensions: [imageX, imageY],
      transform: { x, y, k },
      imageData,
    } = this.props;

    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    // update offscreen canvas
    this.offscreenContext.putImageData(imageData, 0, 0);

    // update viewport
    this.imageContext.save();

    this.imageContext.clearRect(0, 0, viewX, viewY);

    this.imageContext.translate(x, y);
    this.imageContext.scale(k, k);

    this.imageContext.drawImage(this.offscreenCanvas, offsetX, offsetY);
    this.imageContext.restore();
  }

  renderGrid = () => {
    const { x, y, k } = this.props.transform;
    const [viewX, viewY] = this.state.viewportDim;

    this.imageContext.fillStyle = 'white';

    const gridWidth = k > 20 ? 2 : 1;

    // TODO: drawing from offsetX to viewX is probably overkill in a lot of cases
    // it is drawing a grid on the entire viewport
    // in some cases the image may not fill the entire view port
    for (let offsetX = x % k; offsetX < viewX; offsetX += k) {
      this.imageContext.fillRect(offsetX - 1, 0, gridWidth, viewY);
    }

    for (let offsetY = y % k; offsetY < viewY; offsetY += k) {
      this.imageContext.fillRect(0, offsetY - 1, viewX, gridWidth);
    }
  }

  renderSelected = () => {
    const {
      selected,
      transform: { x, y, k },
      dimensions: [imageX, imageY],
    } = this.props;

    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    this.imageContext.save();

    this.imageContext.translate(x, y);
    this.imageContext.scale(k, k);

    this.imageContext.fillStyle = 'blue';
    // this.imageContext.globalAlpha = '0.4';

    selected.forEach(([selectedX, selectedY]) => {
      this.imageContext.fillRect(selectedX + offsetX, selectedY + offsetY, 1, 1);
    });

    this.imageContext.restore();
  }

  renderHover = () => {
    const {
      hover: [hoverX, hoverY],
      transform: { x, y, k },
      dimensions: [imageX, imageY],
    } = this.props;

    const [viewX, viewY] = this.state.viewportDim;

    const offsetX = (viewX - imageX) / 2;
    const offsetY = (viewY - imageY) / 2;

    this.imageContext.save();

    this.imageContext.translate(x, y);
    this.imageContext.scale(k, k);

    this.imageContext.fillStyle = 'blue';
    this.imageContext.globalAlpha = '0.4';
    this.imageContext.fillRect(hoverX + offsetX, hoverY + offsetY, 1, 1);

    this.imageContext.restore();
  }

  render() {
    const [dimX, dimY] = this.state.viewportDim;

    return (
      <canvas
        ref={(canvas) => { this.imageCanvas = canvas; }}
        style={{ border: '1px solid grey' }}
        width={dimX}
        height={dimY}
      />
    );
  }
}


PixelCanvas.propTypes = {
  hover: PropTypes.arrayOf(PropTypes.number).isRequired,
  selected: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onPixelHover: PropTypes.func.isRequired,
  onPixelSelect: PropTypes.func.isRequired,
  onZoom: PropTypes.func.isRequired,
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
