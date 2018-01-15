import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import PixelCanvas from '../components/PixelCanvas';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

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

  renderSelected = () => {
    const { selected, dimensions } = this.props;

    return selected.map(([x, y]) => {
      const id = x + (y * dimensions[0]);

      return (
        <a key={id} style={{ marginRight: '5px' }} href="/#">
          {x}x{y}
        </a>
      );
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
      classes,
    } = this.props;

    const [hoverX, hoverY] = hover;

    const containerStyle = {
      position: 'relative',
      display: 'flex',
      height: '100vh',
    };

    // TODO: add/remove when canvas is hovered
    const pixelDisplay = (
      <Button raised color="contrast" className={classes.button} style={{ position: 'absolute' }}>
        {hoverX}.{hoverY}
      </Button>
    );

    // <button onClick={this.toggleShowGrid}>{showGrid ? 'Hide' : 'Show'} grid</button>
    // <button onClick={this.resetCanvas}>Reset</button>
    // <p style={{ margin: 0 }}>{selected.length} Pixels selected</p>

    return (
      <div style={containerStyle}>
        {hoverX === null ? null : pixelDisplay}
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
  classes: PropTypes.object.isRequired,
};

export default connect(state => ({ classes: state.classes, ...state.pixelcanvas }))(withStyles(styles)(Home));
