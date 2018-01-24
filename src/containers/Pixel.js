import React, { Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';

import { getSetStateEvents } from '../actions/pixel';

class Pixel extends Component {
  constructor(props) {
    super(props);

    const match = props.routeParams.id.match(/^(\d{1,3})x(\d{1,3})$/);
    const coords = match
      ? [parseInt(match[1], 10), parseInt(match[2], 10)]
      : null;

    const id = coords ? coords[0] + (coords[1] * 1000) : null;

    this.state = { coords, id };
  }

  componentDidMount() {
    console.log(this.state.coords, this.state.id);
    this.props.dispatch(getSetStateEvents(this.state.id));
  }

  renderEvents = (events) => {
    // TODO: handle other event types
    const items = events.map((ev, i) => (
      <li key={i}>Block {ev.blockNumber}. Set pixel state to {ev.args.state}.</li>
    ));

    return (
      <ul>
        {items}
      </ul>
    );
  }

  render() {
    const { id, coords } = this.state;

    if (id === null) return <p>Not found!</p>;

    const { stateEventsById } = this.props.pixel;

    if (!stateEventsById[id]) return <p>Loading!</p>;

    const [x, y] = coords;

    const events = this.renderEvents(stateEventsById[id]);

    return (
      <div style={{ width: '100%', zIndex: 2 }}>
        <Typography type="headline" color="inherit">
          Pixel {x}x{y}
        </Typography>
        <Typography type="title" color="inherit">
          Events
        </Typography>
        {events}
      </div>
    );
  }
}

Pixel.propTypes = {
  routeParams: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Pixel);
