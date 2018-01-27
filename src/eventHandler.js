// TODO: generic event handler
// pixelContract.StateChange().watch((error, event) => {
//   if (error) {
//     console.error('pixel contract error', error);
//   } else {
//     const { _tokenId, _state } = event.args;
//     const id = parseInt(_tokenId, 10);
//     const state = parseInt(_state, 10);
//
//     // console.log(fromState, toState, tokenId);
//
//     // TODO: put updates that come before the canvas is loaded in a queue
//     // run the updates after the canvas is ready
//     if (!store.getState().pixel.hexValues) {
//       console.log('Skipping pixel state change');
//       return;
//     }
//
//     // TODO: this could be batched to avoid bursts of updates
//     store.dispatch({
//       type: 'PIXEL_STATE_CHANGE',
//       payload: { id, state },
//     });
//   }
// });
