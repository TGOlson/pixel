const bigNumToInt = x => parseInt(x.toString(), 10);

const baseProps = ({ blockNumber, transactionIndex }) => ({ blockNumber, transactionIndex });

export const tokenId = ({ args }) => bigNumToInt(args._tokenId);

export const formatSetStateEvent = event => ({
  type: 'SetState',
  ...baseProps(event),
  data: { state: bigNumToInt(event.args._state) },
});

export const formatPriceChangeEvent = event => ({
  type: 'PriceChange',
  ...baseProps(event),
  data: { price: event.args._price },
});

export const formatTransferEvent = event => ({
  type: 'Transfer',
  ...baseProps(event),
  data: { to: event.args._to },
});
