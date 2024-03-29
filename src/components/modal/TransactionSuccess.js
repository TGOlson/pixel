import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const TransactionSuccess = (props) => {
  const { onClose, transactionId } = props;

  // TODO: link to etherscan page

  return (
    <Dialog open onClose={onClose} >
      <DialogTitle style={{ width: '500px' }}>Transaction submitted</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your Pixel transaction was successfully broadcast to the Ethereum network!
        </DialogContentText>
        <DialogContentText style={{ marginTop: '8px', marginBottom: '8px' }}>
          Once the transaction is included in a block the changes will be reflected on the Pixel Canvas.
        </DialogContentText>
        <DialogContentText style={{ fontSize: '0.8rem' }}>
          Transaction id: {transactionId}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

TransactionSuccess.propTypes = {
  onClose: PropTypes.func.isRequired,
  transactionId: PropTypes.string.isRequired,
};

export default TransactionSuccess;
