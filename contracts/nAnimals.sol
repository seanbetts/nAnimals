// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract nAnimals is ERC721, ERC721Enumerable, ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    string public baseURI;
    string public hatchURI;
    address public contractAddress = address(this);
    uint256 public mintPrice = 2 ether;
    uint256 public hatchPrice = 2 ether;
    uint256 public maxMintSupply = 2000;
    uint256 public genStart;
    uint256 public maxMintQuantity = 10;
    bool public hatchingActive = false;
    Counters.Counter _tokenIds;
    
    mapping(uint256 => string) _tokenURIs;
    mapping (address => bool) public inclusionlisted;
    
    struct RenderUserToken {
        uint256 id;
        string uri;
    }
    
    constructor(string memory _initBaseURI) ERC721("nAnimals", "NANI") {
        setBaseURI(_initBaseURI);
    }

    // public
    function mint(uint256 _mintQuantity) 
        public 
        payable 
        whenNotPaused 
        {
            uint256 supply = totalSupply();
            uint256 mintCost = calculatePrice(_mintQuantity);
            string memory uri = baseURI;
            require(_mintQuantity > 0, "Mint amount must be greater than 0");
            require(_mintQuantity <= maxMintQuantity, concatStrings("You can currently only mint up to ", Strings.toString(maxMintQuantity), " nEGGs"));
            if (msg.sender != owner()) {
                require(balanceOf(msg.sender) + _mintQuantity <=10, "You can only mint up to 10 nEGGs per wallet");
            }
            require(supply + _mintQuantity <= maxMintSupply, "You're trying to mint more nEGGs than we have left!");
            if (msg.sender != owner()) {
                if(inclusionlisted[msg.sender] != true) {
                    require(msg.sender.balance >= mintCost, "Your wallet doesn't have enough MATIC for your transaction");
                    require(msg.value >= mintCost, "You haven't sent enough MATIC in the transaction to mint your nEGGs");
                    payable(msg.sender).transfer(mintCost);
                }
            }
            for (uint256 i = 0; i < _mintQuantity; i++) {
                uint256 newId = _tokenIds.current();
                string memory newUri = concatJSON(uri, Strings.toString(newId));
                _safeMint(msg.sender, newId);
                _setTokenURI(newId, newUri);
                _tokenIds.increment();
            }
        }
    
    function hatch(uint256 tokenId) 
        public 
        payable 
        whenNotPaused 
        nonReentrant 
        {
            string memory uri = concatJSON(hatchURI, Strings.toString(tokenId));
            require(hatchingActive = true);
            require(0 <= tokenId && tokenId <= 2000, "nEGG out of range");
            require(balanceOf(_msgSender()) > 0, "nEGG needed to be able to hatch");
            require(_msgSender() == ownerOf(tokenId), "You don't own this nEGG");
            if (msg.sender != owner()) {
                if(inclusionlisted[msg.sender] != true) {
                    require(msg.sender.balance >= hatchPrice, "Your wallet doesn't have enough MATIC for your transaction");
                    require(msg.value >= hatchPrice, "You haven't sent enough MATIC in the transaction to hatch your nEGG");
                    payable(msg.sender).transfer(hatchPrice);
                }
            }
            _safeMint(msg.sender, tokenId+genStart);
            _setTokenURI(tokenId+genStart, uri);
            _tokenIds.increment();
        }

    function getUserTokens(address _owner) 
        public 
        view 
        returns(RenderUserToken[] memory) 
        {
            uint256 ownerTokenCount = balanceOf(_owner);
            RenderUserToken[] memory res = new RenderUserToken[](ownerTokenCount);
            for(uint256 i = 0; i < ownerTokenCount; i++) {
                uint256 tokenId = tokenOfOwnerByIndex(_owner, i);
                res[i] = RenderUserToken(tokenId, tokenURI(tokenId));
            }
            return res;
        }

    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override 
        returns(string memory) 
        {
            require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
            string memory _tokenURI = _tokenURIs[tokenId];
            return _tokenURI;
        }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721Enumerable) 
        returns (bool) 
        {
            return super.supportsInterface(interfaceId);
        }

    // only owner
    function setBaseURI(string memory _newBaseURI) 
        public 
        onlyOwner 
        {
            baseURI = _newBaseURI;
        }
    
    function setGenStart(uint256 _newGenStart) 
        public 
        onlyOwner 
        {
            genStart = _newGenStart;
        }
    
    function setHatchURI(string memory _newHatchURI) 
        public 
        onlyOwner 
        {
            hatchURI = _newHatchURI;
        }
        
    function pause() 
        public 
        onlyOwner 
        {
            _pause();
        }
    
    function unpause() 
        public 
        onlyOwner 
        {
            _unpause();
        }
    
    function hatchingOn() 
        public 
        onlyOwner 
        {
            require(genStart >= totalSupply() && genStart >= 2000, "genStart must be higher than the current supply");
            require (keccak256(abi.encodePacked(hatchURI)) != keccak256(abi.encodePacked("")), "Remember to set the hatchURI");
            hatchingActive = true;
        }

    function hatchingOff() 
        public 
        onlyOwner 
            {
            hatchingActive = false;
        }
    
    function setMintPrice(uint256 newMintPrice) 
        public 
        onlyOwner 
        {
            mintPrice = newMintPrice;
        }
    
    function setHatchPrice(uint256 newHatchPrice) 
        public 
        onlyOwner 
        {
            hatchPrice = newHatchPrice;
        }
      
    function setmaxMintAmount(uint256 _newmaxMintQuantity) 
        public 
        onlyOwner() 
        {
            maxMintQuantity = _newmaxMintQuantity;
        }
  
    function inclusionlistUser(address _user) 
        public 
        onlyOwner 
        {
            inclusionlisted[_user] = true;
        }
     
    function removeinclusionlistUser(address _user) 
        public 
        onlyOwner 
        {
            inclusionlisted[_user] = false;
        }
    
    function withdrawMatic() 
        public 
        onlyOwner 
        {
            uint256 balance = address(this).balance;
            payable(msg.sender).transfer(balance);
        }

    // internal
    function _baseURI() 
        internal 
        view 
        virtual 
        override 
        returns (string memory) 
        {
            return baseURI;
        }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) 
        internal 
        {
            _tokenURIs[tokenId] = _tokenURI;
        }
    
    function calculatePrice(uint256 numberOfTokens) 
        internal 
        view 
        returns (uint256)
        {
            return mintPrice * numberOfTokens;
        }

    function concatJSON(string memory strOne, string memory strTwo) 
        private 
        pure 
        returns (string memory) 
        {
            return string(abi.encodePacked(strOne, strTwo, ".json"));
        }
    
    function concatStrings(string memory strOne, string memory strTwo, string memory strThree) 
        private 
        pure 
        returns (string memory) 
        {
            return string(abi.encodePacked(strOne, strTwo, strThree));
        }
    
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) 
        internal 
        virtual 
        override(ERC721, ERC721Enumerable) 
        {
            super._beforeTokenTransfer(from, to, tokenId);
        }
}