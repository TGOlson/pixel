import React, { Component } from 'react';
import PropTypes from 'prop-types';


// canvas raw pixels stored in reducer
//
// PixelCanvas is the viewport
// in memory canvas stored in component
// emits change events
// starts internal requestAnimationFrameLoop
// may re-render depending on store state + internal state
//
//


class PixelCanvas extends Component {
  componentDidMount() {
    this.initCanvas();
  }

  shouldComponentUpdate() {
    return false;
  }

  initCanvas() {
    // console.log('canvas!');

    this.canvas.addEventListener('mousemove', (e) => {
      // console.log(e);
      this.props.onHover([e.offsetX, e.offsetY]);
    });

    // console.log(this.canvas);

    const context = this.canvas.getContext('2d');
    context.fillStyle = 'green';
    context.fillRect(0, 0, 600, 600);
  }

  render() {
    const ref = (canvas) => { this.canvas = canvas; };

    return (
      <canvas ref={ref} width={600} height={600} />
    );
  }
}


PixelCanvas.propTypes = {
  onHover: PropTypes.func.isRequired,
};

export default PixelCanvas;
