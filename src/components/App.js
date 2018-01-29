import React from 'react';
import PropTypes from 'prop-types';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

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

const App = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <Reboot />
    <div style={appStyle}>
      <Navbar />
      {children}
    </div>
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
