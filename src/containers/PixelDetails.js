import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';

import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import ColorSquare from '../components/ColorSquare';

import { PIXEL_COLORS_HEX } from '../util/constants';
import { coordsToId } from '../util/pixel';

import { getSetStateEvents, getPriceChangeEvents, getTransferEvents } from '../actions/pixel';

const ColorDisplay = ({ x, y, color }) => {
  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  const coordsStyle = {
    color: '#fafafa',
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: '16px',
  };

  return (
    <div style={containerStyle}>
      <ColorSquare dimension={350} color={color} />
      <Typography type="display3" style={coordsStyle}>{x} x {y}</Typography>
    </div>
  );
};

ColorDisplay.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

class PixelDetails extends Component {
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
    // const items = events.map((ev) => {
    //   const key = `${ev.blockNumber}_${ev.transactionIndex}_${ev.type}`;
    //
    //   return <li key={key}>Type {ev.type} Block {ev.blockNumber}. State {ev.args.state}.</li>;
    // });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Block number</TableCell>
            <TableCell>Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(ev => (
            <TableRow key={`${ev.blockNumber}_${ev.transactionIndex}_${ev.type}`}>
              <TableCell>{ev.blockNumber}</TableCell>
              <TableCell>Type {ev.type} Block {ev.blockNumber}. State {ev.args.state}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  render() {
    const { id, coords } = this.state;
    const { states } = this.props.pixel;

    if (id === null) return <p>Not found!</p>;

    if (!this.isLoaded()) return <p>Loading!</p>;

    const [x, y] = coords;

    const events = this.renderEvents();
    const color = PIXEL_COLORS_HEX[states[id]];

    return (
      <Grid style={{ margin: '40px 24px' }}>
        <ColorDisplay x={x} y={y} color={color} />
        <Typography type="display3" style={{ marginTop: '40px' }}>Events</Typography>
        {events}
      </Grid>
    );
  }
}

PixelDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,

  pixel: PropTypes.shape({
    states: PropTypes.instanceOf(Uint8ClampedArray),
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

export default connect(mapStateToProps)(PixelDetails);
