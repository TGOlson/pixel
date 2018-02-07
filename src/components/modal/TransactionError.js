import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


class TransactionError extends Component {
  static defaultProps = { message: 'unknown error' }

  constructor(props) {
    super(props);

    this.state = { showDebug: false };
  }

  toggleShowDebug = () => {
    this.setState({ showDebug: !this.state.showDebug });
  }

  renderDebugInfo() {
    const { message } = this.props;

    const style = {
      marginTop: '8px',
      maxHeight: '200px',
      overflowY: 'scroll',
      overflowWrap: 'break-word',
    };

    return (
      <div style={{ marginTop: '8px' }}>
        <Divider />
        <Typography type="caption" style={style}>{message}</Typography>
        <Divider />
      </div>
    );
  }

  render() {
    const { onClose } = this.props;
    const { showDebug } = this.state;

    const debugLabel = showDebug ? 'Hide debug info' : 'Show debug info';
    const debugInfo = showDebug ? this.renderDebugInfo() : null;

    return (
      <Dialog open onClose={onClose}>
        <DialogTitle style={{ width: '500px' }}>Error submitting transaction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Oh no! Your transaction was not able to be submitted to the Ethereum network.
          </DialogContentText>
          <DialogContentText style={{ marginTop: '8px', marginBottom: '16px' }}>
            Try refreshing the app and submitting the transaction again. If errors persist,
            try increasing the gas price, or reading some of the FAQs.
          </DialogContentText>
          <Typography type="caption" style={{ cursor: 'pointer' }} onClick={this.toggleShowDebug}>
            {debugLabel}
          </Typography>
          {debugInfo}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Ok</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

TransactionError.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default TransactionError;
