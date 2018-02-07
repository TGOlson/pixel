import React from 'react';
import PropTypes from 'prop-types';

import SimpleErrorModal from './modal/SimpleErrorModal';
import TransactionSuccess from './modal/TransactionSuccess';
import TransactionError from './modal/TransactionError';


const AlertModal = ({ type, data, onClose }) => {
  switch (type) {
    case 'UNAUTHORIZED_PIXEL_EDIT':
      return (
        <SimpleErrorModal
          title="You don't own this Pixel!"
          message="You can only edit a Pixel that you already own. Try purchasing this pixel first, or editing another pixel."
          onClose={onClose}
        />
      );

    case 'PIXEL_PURCHASE_SUCCESS':
      return <TransactionSuccess transactionId={data.transaction} onClose={onClose} />;

    case 'PIXEL_SET_STATE_SUCCESS':
      return <TransactionSuccess transactionId={data.transaction} onClose={onClose} />;

    case 'PIXEL_PURCHASE_ERROR':
      return <TransactionError message={data.error} onClose={onClose} />;

    case 'PIXEL_SET_STATE_ERROR':
      return <TransactionError message={data.error} onClose={onClose} />;

    // TODO: metamask help text at bottom of modal
    // TODO: this modal might have to be handled differently
    // it should fully block loading of some pages
    case 'UNSUPPORTED_NETWORK':
      return (
        <SimpleErrorModal
          title="Unsupported Ethereum Network"
          message={[
            `Network Id - ${data.networkId}`,
            `Network name - ${data.networkName}`,
            'You are attempting to connect using an unsupported Ethereum network. Please connect to another network and refresh the page.',
          ]}
        />
      );

    default: throw new Error(`Unexpected modal type: ${type}`);
  }
};

AlertModal.defaultProps = {
  data: null,
};

AlertModal.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
