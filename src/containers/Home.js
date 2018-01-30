import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import { purchasePixels } from '../actions/pixel';

import PixelCanvas from '../components/PixelCanvas';
import PixelInfo from '../components/PixelInfo';
import TransactionError from '../components/TransactionError';
import TransactionSuccess from '../components/TransactionSuccess';

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

  calcHoveredPixel = () => {
    const { mode, selectedColor } = this.props.navbar;
    const { hover } = this.props.canvas;
    const {
      owners,
      addresses,
    } = this.props.pixel;

    const { address } = this.props.user;
    const toHexColor = x => `#${x.toString(16)}`;

    // If no hover... then no hover
    if (hover === null) return [];

    // If in purchase mode, always same
    if (mode === 'Purchase') return [[hover, '#ffffff4c']];

    // If in color mode and current user doesn't own pixel, no hover
    if (addresses[owners[hover]] !== address) return [];

    // Hover current color
    return [[hover, toHexColor(selectedColor)]];
  }

  calcModifiedPixels = () => {
    const {
      hover,
      selected,
    } = this.props.canvas;

    const hovered = this.calcHoveredPixel();

    const modifiedSelected = selected.map(id =>
      [id, id === hover ? '#4486f4b2' : '#4486f4ff']);

    return [...hovered, ...modifiedSelected];
  }

  renderPixelDisplay() {
    const {
      pixel,
      web3,
      navbar: { showPixelInfo, mode },
      canvas: { hover },
    } = this.props;

    const {
      prices,
      owners,
      addresses,
      initialPrice,
    } = pixel;

    if (hover === null || !showPixelInfo || mode === 'Color') return null;

    return (
      <PixelInfo
        pixel={hover}
        prices={prices}
        owners={owners}
        addresses={addresses}
        initialPrice={initialPrice}
        web3={web3}
      />
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
      dimensions,
      transform,
      showGrid,
      gridZoomLevel,
    } = this.props.canvas;

    const {
      purchaseSuccessModalOpen,
      purchaseErrorModalOpen,
    } = this.props.modal;

    const {
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
    const selectedDisplay = this.renderSelected();
    const modifiedPixels = this.calcModifiedPixels();

    return (
      <div style={containerStyle}>
        {selectedDisplay}
        {pixelDisplay}
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
          modifiedPixels={modifiedPixels}
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
  web3: PropTypes.object, // eslint-disable-line react/forbid-prop-types

  modal: PropTypes.shape({
    purchaseSuccessModalOpen: PropTypes.bool.isRequired,
    purchaseErrorModalOpen: PropTypes.bool.isRequired,
  }).isRequired,

  navbar: PropTypes.shape({
    showPixelInfo: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
    selectedColor: PropTypes.number.isRequired,
  }).isRequired,

  user: PropTypes.shape({
    address: PropTypes.string,
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
  navbar: state.navbar,
  user: state.user,
});

export default connect(mapStateToProps)(Home);
