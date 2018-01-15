import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PixelCanvas from '../components/PixelCanvas';

class Home extends Component {
  onPixelHover = (pixel) => {
    this.props.dispatch({
      type: 'PIXEL_HOVER',
      payload: { pixel },
    });
  }

  onPixelSelect = (pixel) => {
    this.props.dispatch({
      type: 'PIXEL_SELECT',
      payload: { pixel },
    });
  }

  onCanvasZoom = (transform) => {
    this.props.dispatch({
      type: 'CANVAS_ZOOM',
      payload: { transform },
    });
  }

  onCanvasZoomEnd = () => {
    this.props.dispatch({
      type: 'CANVAS_ZOOM_END',
      payload: null,
    });
  }

  resetCanvas = () => {
    throw new Error('cannot reset');
    // this.props.dispatch({
    //   type: 'RESET_CANVAS',
    //   payload: null,
    // });
  }

  toggleShowGrid = () => {
    this.props.dispatch({
      type: 'SHOW_GRID',
      payload: { showGrid: !this.props.showGrid },
    });
  }

  render() {
    const {
      hover,
      selected,
      imageData,
      dimensions,
      transform,
      showGrid,
      gridZoomLevel,
    } = this.props;

    const [hoverX, hoverY] = hover;

    return (
      <div>
        <button onClick={this.toggleShowGrid}>{showGrid ? 'Hide' : 'Show'} grid</button>
        <button onClick={this.resetCanvas}>Reset</button>
        <p style={{ margin: 0 }}>x: {hoverX}</p>
        <p style={{ margin: 0 }}>y: {hoverY}</p>
        <p style={{ margin: 0 }}>zoom: {transform.k}</p>
        <PixelCanvas
          hover={hover}
          selected={selected}
          imageData={imageData}
          dimensions={dimensions}
          transform={transform}
          onPixelHover={this.onPixelHover}
          onPixelSelect={this.onPixelSelect}
          onZoom={this.onCanvasZoom}
          onZoomEnd={this.onCanvasZoomEnd}
          showGrid={showGrid}
          gridZoomLevel={gridZoomLevel}
        />
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  hover: PropTypes.arrayOf(PropTypes.number).isRequired,
  selected: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
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

export default connect(state => state.pixelcanvas)(Home);
