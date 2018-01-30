import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FilterListIcon from 'material-ui-icons/FilterList';
import SettingsIcon from 'material-ui-icons/Settings';
import Tabs, { Tab } from 'material-ui/Tabs';

import SettingsMenu from './SettingsMenu';

class PixelToolbar extends Component {
  render() {
    const {
      mode,
      settingsOpen,
      showGrid,
      onShowGridChange,
      showPixelInfo,
      onShowPixelInfoChange,
    } = this.props;

    const onModeChange = (event, newMode) =>
      this.props.onModeChange(newMode);

    const onSettingsOpen = () =>
      this.props.onSettingsToggle(true);

    const onSettingsClose = () =>
      this.props.onSettingsToggle(false);

    const toolbarStyle = {
      // marginLeft: '24px',
      // marginRight: '24px',
      marginTop: '-8px',
    };

    const itemStyle = {
      margin: 'auto',
    };

    const anchorEl = settingsOpen ? this.settingsMenuAnchorElement : null;

    return (
      <Toolbar style={toolbarStyle}>
        <IconButton color="inherit" style={itemStyle}>
          <FilterListIcon />
        </IconButton>
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
        <span style={itemStyle} ref={(el) => { this.settingsMenuAnchorElement = el; }}>
          <IconButton color="inherit" style={itemStyle} onClick={onSettingsOpen}>
            <SettingsIcon />
          </IconButton>
        </span>
        <SettingsMenu
          anchorEl={anchorEl}
          onClose={onSettingsClose}
          showGrid={showGrid}
          onShowGridChange={onShowGridChange}
          showPixelInfo={showPixelInfo}
          onShowPixelInfoChange={onShowPixelInfoChange}
        />
      </Toolbar>
    );
  }
}

PixelToolbar.propTypes = {
  mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
  onModeChange: PropTypes.func.isRequired,
  onSettingsToggle: PropTypes.func.isRequired,
  settingsOpen: PropTypes.bool.isRequired,
  showGrid: PropTypes.bool.isRequired,
  onShowGridChange: PropTypes.func.isRequired,
  showPixelInfo: PropTypes.bool.isRequired,
  onShowPixelInfoChange: PropTypes.func.isRequired,
};


export default PixelToolbar;
