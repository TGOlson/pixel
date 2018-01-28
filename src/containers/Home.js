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
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { idToCoords } from '../util/pixel';

import { purchasePixels } from '../actions/pixel';

import PixelCanvas from '../components/PixelCanvas';
import TransactionError from '../components/TransactionError';
import TransactionSuccess from '../components/TransactionSuccess';
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
    type: 'SETTINGS_MODAL_OPEN',
  }),

  onModalClose: () => ({
    type: 'MODAL_DISMISS',
  }),

  purchase: purchasePixels,
};

class Home extends Component {
  static defaultProps = {
    web3: null,
  }

  constructor(props) {
    super(props);

    this.actions = bindActionCreators(actions, props.dispatch);
  }

  renderPixelDisplay() {
    const { theme } = this.props;
    const {
      prices,
      owners,
      addresses,
      initialPrice,
    } = this.props.pixel;

    const { hover } = this.props.canvas;

    if (hover === null) return null;

    const pixelDisplayStyle = {
      position: 'absolute',
      zIndex: 1,
      margin: '8px',
      padding: '8px',
      // backgroundColor: theme.palette.secondary.dark,
      // color: theme.palette.secondary.contrastText,
      width: '175px',
      // textTransform: 'none',
    };

    const formStyle = {
      margin: theme.spacing.unit,
    };

    const [hoverX, hoverY] = idToCoords(hover);
    const ownerAddress = addresses[owners[hover]];
    const ownerMessage = ownerAddress ? `${ownerAddress.slice(0, 15)}...` : 'Unowned';

    const price = prices[hover] === undefined ? initialPrice : prices[hover];
    const priceFormatted = this.props.web3.fromWei(price, 'ether').toString();

    return (
      <Paper style={pixelDisplayStyle} elevation={6}>
        <FormControl disabled style={formStyle}>
          <InputLabel htmlFor="name-disabled">Pixel</InputLabel>
          <Input id="name-disabled" value={`${hoverX} x ${hoverY}`} />
        </FormControl>
        <FormControl disabled style={formStyle}>
          <InputLabel htmlFor="name-disabled">Price (ETH)</InputLabel>
          <Input id="name-disabled" value={priceFormatted} />
        </FormControl>
        <FormControl disabled style={formStyle}>
          <InputLabel htmlFor="name-disabled">Owner address</InputLabel>
          <Input id="name-disabled" value={ownerMessage} />
        </FormControl>
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
      <Button fab mini onClick={this.actions.openSettings} color="primary" style={settingsStyle}>
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

    const purchase = () => this.actions.purchase(selected);

    const action = (
      <div>
        <Button color="primary" dense onClick={this.actions.onClearSelections}>
          Clear
        </Button>
        <Button color="primary" dense onClick={purchase}>
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
      purchaseTransaction,
      purchaseError,
    } = this.props.pixel;

    const {
      hover,
      selected,
      dimensions,
      transform,
      showGrid,
      gridZoomLevel,
    } = this.props.canvas;

    const {
      purchaseSuccessModalOpen,
      purchaseErrorModalOpen,
      settingsModalOpen,
    } = this.props.modal;

    const {
      onShowGridChange,
      onPixelHover,
      onPixelSelect,
      onCanvasZoom,
      onCanvasZoomEnd,
      onModalClose,
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
          open={settingsModalOpen}
          onClose={onModalClose}
          showGrid={showGrid}
          onShowGridChange={onShowGridChange}
        />
        <TransactionSuccess
          open={purchaseSuccessModalOpen}
          transactionId={purchaseTransaction}
          onClose={onModalClose}
        />
        <TransactionError
          open={purchaseErrorModalOpen}
          message={purchaseError}
          onClose={onModalClose}
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
  web3: PropTypes.object, // eslint-disable-line react/forbid-prop-types

  modal: PropTypes.shape({
    purchaseSuccessModalOpen: PropTypes.bool.isRequired,
    purchaseErrorModalOpen: PropTypes.bool.isRequired,
    settingsModalOpen: PropTypes.bool.isRequired,
  }).isRequired,

  pixel: PropTypes.shape({
    imageData: PropTypes.instanceOf(ImageData),
    prices: PropTypes.instanceOf(Array),
    owners: PropTypes.instanceOf(Uint8ClampedArray),
    addresses: PropTypes.arrayOf(PropTypes.string),
    lastUpdateReceived: PropTypes.instanceOf(Date),
    initialPrice: PropTypes.object,
    purchaseError: PropTypes.string,
    purchaseTransaction: PropTypes.string,
  }).isRequired,

  canvas: PropTypes.shape({
    hover: PropTypes.number,
    selected: PropTypes.arrayOf(PropTypes.number).isRequired,
    dimensions: PropTypes.arrayOf(PropTypes.number).isRequired,
    transform: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      k: PropTypes.number,
    }).isRequired,
    showGrid: PropTypes.bool.isRequired,
    gridZoomLevel: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  canvas: state.canvas,
  modal: state.modal,
  pixel: state.pixel,
  web3: state.web3.instance,
});

export default connect(mapStateToProps)(withTheme()(Home));
