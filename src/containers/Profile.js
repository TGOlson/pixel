import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';

import ColorSquare from '../components/ColorSquare';

import { idToCoords } from '../util/pixel';
import { PIXEL_COLORS_HEX } from '../util/constants';

const Profile = (props) => {
  const {
    addresses,
    states,
    owners,
    params: { address },
    web3,
  } = props;

  if (!owners || !states) return <p>Loading</p>;
  if (!web3.isAddress(address)) return <p>404 not found!</p>;

  const ownerIndex = addresses.indexOf(address);

  // TODO: this is a bit heavy. May want to cache this for subsequent renders/page loads
  const pixelIds = owners.reduce((acc, owner, id) => (owner === ownerIndex ? [...acc, id] : acc), []);

  const getColor = id => PIXEL_COLORS_HEX[states[id]];
  const getCoords = (id) => {
    const [x, y] = idToCoords(id);
    const to = `/pixel/${x}x${y}`;

    return (
      <Typography type="subheading" component={Link} to={to} style={{ textDecoration: 'none' }}>
        {`${x} x ${y}`}
      </Typography>
    );
  };

  const link = (id) => {
    const [x, y] = idToCoords(id);
    const to = `/@${x},${y},60`;
    return (
      <Typography type="caption" component={Link} to={to} style={{ textDecoration: 'none' }}>
        View in marketplace
      </Typography>
    );
  };

  const pixels = pixelIds.length === 0
    ? null
    : pixelIds.map(id => (
      <ListItem key={id}>
        <ColorSquare dimension={40} color={getColor(id)} />
        <ListItemText primary={getCoords(id)} secondary={link(id)} />
      </ListItem>
    ));

  const pixelCountStyle = {
    textAlign: 'right',
    marginTop: '8px',
  };

  return (
    <Grid style={{ margin: '40px 24px' }}>
      <Typography type="title">Address</Typography>
      <Typography type="subheading">{address}</Typography>
      <Typography type="display3" style={{ marginTop: '40px' }}>Pixels</Typography>
      <Divider />
      <Typography type="subheading" style={pixelCountStyle}>{pixelIds.length} Pixels</Typography>
      <List>{pixels}</List>
    </Grid>
  );
};

Profile.defaultProps = {
  states: null,
  owners: null,
  web3: null,
};

Profile.propTypes = {
  params: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  web3: PropTypes.object, // eslint-disable-line react/forbid-prop-types

  states: PropTypes.instanceOf(Uint8ClampedArray),
  owners: PropTypes.instanceOf(Uint8ClampedArray),
  addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  web3: state.web3.instance,
  owners: state.pixel.owners,
  addresses: state.pixel.addresses,
  states: state.pixel.states,
});

export default connect(mapStateToProps)(withRouter(Profile));
