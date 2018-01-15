import React from 'react';
import PropTypes from 'prop-types';
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import Navbar from '../containers/Navbar';

const theme = createMuiTheme();

const App = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <Reboot />
    <Navbar />
    {children}
  </MuiThemeProvider>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
