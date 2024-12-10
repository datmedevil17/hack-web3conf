// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// STD Token Contract (For Students)
contract STDToken is ERC20{
    constructor() ERC20("Student Token", "STD") {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply for the owner to distribute
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);  // Only the owner can mint new tokens
    }
}
