import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const Navbar = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography type="title" color="inherit" className={classes.flex}>Pixel</Typography>
        <Button color="contrast">About</Button>
        <Button color="contrast">Login</Button>
      </Toolbar>
    </AppBar>
  </div>
);
//   <div>
//     <h1 style={{ display: 'inline-block' }}>Pixel</h1>
//     <Link href="/#" to="/"><button>Home</button></Link>
//     <Link href="/#" to="/about"><button>About</button></Link>
//   </div>
// );

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navbar);
// export default connect(state => state)(Navbar);
