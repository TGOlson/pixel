import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import Typography from 'material-ui/Typography';

import Grid from 'material-ui/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import ColorSquare from '../components/ColorSquare';

import { PIXEL_COLORS_HEX } from '../util/constants';
import { coordsToId } from '../util/pixel';

import { getSetStateEvents, getPriceChangeEvents, getTransferEvents } from '../actions/pixel';


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

  renderColorDisplay() {
    const { id, coords: [x, y] } = this.state;
    const { states } = this.props.pixel;
    const color = PIXEL_COLORS_HEX[states[id]];

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
  }

  renderEventDisplay({ type, args }) {
    const web3 = this.props.web3.instance;

    switch (type) {
      case 'SetState':
        return (
          <div style={{ position: 'relative' }}>
            Color set to
            <span style={{ position: 'absolute', top: '-5px', marginLeft: '8px' }}>
              <ColorSquare dimension={25} color={PIXEL_COLORS_HEX[args.state]} />
            </span>
          </div>
        );
      case 'PriceChange':
        return `Price changed to ${web3.fromWei(args.state, 'ether').toString()} ETH`;
      case 'Transfer':
        return (
          <span>
          Purchased by <Link href="/#" to={`/account/${args.state}`}>{args.state}</Link>
          </span>
        );

      default: throw new Error(`Unexpected event type: ${type}`);
    }
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
    ].sort((a, b) => {
      if (a.blockNumber > b.blockNumber) return -1;
      if (a.blockNumber < b.blockNumber) return 1;

      if (a.transactionIndex > b.transactionIndex) return -1;
      if (a.transactionIndex < b.transactionIndex) return 1;

      if (a.type === 'Transfer') return -1;
      if (a.type === 'PriceChange') return 0;
      if (a.type === 'SetState') return 1;

      return 0;
    });

    const rows = events.map(ev => (
      <TableRow key={`${ev.blockNumber}_${ev.transactionIndex}_${ev.type}`}>
        <TableCell>{ev.blockNumber}</TableCell>
        <TableCell>{this.renderEventDisplay(ev)}</TableCell>
      </TableRow>
    ));

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Block number</TableCell>
            <TableCell>Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    );
  }

  render() {
    if (this.state.id === null) return <p>Not found!</p>;

    if (!this.isLoaded()) return <p>Loading!</p>;

    const events = this.renderEvents();
    const colorDisplay = this.renderColorDisplay();

    return (
      <Grid style={{ margin: '40px 24px' }}>
        {colorDisplay}
        <Typography type="display3" style={{ marginTop: '40px' }}>Events</Typography>
        {events}
      </Grid>
    );
  }
}

PixelDetails.propTypes = {
  dispatch: PropTypes.func.isRequired,

  web3: PropTypes.shape({
    instance: PropTypes.object,
  }).isRequired,

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
