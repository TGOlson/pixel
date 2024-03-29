import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';


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


class SettingsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  toggle = open => () => this.setState({ open })

  render() {
    const {
      showGrid,
      onShowGridChange,
      showPixelInfo,
      onShowPixelInfoChange,
    } = this.props;

    const { open } = this.state;

    return (
      <div>
        <span ref={(el) => { this.anchorEl = el; }}>
          <IconButton color="inherit" onClick={this.toggle(true)}>
            <SettingsIcon />
          </IconButton>
        </span>
        <Menu anchorEl={this.anchorEl} open={open} onClose={this.toggle(false)} >
          <MenuItem onClick={() => onShowGridChange(!showGrid)}>
            <SettingsCheckbox checked={showGrid} />
            <ListItemText primary="Display grid when zoomed" />
          </MenuItem>
          <MenuItem onClick={() => onShowPixelInfoChange(!showPixelInfo)}>
            <SettingsCheckbox checked={showPixelInfo} />
            <ListItemText primary="Display pixel info on hover" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

SettingsMenu.propTypes = {
  showGrid: PropTypes.bool.isRequired,
  onShowGridChange: PropTypes.func.isRequired,
  showPixelInfo: PropTypes.bool.isRequired,
  onShowPixelInfoChange: PropTypes.func.isRequired,
};

export default SettingsMenu;
