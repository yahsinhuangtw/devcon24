// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, ERC721Enumerable, Ownable {
    // State Variables
    uint256 public _nextTokenId; //Tracks the ID of the next token to be minted. It is publicly accessible, allowing anyone to see how many tokens have been minted so far.
    uint256 public maxSupply = 10; //Sets a limit on the total number of tokens that can be minted by this contract. In this case, it is set to 10.
    mapping(address => bool) public alreadyMinted; //If an address has minted a token, the corresponding value in the mapping is set to true. If it has not, the default value is false.
    
    constructor(address initialOwner) ERC721("NFT", "EDA") Ownable(initialOwner) {}

    function safeMint(address to) public {
        require(_nextTokenId < maxSupply, "Max supply reached");
        require(!alreadyMinted[to], "Already minted"); // Ensure the address hasn't minted before
        alreadyMinted[to] = true; // Mark as minted
        uint256 tokenId = _nextTokenId++; // uint256 tokenId = _nextTokenId; // _nextTokenId++;
        _safeMint(to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
