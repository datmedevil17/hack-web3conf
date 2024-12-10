// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// TCH Token Contract (For Teachers)
contract DAOToken is ERC20{
    constructor() ERC20("Teacher Token", "TCH") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply for the owner to distribute
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);  // Only the owner can mint new tokens
    }
}
