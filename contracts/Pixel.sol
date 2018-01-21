pragma solidity ^0.4.18;

contract Pixel {
  uint public val;

  uint public maxSupply = 1000000; // 1M;
  uint8 public numStates = 16;

  uint8[1000000] public pixelStates;

  event SetState(
      uint8 _fromState,
      uint8 _toState,
      uint indexed _tokenId
  );

  function setStates(uint[] _tokenIds, uint8[] _states) public {
    require(_tokenIds.length == _states.length);

    for (uint i = 0; i < _tokenIds.length; i++) {
      setPixelState(_tokenIds[i], _states[i]);
    }
  }

  function setPixelState(uint _tokenId, uint8 _state) public {
    require(_tokenId < maxSupply);
    require(_state < numStates);

    uint8 previousState = pixelStates[_tokenId];
    pixelStates[_tokenId] = _state;

    SetState(previousState, _state, _tokenId);
  }

  function setVal(uint _val) public {
    val = _val;
  }
}
