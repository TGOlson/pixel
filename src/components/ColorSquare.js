import React from 'react';
import PropTypes from 'prop-types';

const ColorSquare = ({ dimension, color }) => (
  <span style={{
    width: `${dimension}px`,
    height: `${dimension}px`,
    backgroundColor: color,
    borderRadius: '2px',
  }}
  />
);

ColorSquare.propTypes = {
  dimension: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default ColorSquare;
