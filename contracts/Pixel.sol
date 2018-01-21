pragma solidity ^0.4.18;

contract Pixel {
  uint public val;

  function setVal(uint _val) public {
    val = _val;
  }
}
