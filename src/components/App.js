import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../containers/Navbar';

const App = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
