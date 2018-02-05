import React from 'react';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import PixelToolbar from '../components/PixelToolbar';

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

const isHomePage = path =>
  path === '/' || path.includes('/@');

const Navbar = (props) => {
  const {
    mode,
    address,
    dispatch,
    showGrid,
    showPixelInfo,
    selectedColor,
  } = props;

  const onModeChange = newMode => dispatch({
    type: 'NAVBAR_MODE_CHANGE',
    payload: { mode: newMode },
  });

  const onShowGridChange = show => dispatch({
    type: 'SHOW_GRID',
    payload: { showGrid: show },
  });

  const onShowPixelInfoChange = show => dispatch({
    type: 'SHOW_PIXEL_INFO',
    payload: { showPixelInfo: show },
  });

  const onColorSelectChange = color => dispatch({
    type: 'COLOR_SELECT_CHANGE',
    payload: { color },
  });

  const action = address
    ? LinkToProfile(address)
    : <Button color="inherit">Login</Button>;

  const toolbar = isHomePage(props.location.pathname)
    ? (
      <PixelToolbar
        mode={mode}
        onModeChange={onModeChange}
        showGrid={showGrid}
        onShowGridChange={onShowGridChange}
        showPixelInfo={showPixelInfo}
        onShowPixelInfoChange={onShowPixelInfoChange}
        selectedColor={selectedColor}
        onColorSelectChange={onColorSelectChange}
      />
    )
    : null;

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
        {toolbar}
      </AppBar>
    </div>
  );
};

Navbar.defaultProps = {
  address: null,
};

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  address: PropTypes.string,
  mode: PropTypes.oneOf(['Color', 'Purchase']).isRequired,
  showGrid: PropTypes.bool.isRequired,
  showPixelInfo: PropTypes.bool.isRequired,
  selectedColor: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  ...state,
  ...state.navbar,
  address: state.user.address,
  showGrid: state.canvas.showGrid,
});

export default connect(mapStateToProps)(withRouter(Navbar));
