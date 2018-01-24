pragma solidity ^0.4.18;

contract Pixel {
  uint public maxSupply = 1000000; // 1M;
  uint8 public numStates = 16;

  uint8[1000000] public states;
  address[1000000] public owners;
  uint[1000000] public prices;

  event StateChange(
      uint indexed _tokenId,
      uint8 _state
  );

  event PriceChange(
      uint indexed _tokenId,
      uint _price
  );

  event Transfer(
    uint indexed _tokenId,
    address indexed _from,
    address indexed _to
  );

  function setStates(uint[] _tokenIds, uint8[] _states) public {
    require(_tokenIds.length == _states.length);

    for (uint i = 0; i < _tokenIds.length; i++) {
      setState(_tokenIds[i], _states[i]);
    }
  }

  function setState(uint _tokenId, uint8 _state) public {
    require(_tokenId < maxSupply);
    require(_state < numStates);

    states[_tokenId] = _state;

    StateChange(_tokenId, _state);
  }
}
