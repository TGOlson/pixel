import React, { Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';

import { coordsToId } from '../util/pixel';

import { getSetStateEvents, getPriceChangeEvents, getTransferEvents } from '../actions/pixel';

class Pixel extends Component {
  constructor(props) {
    super(props);

    const match = props.routeParams.id.match(/^(\d{1,3})x(\d{1,3})$/);
    const coords = match
      ? [parseInt(match[1], 10), parseInt(match[2], 10)]
      : null;

    const id = coords ? coordsToId(...coords) : null;

    this.state = { coords, id };
  }

  componentDidMount() {
    // console.log(this.state.coords, this.state.id);

    const { dispatch, loadPromise } = this.props;
    const { id } = this.state;

    loadPromise.initialLoad.then(() => {
      dispatch(getSetStateEvents(id));
      dispatch(getPriceChangeEvents(id));
      dispatch(getTransferEvents(id));
    });
  }

  isLoaded() {
    const { id } = this.state;

    const {
      stateEventsById,
      priceEventsById,
      transferEventsById,
    } = this.props.pixel;

    return stateEventsById[id] && priceEventsById[id] && transferEventsById[id];
  }

  renderEvents() {
    const { id } = this.state;

    const {
      stateEventsById,
      priceEventsById,
      transferEventsById,
    } = this.props.pixel;

    const events = [
      ...stateEventsById[id],
      ...priceEventsById[id],
      ...transferEventsById[id],
    ];

    // TODO: handle other event types
    const items = events.map((ev) => {
      const key = `${ev.blockNumber}_${ev.transactionIndex}_${ev.type}`;

      return <li key={key}>Type {ev.type} Block {ev.blockNumber}. State {ev.args.state}.</li>;
    });

    return (
      <ul>
        {items}
      </ul>
    );
  }

  render() {
    const { id, coords } = this.state;

    if (id === null) return <p>Not found!</p>;

    if (!this.isLoaded()) return <p>Loading!</p>;

    const [x, y] = coords;

    const events = this.renderEvents();

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
  dispatch: PropTypes.func.isRequired,

  pixel: PropTypes.shape({
    stateEventsById: PropTypes.object.isRequired,
    priceEventsById: PropTypes.object.isRequired,
    transferEventsById: PropTypes.object.isRequired,
  }).isRequired,

  loadPromise: PropTypes.shape({
    initialLoad: PropTypes.instanceOf(Promise).isRequired,
  }).isRequired,

  routeParams: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Pixel);
