import React from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FilterListIcon from 'material-ui-icons/FilterList';
import Tabs, { Tab } from 'material-ui/Tabs';

import { PIXEL_COLORS_HEX } from '../util/constants';
import ColorSelector from './ColorSelector';
import SettingsMenu from './SettingsMenu';

const PixelToolbar = (props) => {
  const {
    mode,
    showGrid,
    onShowGridChange,
    showPixelInfo,
    onShowPixelInfoChange,
    onColorSelectChange,
    selectedColor,
  } = props;

  const onModeChange = (event, newMode) =>
    props.onModeChange(newMode);

  const toolbarStyle = {
    // marginLeft: '24px',
    // marginRight: '24px',
    marginTop: '-8px',
  };

  const itemStyle = {
    margin: 'auto',
  };

  const filterItems = (
    <IconButton color="inherit" style={itemStyle}>
      <FilterListIcon />
    </IconButton>
  );

  const colorSelector = (
    <span style={itemStyle}>
      <ColorSelector
        selected={selectedColor}
        options={PIXEL_COLORS_HEX}
        onChange={onColorSelectChange}
      />
    </span>
  );

  const actions = mode === 'Color' ? colorSelector : filterItems;

  return (
    <Toolbar style={toolbarStyle}>
      {actions}
      <Tabs
        style={itemStyle}
        value={mode}
        onChange={onModeChange}
        indicatorColor="accent"
        textColor="inherit"
        fullWidth
      >
        <Tab label="Color" value="Color" />
        <Tab label="Marketplace" value="Purchase" />
      </Tabs>
      <span style={itemStyle}>
        <SettingsMenu
          showGrid={showGrid}
          onShowGridChange={onShowGridChange}
          showPixelInfo={showPixelInfo}
          onShowPixelInfoChange={onShowPixelInfoChange}
        />
      </span>
    </Toolbar>
  );
};

PixelToolbar.propTypes = {
  mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
  onModeChange: PropTypes.func.isRequired,
  showGrid: PropTypes.bool.isRequired,
  onShowGridChange: PropTypes.func.isRequired,
  showPixelInfo: PropTypes.bool.isRequired,
  onShowPixelInfoChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.number.isRequired,
  onColorSelectChange: PropTypes.func.isRequired,
};


export default PixelToolbar;
