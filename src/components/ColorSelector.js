import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Menu from 'material-ui/Menu';
import Button from 'material-ui/Button';

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

class ColorSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  select = x => () => {
    this.props.onChange(x);
    this.toggle(false)();
  }

  toggle = open => () => this.setState({ open })

  render() {
    const {
      selected,
      options,
    } = this.props;

    const { open } = this.state;

    const menuListStyle = {
      paddingLeft: '8px',
      paddingRight: '8px',
      maxWidth: '464px',
    };

    const optionButtonStyle = {
      padding: '8px',
      minWidth: '27px',
      minHeight: '27px',
    };

    const optionElements = options.map((x, i) => (
      <Button key={x} style={optionButtonStyle} onClick={this.select(i)}>
        <ColorSquare dimension={40} color={x} />
      </Button>
    ));

    return (
      <div>
        <span ref={(el) => { this.anchorEl = el; }}>
          <Button color="default" onClick={this.toggle(true)}>
            <span style={{ marginRight: '8px' }}>Hue</span>
            <ColorSquare dimension={24} color={options[selected]} />
          </Button>
        </span>
        <Menu
          anchorEl={this.anchorEl}
          open={open}
          onClose={this.toggle(false)}
          style={{ marginTop: '56px' }}
          MenuListProps={{ style: menuListStyle }}
        >
          {optionElements}
        </Menu>
      </div>
    );
  }
}

ColorSelector.propTypes = {
  selected: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ColorSelector;
