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

const SettingsMenu = (anchorEl, onClose) => (
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={onClose}
  >
    <MenuItem onClick={(e, v) => console.log(e, v)}>
      <Checkbox
        checked={true}
        disableRipple
        style={{ color: '#5efc82' }}
      />
      <ListItemText inset primary="Display grid when zoomed" />
    </MenuItem>
    <MenuItem onClick={(e, v) => console.log(e, v)}>
      <Checkbox
        checked={true}
        disableRipple
        style={{ color: '#5efc82' }}
      />
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

  render() {
    const toolbarStyle = {
      marginLeft: '24px',
      marginRight: '24px',
      marginTop: '-8px',
    };

    const itemStyle = {
      margin: 'auto',
    };

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
        <IconButton color="inherit" style={itemStyle} onClick={e => this.setState({ el: e.currentTarget })}>
          <SettingsIcon />
        </IconButton>
        {SettingsMenu(this.state.el, () => this.setState({ el: null }))}
      </Toolbar>
    );
  }
}

PixelToolbar.propTypes = {
  mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
  onModeChange: PropTypes.func.isRequired,
};


export default PixelToolbar;
