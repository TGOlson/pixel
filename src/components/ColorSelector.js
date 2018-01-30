import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'material-ui/Checkbox';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
// import SettingsIcon from 'material-ui-icons/Settings';


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


class ColorSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  toggle = open => () => this.setState({ open })

  render() {
    // const {
    //   selected,
    //   onChange,
    // } = this.props;

    const { open } = this.state;

    const buttonStyle = {
      margin: 'auto',
      minWidth: '27px',
      minHeight: '27px',
      padding: '3px',
    };

    const colorStyle = {
      width: '24px',
      height: '24px',
      backgroundColor: '#a54242ff',
      borderRadius: '2px',
    };

    return (
      <div>
        <span ref={(el) => { this.anchorEl = el; }}>
          <Button raised color="primary" style={buttonStyle} onClick={this.toggle(true)}>
            <span style={colorStyle} />
          </Button>
        </span>
        <Menu anchorEl={this.anchorEl} open={open} onClose={this.toggle(false)} >
          <MenuItem onClick={() => console.log('click')}>
            <ListItemText primary="Display grid when zoomed" />
          </MenuItem>
          <MenuItem onClick={() => console.log('click2')}>
            <ListItemText primary="Display pixel info on hover" />
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

ColorSelector.propTypes = {
  selected: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorSelector;
