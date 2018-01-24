pragma solidity ^0.4.18;

// TODO: store base token info as a struct to optimize storage costs
/* struct Token {
    uint8 state;
    address owner;
    uint price;
}

Token[1000000] public tokens; */

// Token token = tokens[_tokenId];
// uint _price = token.price;
// token.owner = msg.sender;
// token.price = _price * 2;

contract Pixel {
  uint public maxSupply = 1000000; // 1M;
  uint8 public numStates = 16;

  // .0001 ether, at contract deploy time, roughly $0.1
  uint public initialPrice = 1 ether / 10000;

  uint8[1000000] public states;
  address[1000000] public owners;
  uint[1000000] public prices;

  // TODO: pendingWithdrawals
  /* mapping (address => uint) pendingWithdrawals; */

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
    address indexed _to
  );

  // internal, assumes tokenId has already been validated
  function tokenPrice(uint _tokenId) internal view returns (uint) {
    return owners[_tokenId] == address(0) ? initialPrice : prices[_tokenId];
  }

  // costs ~225k gas per 5 tokens
  function purchaseMany(uint[] _tokenIds) public payable {
    uint _totalPrice = 0;

    for (uint i = 0; i < _tokenIds.length; i++) {
      _totalPrice += tokenPrice(_tokenIds[i]);
    }

    require(msg.value >= _totalPrice);

    for (uint j = 0; j < _tokenIds.length; j++) {
      purchase(_tokenIds[j]);
    }
  }

  function purchase(uint _tokenId) public payable {
    require(_tokenId < maxSupply);

    uint _price = tokenPrice(_tokenId);

    require(msg.value >= _price);

    owners[_tokenId] = msg.sender;

    // default next price to 2x previous price
    // TODO: allow purchases to include desired next price
    uint _newPrice = _price * 2;
    prices[_tokenId] = _newPrice;

    // TODO: update pending withdrawals

    Transfer(_tokenId, msg.sender);
    PriceChange(_tokenId, _newPrice);
  }

  function setStates(uint[] _tokenIds, uint8[] _states) public {
    require(_tokenIds.length == _states.length);

    for (uint i = 0; i < _tokenIds.length; i++) {
      setState(_tokenIds[i], _states[i]);
    }
  }

  function setState(uint _tokenId, uint8 _state) public {
    require(_tokenId < maxSupply);
    require(_state < numStates);
    require(msg.sender == owners[_tokenId]);

    states[_tokenId] = _state;

    StateChange(_tokenId, _state);
  }
}
