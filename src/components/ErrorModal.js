import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const getContent = (type, data) => {
  switch (type) {
    case 'UNAUTHORIZED_PIXEL_EDIT':
      return [
        'You don\'t own this Pixel!',
        'You can only edit a Pixel that you already own. Try purchasing this pixel first, or editing another pixel.',
      ];

    case 'UNSUPPORTED_NETWORK':
      return [
        'Attempting to connection to and unsupported network.',
        `Network name '${data.name}', network id: ${data.networkId}`,
      ];

    default: throw new Error(`Unexpected error modal type: ${type}`);
  }
};

const ErrorModal = (props) => {
  const { type, data, onClose } = props;

  const [title, content] = getContent(type, data);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle style={{ width: '500px' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Dismiss</Button>
      </DialogActions>
    </Dialog>
  );
};

ErrorModal.defaultProps = {
  data: null,
};

ErrorModal.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
