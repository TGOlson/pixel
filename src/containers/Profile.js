import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';

import { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AnnouncementIcon from 'material-ui-icons/Announcement';

import ColorSquare from '../components/ColorSquare';

import { idToCoords } from '../util/pixel';
import { PIXEL_COLORS_HEX } from '../util/constants';

const PixelItem = ({ id, state }) => {
  const [x, y] = idToCoords(id);
  const color = PIXEL_COLORS_HEX[state];

  const pixelLink = `/pixel/${x}x${y}`;
  const marketplaceLink = `/@${x},${y},60`;

  const linkStyle = { textDecoration: 'none' };

  const coords = (
    <Typography type="subheading" component={Link} to={pixelLink} style={linkStyle}>
      {`${x} x ${y}`}
    </Typography>
  );

  // TODO: does this need a way to force the canvas into marketplace mode?
  const marketplace = (
    <Typography type="caption" component={Link} to={marketplaceLink} style={linkStyle}>
      View in marketplace
    </Typography>
  );

  return (
    <ListItem>
      <ColorSquare dimension={40} color={color} />
      <ListItemText primary={coords} secondary={marketplace} />
    </ListItem>
  );
};

PixelItem.propTypes = {
  id: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
};

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

  const pixels = pixelIds.length === 0
    ? (
      <ListItem>
        <Avatar><AnnouncementIcon /></Avatar>
        <ListItemText primary="This address does not own any pixels!" />
      </ListItem>
    )
    : pixelIds.map(id => <PixelItem key={id} id={id} state={states[id]} />);

  const pixelCountStyle = {
    textAlign: 'right',
    margin: '8px 0',
  };

  const pixelCount = `${pixelIds.length} Pixel${pixelIds.length === 1 ? '' : 's'}`;

  return (
    <Grid style={{ margin: '40px 24px' }}>
      <Typography type="title">Address</Typography>
      <Typography type="subheading">{address}</Typography>
      <Typography type="display3" style={{ marginTop: '40px' }}>Pixels</Typography>
      <Divider />
      <Typography type="subheading" color="secondary" style={pixelCountStyle}>{pixelCount}</Typography>
      <Grid container>
        {pixels}
      </Grid>
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
