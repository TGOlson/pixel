import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';

import { idToCoords } from '../util/pixel';

const PixelInfo = (props) => {
  const {
    pixel,
    prices,
    owners,
    addresses,
    initialPrice,
    web3,
  } = props;

  const pixelDisplayStyle = {
    position: 'absolute',
    zIndex: 1,
    margin: '8px',
    padding: '8px',
    width: '175px',
  };

  const formStyle = {
    margin: '8px',
  };

  const [hoverX, hoverY] = idToCoords(pixel);
  const ownerAddress = addresses[owners[pixel]];
  const ownerMessage = ownerAddress ? `${ownerAddress.slice(0, 15)}...` : 'Not owned';

  const price = prices[pixel] === undefined ? initialPrice : prices[pixel];
  const priceFormatted = web3.fromWei(price, 'ether').toString();

  return (
    <Paper style={pixelDisplayStyle} elevation={6}>
      <FormControl disabled style={formStyle}>
        <InputLabel htmlFor="pixel-coords">Pixel</InputLabel>
        <Input id="pixel-coords" value={`${hoverX} x ${hoverY}`} />
      </FormControl>
      <FormControl disabled style={formStyle}>
        <InputLabel htmlFor="pixel-price">Price (ETH)</InputLabel>
        <Input id="pixel-price" value={priceFormatted} />
      </FormControl>
      <FormControl disabled style={formStyle}>
        <InputLabel htmlFor="pixel-owner">Owner address</InputLabel>
        <Input id="pixel-owner" value={ownerMessage} />
      </FormControl>
    </Paper>
  );
};

PixelInfo.propTypes = {
  web3: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  pixel: PropTypes.number.isRequired,
  prices: PropTypes.instanceOf(Array).isRequired,
  owners: PropTypes.instanceOf(Uint8ClampedArray).isRequired,
  addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  initialPrice: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PixelInfo;
