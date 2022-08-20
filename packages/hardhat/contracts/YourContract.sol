pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {

  event SetPurpose(address sender, string purpose);

  string public purpose = "Building Unstoppable Apps!!!";

  constructor() {
    // what should we do on deploy?
  }

  function setPurpose(string memory newPurpose) public {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      emit SetPurpose(msg.sender, purpose);
  }

  struct CasperAddress {
//    uint256 high; // for optimized version 2
//    uint256 low; // for optimized version 2
    string addr;
  }

  struct Order {
    address eth;
    CasperAddress cspr;
    uint256 amount;
    bool reverse;
    uint8 status; // 0-pending, 1-paid, 2-canceled
    string ethTxId;
    string txid;
  }

//  Order[] private _orders;
  Order[] public _orders;

  function addOrder(address account, uint256 csprHigh, uint256 csprLow, string memory csprHex, uint256 amount, bool reverse, string memory txid) public {
    Order memory order;
    order.eth = account;
//    order.cspr.high = csprHigh; 
//    order.cspr.low = csprLow;
    order.cspr.addr = csprHex;
    order.amount = amount;
    order.reverse = reverse;
    order.status = 0;
    order.ethTxId = txid;
    _orders.push(order);
  }

  function getOrders() public view returns (Order[] memory) {
    uint count = _orders.length;
    Order[] memory orders = new Order[](count);
    for (uint i = 0; i < count; i++) {
      Order storage order = _orders[i];
      orders[i] = order;
    }
    return _orders;
  }

  function updateOrder(uint256 index, uint8 status, string memory txid) public {
    // only supervisor
    // only sender

    // only if status pending
    if (_orders[index].status == 0) {
      _orders[index].status = status;
      if (status == 1) {
        _orders[index].txid = txid;
      }
    }
  }
}
