import {
  formatSetStateEvent,
  formatTransferEvent,
  formatPriceChangeEvent,
  tokenId,
} from './util/events';

export default (dispatch, event) => {
  switch (event.event) {
    case 'Transfer': {
      const id = tokenId(event);
      const ev = formatTransferEvent(event);

      dispatch({
        type: 'PIXEL_TRANSFER',
        payload: { id, to: ev.data.to },
      });

      break;
    }
    case 'PriceChange': {
      const id = tokenId(event);
      const ev = formatPriceChangeEvent(event);

      dispatch({
        type: 'PIXEL_PRICE_CHANGE',
        payload: { id, price: ev.data.price },
      });

      break;
    }
    case 'StateChange': {
      const id = tokenId(event);
      const ev = formatSetStateEvent(event);

      dispatch({
        type: 'PIXEL_STATE_CHANGE',
        payload: { id, state: ev.data.state },
      });

      break;
    }
    default: {
      console.error('Unknown event type', event); // eslint-disable-line no-console
      break;
    }
  }
};
