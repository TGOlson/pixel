import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';

import { purchase, setStates } from '../actions/pixel';
import * as CanvasActions from '../actions/canvas';

import PixelCanvas from '../components/PixelCanvas';
import PixelInfo from '../components/PixelInfo';
import TransactionError from '../components/TransactionError';
import TransactionSuccess from '../components/TransactionSuccess';

import { getHex } from '../util/color';

const actions = {
  ...CanvasActions,

  onModalClose: () => ({
    type: 'MODAL_DISMISS',
  }),

  purchase,
  setStates,
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

    // If no hover... then no hover
    if (hover === null) return [];

    // If in purchase mode, always same
    if (mode === 'Purchase') return [[hover, '#ffffff4c']];

    // If in color mode and current user doesn't own pixel, no hover
    if (addresses[owners[hover]] !== address) return [];

    // Hover current color
    return [[hover, getHex(selectedColor)]];
  }

  calcSelectedPixels = () => {
    const { mode } = this.props.navbar;
    const {
      colored,
      selected,
    } = this.props.canvas;

    return mode === 'Purchase'
      ? selected.map(id => [id, '#4486f4ff'])
      : colored.map(([id, x]) => [id, getHex(x)]);
  }

  calcModifiedPixels = () => {
    const hovered = this.calcHoveredPixel();
    const selected = this.calcSelectedPixels();

    return [...selected, ...hovered];
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
    const { mode } = this.props.navbar;
    const { selected, colored } = this.props.canvas;


    const selectedStyle = {
      position: 'absolute',
      margin: '8px',
      top: 0,
      right: 0,
      zIndex: 1,
    };

    // TODO: swap action depending on mode
    const onAction = mode === 'Color'
      ? () => this.actions.setStates(colored)
      : () => this.actions.purchase(selected);

    const open = mode === 'Color'
      ? colored.length !== 0
      : selected.length !== 0;

    const actionText = mode === 'Color'
      ? 'Submit'
      : 'Purchase';

    const message = mode === 'Color'
      ? `${colored.length} Pixel${colored.length === 1 ? '' : 's'} colored!`
      : `${selected.length} Pixel${selected.length === 1 ? '' : 's'} selected!`;


    const onClear = mode === 'Color'
      ? this.actions.onClearColored
      : this.actions.onClearSelected;

    const action = (
      <div>
        <Button color="primary" dense onClick={onClear}>
          Clear
        </Button>
        <Button color="primary" dense onClick={onAction}>
          {actionText}
        </Button>
      </div>
    );

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
    colored: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
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
