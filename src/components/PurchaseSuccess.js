import React from 'react';
import PropTypes from 'prop-types';

// import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const PurchaseSuccess = (props) => {
  const { onClose, transactionId } = props;

  const open = transactionId !== null;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" style={{ width: '500px' }}>Success!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Pixel purchase transaction successfully submitted.
        </DialogContentText>
        <DialogContentText id="alert-dialog-description">
          Transaction id {transactionId}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

PurchaseSuccess.defaultProps = {
  transactionId: null,
};

PurchaseSuccess.propTypes = {
  // open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  transactionId: PropTypes.string,
};

export default PurchaseSuccess;
