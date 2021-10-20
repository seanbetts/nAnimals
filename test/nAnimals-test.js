const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("nAnimals", function () {
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let addr4;
  let addrs;
  let provider;
  const baseURI = "ipfs://nEGG/";
  const hatchURI = "ipfs://HATCH/";
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, ...addrs] = await ethers.getSigners();

    const name = "nAnimals";
    const dToken = await ethers.getContractFactory(name);
    hardhatToken = await dToken.deploy(baseURI);
    provider = waffle.provider;
  });

  describe("Mint", function () {
    it("Whitelist is Free", async function () {
      await hardhatToken.connect(owner).whitelistUser(addr1.address);
      await expect(hardhatToken.connect(addr1).mint(1)).to.emit(
        hardhatToken,
        "Transfer"
      );
    });
    it("Non-whitelist user fails if zero matic sent", async function () {
      await expect(hardhatToken.connect(addr1).mint(1)).to.be.revertedWith(
        "You haven't sent enough MATIC in the transaction to mint your nEGGs"
      );
    });

    it("Non-whitelist user fails if not enough matic sent", async function () {
      const mintPrice = await hardhatToken.mintPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice.div(2) })
      ).to.be.revertedWith(
        "You haven't sent enough MATIC in the transaction to mint your nEGGs"
      );
    });
    it("Non-whitelist user can mint if matic sent", async function () {
      const mintPrice = await hardhatToken.mintPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
    });
    it("Minting should deposit the correct amount", async function () {
      const mintPrice = await hardhatToken.mintPrice();
      const startBalance = await provider.getBalance(hardhatToken.address);
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const endBalance = await provider.getBalance(hardhatToken.address);
      const addrb = await provider.getBalance(addr1.address);
      expect(endBalance).to.equal(startBalance.add(mintPrice));
    });
  });

  describe("Hatch", function () {
    it("Can't hatch when not active", async function () {
      await expect(hardhatToken.connect(addr1).hatch(123)).to.be.revertedWith(
        "Hatching not active"
      );
    });
    it("Can't hatch without nEGG", async function () {
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).hatchingOn();
      await expect(hardhatToken.connect(addr1).hatch(123)).to.be.revertedWith(
        "nEGG needed to be able to hatch"
      );
    });
    it("Can't hatch nonexistent nEGG", async function () {
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).hatchingOn();
      const mintPrice = await hardhatToken.mintPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      await expect(hardhatToken.connect(addr1).hatch(123)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
    });
    it("Can't hatch nEGG w/o money", async function () {
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).hatchingOn();
      const mintPrice = await hardhatToken.mintPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const tokenId = await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0);
      await expect(
        hardhatToken.connect(addr1).hatch(tokenId)
      ).to.be.revertedWith(
        "You haven't sent enough MATIC in the transaction to hatch your nEGG"
      );
    });
    it("Can hatch nEGG", async function () {
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).hatchingOn();
      const mintPrice = await hardhatToken.mintPrice();
      const hatchPrice = await hardhatToken.hatchPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const tokenId = await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0);
      await expect(
        hardhatToken.connect(addr1).hatch(tokenId, { value: hatchPrice })
      ).to.emit(hardhatToken, "Transfer");
    });
    it("Can't hatch same nEGG", async function () {
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).hatchingOn();
      const mintPrice = await hardhatToken.mintPrice();
      const hatchPrice = await hardhatToken.hatchPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const tokenId = await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0);
      await expect(
        hardhatToken.connect(addr1).hatch(tokenId, { value: hatchPrice })
      ).to.emit(hardhatToken, "Transfer");
      await expect(
        hardhatToken.connect(addr1).hatch(tokenId, { value: hatchPrice })
      ).to.be.revertedWith("ERC721: token already minted");
    });
  });
  describe("Token URI", function () {
    it("Mint URI works", async function () {
      const mintPrice = await hardhatToken.mintPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const tokenId = await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0);
      const tokenURI = await hardhatToken.tokenURI(tokenId);
      expect(tokenURI).to.equal(`${baseURI}${tokenId}.json`);
    });
    it("Hatch URI works", async function () {
      await hardhatToken.connect(owner).setHatchURI(hatchURI);
      await hardhatToken.connect(owner).setGenStart(2000);
      await hardhatToken.connect(owner).hatchingOn();
      const mintPrice = await hardhatToken.mintPrice();
      const hatchPrice = await hardhatToken.hatchPrice();
      await expect(
        hardhatToken.connect(addr1).mint(1, { value: mintPrice })
      ).to.emit(hardhatToken, "Transfer");
      const tokenId = await hardhatToken.tokenOfOwnerByIndex(addr1.address, 0);
      await expect(
        hardhatToken.connect(addr1).hatch(tokenId, { value: hatchPrice })
      ).to.emit(hardhatToken, "Transfer");
      const hatchTokenId = await hardhatToken.tokenOfOwnerByIndex(
        addr1.address,
        1
      );
      const hatchTokenURI = await hardhatToken.tokenURI(hatchTokenId);
      expect(hatchTokenURI).to.equal(`${hatchURI}${tokenId}.json`);
    });
  });
});