// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract nAnimals is ERC721, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    string public baseURI;
    address public contractAddress = address(this);
    uint256 public mintPrice = 2 ether;
    uint256 public maxMintSupply = 2000;
    uint256 public maxMintQuantity = 10;
    bool public paused = false;
    Counters.Counter _tokenIds;
    
    mapping(uint256 => string) _tokenURIs;
    mapping (address => bool) public whitelisted;
    
    struct RenderUserToken {
        uint256 id;
        string uri;
    }
    
    constructor(string memory _initBaseURI) ERC721("nAnimals", "NANI") {
        setBaseURI(_initBaseURI);
    }
    
    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function calculatePrice(uint256 numberOfTokens) internal view returns (uint256)
    {
      return mintPrice * numberOfTokens;
    }

    function concatJSON(string memory strOne, string memory strTwo) private pure returns (string memory) {
        return string(abi.encodePacked(strOne, strTwo, ".json"));
    }
    
    function concatStrings(string memory strOne, string memory strTwo, string memory strThree) private pure returns (string memory) {
        return string(abi.encodePacked(strOne, strTwo, strThree));
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // public
    function mint(uint256 _mintQuantity) public payable {
        uint256 supply = totalSupply();
        uint256 mintCost = calculatePrice(_mintQuantity);
        string memory uri = baseURI;
        require(!paused, "Minting is currently paused");
        require(_mintQuantity > 0, "Mint amount must be greater than 0");
        require(_mintQuantity <= maxMintQuantity, concatStrings("You can currently only mint up to ", Strings.toString(maxMintQuantity), " nEggs"));
        if (msg.sender != owner()) {
            require(balanceOf(msg.sender) + _mintQuantity <=10, "You can only mint up to 10 nEggs per wallet");
        }
        require(supply + _mintQuantity <= maxMintSupply, "You're trying to mint more nEggs than we have left!");
        if (msg.sender != owner()) {
            if(whitelisted[msg.sender] != true) {
                require(msg.sender.balance >= mintCost, "Your wallet doesn't have enough MATIC for your transaction");
                require(msg.value >= mintCost, "You haven't sent enough MATIC in the transaction to mint your nEggs");
                payable(msg.sender).transfer(mintCost);
            }
        }
        for (uint256 i = 0; i < _mintQuantity; i++) {
            uint256 newId = _tokenIds.current();
            string memory newUri = concatJSON(uri, Strings.toString(newId+1));
            _safeMint(msg.sender, newId);
            _setTokenURI(newId, newUri);
            _tokenIds.increment();
        }
    }

    function withdrawMatic() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
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
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
        
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
    
    function setMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
      
    function setmaxMintAmount(uint256 _newmaxMintQuantity) public onlyOwner() {
        maxMintQuantity = _newmaxMintQuantity;
    }
  
    function whitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = true;
    }
     
    function removeWhitelistUser(address _user) public onlyOwner {
        whitelisted[_user] = false;
    }
}