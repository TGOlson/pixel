import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';


const menuIconStyle = {
  marginLeft: -12,
  marginRight: 20,
};

const titleStyle = {
  flex: 1,
  textDecoration: 'none',
};

const LinkToProfile = (address) => {
  const link = `/profile/${address}`;

  return <Button component={Link} to={link} color="inherit">Profile</Button>;
};


const Navbar = ({ address }) => {
  const action = address
    ? LinkToProfile(address)
    : <Button color="inherit">Login</Button>;

  return (
    <div style={{ width: '100%', zIndex: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton style={menuIconStyle} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography type="title" component={Link} to="/" color="inherit" style={titleStyle}>
            Pixel
          </Typography>
          {action}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.defaultProps = {
  address: null,
};

Navbar.propTypes = {
  address: PropTypes.string,
};

const mapStateToProps = state => ({ ...state, address: state.user.address });

export default connect(mapStateToProps)(Navbar);
