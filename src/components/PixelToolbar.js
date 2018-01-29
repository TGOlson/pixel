import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import FilterListIcon from 'material-ui-icons/FilterList';
import SettingsIcon from 'material-ui-icons/Settings';
import Tabs, { Tab } from 'material-ui/Tabs';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';

const SettingsCheckbox = ({ checked }) => (
  <Checkbox
    checked={checked}
    disableRipple
    style={{ color: '#00c853' }}
  />
);

SettingsCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
};

// TODO: should be real component
const SettingsMenu = (
  open,
  anchorEl,
  onClose,
  showGrid,
  onShowGridChange,
  showPixelInfo,
  onShowPixelInfoChange,
) => (
  <Menu anchorEl={anchorEl} open={open} onClose={onClose} >
    <MenuItem onClick={() => onShowGridChange(!showGrid)}>
      <SettingsCheckbox checked={showGrid} />
      <ListItemText inset primary="Display grid when zoomed" />
    </MenuItem>
    <MenuItem onClick={() => onShowPixelInfoChange(!showPixelInfo)}>
      <SettingsCheckbox checked={showPixelInfo} />
      <ListItemText primary="Display pixel info on hover" />
    </MenuItem>
  </Menu>
);

class PixelToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = { mode: props.mode };
  }

  onModeChange = (event, mode) => {
    // TODO: using internal state here in an attempt to get the tab animations to work
    // however, this doesn't seem to help.
    // consider switching back to a pure component...
    if (mode !== this.state.mode) {
      this.setState({ mode });
      this.props.onModeChange(mode);
    }
  }

  onSettingsOpen = (event) => {
    this.props.onSettingsToggle(true);
    this.setState({ el: event.currentTarget });
  }

  onSettingsClose = () => {
    this.props.onSettingsToggle(false);
    this.setState({ el: null });
  }

  render() {
    const toolbarStyle = {
      // marginLeft: '24px',
      // marginRight: '24px',
      marginTop: '-8px',
    };

    const itemStyle = {
      margin: 'auto',
    };

    const {
      settingsOpen,
      showGrid,
      onShowGridChange,
      showPixelInfo,
      onShowPixelInfoChange,
    } = this.props;

    return (
      <Toolbar style={toolbarStyle}>
        <IconButton color="inherit" style={itemStyle}>
          <FilterListIcon />
        </IconButton>
        <Tabs
          style={itemStyle}
          value={this.state.mode}
          onChange={this.onModeChange}
          indicatorColor="accent"
          textColor="inherit"
          fullWidth
        >
          <Tab label="Color" value="Color" />
          <Tab label="Marketplace" value="Purchase" />
        </Tabs>
        <IconButton color="inherit" style={itemStyle} onClick={this.onSettingsOpen}>
          <SettingsIcon />
        </IconButton>
        {SettingsMenu(
          settingsOpen,
          this.state.el,
          this.onSettingsClose,
          showGrid,
          onShowGridChange,
          showPixelInfo,
          onShowPixelInfoChange,
        )}
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
