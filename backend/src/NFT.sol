//SDPX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // mint 7 NFT to deployer
        _mint(msg.sender, 0);
        _mint(msg.sender, 1);
        _mint(msg.sender, 2);
        _mint(msg.sender, 3);
        _mint(msg.sender, 4);
        _mint(msg.sender, 5);
        _mint(msg.sender, 7);
    }
    
}