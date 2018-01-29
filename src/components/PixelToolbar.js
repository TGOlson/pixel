import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FilterListIcon from 'material-ui-icons/FilterList';
import SettingsIcon from 'material-ui-icons/Settings';
import Tabs, { Tab } from 'material-ui/Tabs';

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
        <IconButton color="inherit" style={itemStyle}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    );
  }
}

PixelToolbar.propTypes = {
  mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
  onModeChange: PropTypes.func.isRequired,
};


export default PixelToolbar;
