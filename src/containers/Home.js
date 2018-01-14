import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PixelCanvas from '../components/PixelCanvas';

class Home extends Component {
  onHover = (pixel) => {
    this.props.dispatch({
      type: 'PIXEL_HOVER',
      payload: { pixel },
    });
  }

  render() {
    const { pixelcanvas } = this.props;
    const [hoverX, hoverY] = pixelcanvas.hover;

    return (
      <div>
        <p>x: {hoverX}, y: {hoverY}</p>
        <PixelCanvas onHover={this.onHover} />
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  pixelcanvas: PropTypes.shape({
    hover: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};

export default connect(state => state)(Home);
