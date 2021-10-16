// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContract is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    uint256 public maxMintAmount = 10;
    Counters.Counter _tokenIds;
    
    mapping(uint256 => string) _tokenURIs;
    mapping (address => bool) public whitelisted;
    
    struct RenderUserToken {
        uint256 id;
        string uri;
    }
    
    constructor() ERC721("nAnimals", "NANI") {}
    
    // internal
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function concat(string memory strOne, string memory strTwo) private pure returns (string memory) {
        return string(abi.encodePacked(strOne, strTwo, ".json"));
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // public
    // function mint(uint256 _mintAmount) public payable returns(uint256) {
    function mint(uint256 _mintAmount) public payable {
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        string memory uri = "https://nanimals.mypinata.cloud/ipfs/QmW7w6sgyYNfxLUKSodbAqEmoaD8LYwdRcw8tmPFh69uTF/";
        for (uint256 i = 0; i < _mintAmount; i++) {
            uint256 newId = _tokenIds.current();
            string memory newUri = concat(uri, Strings.toString(newId+1));
            _mint(msg.sender, newId);
            _setTokenURI(newId, newUri);
            _tokenIds.increment();
        }
        // return newId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        require(_exists(tokenId));
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function getUserTokens(address _owner) public view returns(RenderUserToken[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        RenderUserToken[] memory res = new RenderUserToken[](ownerTokenCount);
        for(uint256 i = 0; i < ownerTokenCount; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_owner, i);
            res[i] = RenderUserToken(tokenId, tokenURI(tokenId));
        }
        return res;
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // only owner
}