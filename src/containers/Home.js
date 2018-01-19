import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withTheme } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import SettingsIcon from 'material-ui-icons/Settings';

import PixelCanvas from '../components/PixelCanvas';
import Settings from '../components/Settings';

class Home extends Component {
  onPixelHover = pixel =>
    this.props.dispatch({
      type: 'PIXEL_HOVER',
      payload: { pixel },
    });

  onPixelSelect = pixel =>
    this.props.dispatch({
      type: 'PIXEL_SELECT',
      payload: { pixel },
    });

  onClearSelections = pixel =>
    this.props.dispatch({
      type: 'CLEAR_SELECT',
      payload: { pixel },
    });

  onCanvasZoom = transform =>
    this.props.dispatch({
      type: 'CANVAS_ZOOM',
      payload: { transform },
    });

  onCanvasZoomEnd = () =>
    this.props.dispatch({
      type: 'CANVAS_ZOOM_END',
      payload: null,
    });

  onShowGridChange = showGrid =>
    this.props.dispatch({
      type: 'SHOW_GRID',
      payload: { showGrid },
    });

  openSettings = () =>
    this.props.dispatch({
      type: 'SETTINGS_MODAL',
      payload: { open: true },
    });

  closeSettings = () =>
    this.props.dispatch({
      type: 'SETTINGS_MODAL',
      payload: { open: false },
    });


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

  renderPixelDisplay() {
    const {
      hover: [hoverX, hoverY],
      dimensions: [x],
      prices,
      theme,
    } = this.props;

    if (hoverX === null) return null;

    const pixelDisplayStyle = {
      position: 'absolute',
      zIndex: 1,
      margin: '8px',
      padding: '8px 24px',
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      minWidth: '140px',
      textTransform: 'none',
    };

    // TODO: should be a util
    const id = hoverX + (hoverY * x);

    return (
      <Paper style={pixelDisplayStyle} elevation={4} square>
        <Typography type="button">
          {hoverX} x {hoverY}
        </Typography>
        <Typography type="button">
          ETH {prices[id]}
        </Typography>
      </Paper>
    );
  }

  renderSettings = () => {
    const settingsStyle = {
      position: 'absolute',
      zIndex: 1,
      right: 0,
      bottom: 0,
      margin: '8px',
    };

    return (
      <Button fab mini onClick={this.openSettings} color="contrast" style={settingsStyle}>
        <SettingsIcon />
      </Button>
    );
  }

  renderSelected = () => {
    const { selected } = this.props;

    const open = selected.length !== 0;

    const selectedStyle = {
      position: 'absolute',
      margin: '8px',
      top: 0,
      right: 0,
      zIndex: 1,
    };

    const action = (
      <div>
        <Button color="accent" dense onClick={this.onClearSelections}>
          Clear
        </Button>
        <Button color="accent" dense>
          Purchase
        </Button>
      </div>
    );

    const n = selected.length;
    const message = `${n} Pixel${n === 1 ? '' : 's'} selected!`;

    return (
      <Snackbar
        style={selectedStyle}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        message={message}
        action={action}
        SnackbarContentProps={{ style: { flexGrow: 0 } }}
      />
    );
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
      settingsOpen,
    } = this.props;

    const containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      position: 'relative',
    };

    const pixelDisplay = this.renderPixelDisplay();
    const settings = this.renderSettings();
    const selectedDisplay = this.renderSelected();

    return (
      <div style={containerStyle}>
        {selectedDisplay}
        {pixelDisplay}
        {settings}
        <Settings
          open={settingsOpen}
          onClose={this.closeSettings}
          showGrid={showGrid}
          onShowGridChange={this.onShowGridChange}
        />
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
  /* eslint-disable react/forbid-prop-types */
  // prop type validation is too slow for large arrays
  prices: PropTypes.array.isRequired,
  /* eslint-enable  */
  dimensions: PropTypes.arrayOf(PropTypes.number).isRequired,
  transform: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    k: PropTypes.number,
  }).isRequired,
  showGrid: PropTypes.bool.isRequired,
  gridZoomLevel: PropTypes.number.isRequired,
  settingsOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => state.pixelcanvas;

export default connect(mapStateToProps)(withTheme()(Home));
