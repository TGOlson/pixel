import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import UnsupportedNetworkModal from '../components/UnsupportedNetworkModal';
import Navbar from '../containers/Navbar';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#fafafa',
      dark: '#c7c7c7',
      contrastText: '#000000',
    },
    secondary: {
      light: '#5efc82',
      main: '#00c853',
      dark: '#009624',
      contrastText: '#000000',
    },
  },
});

window.theme = theme;

const appStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
};

const App = (props) => {
  const { network, children } = props;

  // TODO: this is too high up!
  // Probably need to allow individual pages to make this decision
  const content = network.supported
    ? children
    : <UnsupportedNetworkModal id={network.networkId} name={network.networkName} />;

  return (
    <MuiThemeProvider theme={theme}>
      <Reboot />
      <div style={appStyle}>
        <Navbar />
        {content}
      </div>
    </MuiThemeProvider>
  );
};

App.propTypes = {
  network: PropTypes.shape({
    networkId: PropTypes.string,
    networkName: PropTypes.string,
    supported: PropTypes.bool,
  }).isRequired,

  children: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  network: state.network,
});

export default connect(mapStateToProps)(App);
