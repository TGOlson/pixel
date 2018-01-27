import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
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

const actions = {
  onPixelHover: pixel => ({
    type: 'PIXEL_HOVER',
    payload: { pixel },
  }),

  onPixelSelect: pixel => ({
    type: 'PIXEL_SELECT',
    payload: { pixel },
  }),

  onClearSelections: pixel => ({
    type: 'CLEAR_SELECT',
    payload: { pixel },
  }),

  onCanvasZoom: transform => ({
    type: 'CANVAS_ZOOM',
    payload: { transform },
  }),

  onCanvasZoomEnd: () => ({
    type: 'CANVAS_ZOOM_END',
    payload: null,
  }),

  onShowGridChange: showGrid => ({
    type: 'SHOW_GRID',
    payload: { showGrid },
  }),

  openSettings: () => ({
    type: 'SETTINGS_MODAL',
    payload: { open: true },
  }),

  closeSettings: () => ({
    type: 'SETTINGS_MODAL',
    payload: { open: false },
  }),
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.actions = bindActionCreators(actions, props.dispatch);
  }

  renderSelected = () => {
    const { selected, dimensions } = this.props.canvas;

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
    const { theme } = this.props;
    const { prices, owners, addresses } = this.props.pixel;

    const {
      hover: [hoverX, hoverY],
      dimensions: [x],
    } = this.props.canvas;

    if (hoverX === null) return null;

    const pixelDisplayStyle = {
      position: 'absolute',
      zIndex: 1,
      margin: '8px',
      padding: '8px 24px',
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      minWidth: '200px',
      textTransform: 'none',
    };

    // TODO: should be a util
    // TODO: should pixel refs like props.hover be the pixel id?
    const id = hoverX + (hoverY * x);
    const ownerAddress = addresses[owners[id]];
    const ownerMessage = ownerAddress ? `${ownerAddress.slice(0, 10)}...` : 'Unowned!';

    const initialPrice = '100000000000000'; // TODO: fetch from contract on load
    const price = prices[id] === undefined ? initialPrice : prices[id].toString();
    const priceFormatted = this.props.web3.fromWei(price, 'ether');

    return (
      <Paper style={pixelDisplayStyle} elevation={4} square>
        <Typography type="button">Pixel {hoverX} x {hoverY}</Typography>
        <Typography type="button">Price (ETH) {priceFormatted}</Typography>
        <Typography type="button">Owner {ownerMessage}</Typography>
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
      <Button fab mini onClick={this.actions.openSettings} color="contrast" style={settingsStyle}>
        <SettingsIcon />
      </Button>
    );
  }

  renderSelected = () => {
    const { selected } = this.props.canvas;

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
        <Button color="accent" dense onClick={this.actions.onClearSelections}>
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
      imageData,
      prices,
      owners,
      lastUpdateReceived,
    } = this.props.pixel;

    const {
      hover,
      selected,
      dimensions,
      transform,
      showGrid,
      gridZoomLevel,
      settingsOpen,
    } = this.props.canvas;

    const {
      closeSettings,
      onShowGridChange,
      onPixelHover,
      onPixelSelect,
      onCanvasZoom,
      onCanvasZoomEnd,
    } = this.actions;

    if (!imageData || !prices || !owners) {
      return <p>Loading...</p>;
    }

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
          onClose={closeSettings}
          showGrid={showGrid}
          onShowGridChange={onShowGridChange}
        />
        <PixelCanvas
          hover={hover}
          selected={selected}
          imageData={imageData}
          dimensions={dimensions}
          transform={transform}
          onPixelHover={onPixelHover}
          onPixelSelect={onPixelSelect}
          onZoom={onCanvasZoom}
          onZoomEnd={onCanvasZoomEnd}
          showGrid={showGrid}
          gridZoomLevel={gridZoomLevel}
          lastUpdateReceived={lastUpdateReceived}
        />
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types

  pixel: PropTypes.shape({
    imageData: PropTypes.instanceOf(ImageData),
    prices: PropTypes.instanceOf(Array),
    owners: PropTypes.instanceOf(Uint8ClampedArray),
    addresses: PropTypes.arrayOf(PropTypes.string),
    lastUpdateReceived: PropTypes.instanceOf(Date),
  }).isRequired,

  canvas: PropTypes.shape({
    hover: PropTypes.arrayOf(PropTypes.number).isRequired,
    selected: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    dimensions: PropTypes.arrayOf(PropTypes.number).isRequired,
    transform: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      k: PropTypes.number,
    }).isRequired,
    showGrid: PropTypes.bool.isRequired,
    gridZoomLevel: PropTypes.number.isRequired,
    settingsOpen: PropTypes.bool.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  web3: state.web3.instance,
  pixel: state.pixel,
  canvas: state.canvas,
});

export default connect(mapStateToProps)(withTheme()(Home));
