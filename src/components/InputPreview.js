import React from 'react';
import PropTypes from 'prop-types';

const InputPreview = ({ value, onChange }) => (
  <div>
    <input type="text" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);

InputPreview.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputPreview;
