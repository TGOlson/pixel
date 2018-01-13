import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import InputPreview from '../components/InputPreview';
import { setMessage } from '../actions/message';

class App extends Component {
  onChange = (value) => {
    this.props.dispatch(setMessage(value));
  }

  render() {
    const { message } = this.props.message;

    return (
      <div>
        <Link href="/#" to="/about"><button>Go to about</button></Link>
        <InputPreview value={message} onChange={this.onChange} />
        <p>{message}</p>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

export default connect(state => state)(App);
