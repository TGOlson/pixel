import React from 'react';
import PropTypes from 'prop-types';

import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const UnsupportedNetworkModal = (props) => {
  const { id, name } = props;

  // TODO: metamask help text at bottom of modal
  return (
    <Dialog open>
      <DialogTitle style={{ width: '500px' }}>Unsupported Ethereum Network</DialogTitle>
      <DialogContent>
        <DialogContentText>Network Id - {id}</DialogContentText>
        <DialogContentText>Network name - {name}</DialogContentText>
        <DialogContentText style={{ marginTop: '8px', marginBottom: '8px' }}>
          You are attempting to connect using an unsupported Ethereum network.
          Please connect to another network and refresh the page.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

UnsupportedNetworkModal.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default UnsupportedNetworkModal;
