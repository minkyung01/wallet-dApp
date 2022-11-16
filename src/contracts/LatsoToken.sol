// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LatsoToken is ERC20 {
    uint public INITIAL_SUPPLY = 10000;
    uint private constant DECIMAL = 1e18;

    constructor() ERC20("LatsoToken", "LT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    event buyLTevent(address _buyer, uint _amount);

    function buyLT(uint _value) external payable {
        uint amount = _value * DECIMAL;
        _mint(msg.sender, amount);

        emit buyLTevent(msg.sender, amount);
    }
}