import React from 'react';
import { Link } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const titleStyle = {
  flex: 1,
  textDecoration: 'none',
};

const Navbar = () => (
  <div style={{ width: '100%', zIndex: 2 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography type="title" component={Link} to="/" color="inherit" style={titleStyle}>
          Pixel
        </Typography>
        <Button component={Link} to="/about" color="contrast">About</Button>
        <Button color="contrast">Login</Button>
      </Toolbar>
    </AppBar>
  </div>
);

export default Navbar;
