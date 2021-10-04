const { artifacts, assert } = require("hardhat");

const Greeter = artifacts.require("Greeter");
const ERC721 = artifacts.require("ERC721");
const FutureToken721 = artifacts.require("FutureToken721");

const truffleAssert = require('truffle-assertions');

// Traditional Truffle test

/*
contract("Greeter", (accounts) => {
  it("Should return the new greeting once it's changed", async function () {
    const greeter = await Greeter.new("Hello, world!");
    assert.equal(await greeter.greet(), "Hello, world!");

    await greeter.setGreeting("Hola, mundo!");

    assert.equal(await greeter.greet(), "Hola, mundo!");
  });
});
*/

// Vanilla Mocha test. Increased compatibility with tools that integrate Mocha.
describe("Greeter contract", function () {
  let accounts;

  before(async function () {
    accounts = await web3.eth.getAccounts();
  });

  describe("Deployment", function () {
    it("Should deploy with the right greeting", async function () {
      const greeter = await Greeter.new("Hello, world!");
      assert.equal(await greeter.greet(), "Hello, world!");

      const greeter2 = await Greeter.new("Hola, mundo!");
      assert.equal(await greeter2.greet(), "Hola, mundo!");
    });
  });
});

describe("ERC721 Mintable Contracts", function () {
  let accounts;
  let erc721;
  let ft721;
  before(async function () {
    accounts = await web3.eth.getAccounts();
    console.log("Number of Accounts: " + accounts.length);
    console.log("Account 10: " + accounts[10]);
  });

  
  // console.log("Account2 10: " + accounts[10]);
  it("Should deploy ERC721 with ERC721 Interface Id", async function () {
    erc721 = await ERC721.new();
    assert.equal(await erc721.supportsInterface('0x80ac58cd'), true);
    console.log("Account2 10: " + accounts[10]);
  });
  it("ERC721 - check balance", async function () {
    const balance = await erc721.balanceOf(accounts[10]);
    assert.equal(balance, 0);
  });
 

  describe("Deployment FutureToken721", function () {
    let accounts;
    let ft721;
    let tokenName = "Gopi Token";
    let tokenSymbol = "GTK";
    let tokenURI = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';
    let tokenOwner;
    let tokenId = 9876; // token to mint
    
    before(async function () {
      accounts = await web3.eth.getAccounts();
      tokenOwner = accounts[10];
    });
    
    it("Should deploy with Token name, token symbol and token uri", async function () {
      ft721 = await FutureToken721.new(tokenName, tokenSymbol);
      const tokenNameRtn = await ft721.name();
      // console.log("Here 1");
      assert.equal(tokenNameRtn, tokenName);
      assert.equal(await ft721.symbol(), tokenSymbol);
    });
    
    it("FT721 - check base token  URI", async function () {
      const tokenURIRtn = await ft721.baseTokenURI();
      // console.log("Returned TokenURI: " + tokenURIRtn);
      assert.equal(tokenURIRtn, tokenURI);
    });

    it("FT721 - mint token", async function () {
      await ft721.mint(tokenOwner, tokenId, "URI");
      await ft721.mint(accounts[11], 1234, "URI");
      await ft721.mint(accounts[12], 1235, "URI");
      await ft721.mint(accounts[13], 1236, "URI");
      await ft721.mint(accounts[14], 1237, "URI");
      assert.equal(await ft721.ownerOf(tokenId), tokenOwner);
    });

    it("FT721 - get token total supply", async function () {
      const totalSupply = await ft721.totalSupply();
      assert.equal(totalSupply, 5);
    });

    it("FT721 -validate contract owner", async function () {
      assert.equal(await ft721.getOwner(), accounts[0]);
    });

    it("FT721 -transfer ownership", async function () {
      await ft721.transferOwnership(accounts[4])
      assert.equal(await ft721.getOwner(), accounts[4]);
    });

    it("FT721 -change pause state", async function () {
      let txn = await ft721.changePauseState(true, {from:accounts[4]});
      truffleAssert.eventEmitted(txn, 'Paused', (event) => {
        console.log("Pause event emitted");
        return event.txnSender == accounts[4];
      });
      txn = await ft721.changePauseState(false, {from:accounts[4]});
      truffleAssert.eventEmitted(txn, 'Unpaused', (event) => {
        console.log("Unpause event emitted");
        return event.txnSender == accounts[4];
      });
    });

    it("FT721 -get an Owners token count balance", async function () {
      await ft721.mint(accounts[11], 2234, "URI", {from:accounts[4]});
      let balance = await ft721.balanceOf(accounts[11])
      assert.equal(balance, 2);
    });

    it("FT721 -get owner of token", async function () {
      
      let owner = await ft721.ownerOf(2234)
      assert.equal(owner, accounts[11]);
    });

    it("FT721 - approve another addressto transfer a token on behalf of owner", async function () {
      
      txn = await ft721.approve(accounts[12], 2234, {from:accounts[4]});
      truffleAssert.eventEmitted(txn, 'Approval', (event) => {
        console.log("Approval event emitted: owner, to, tokenid: " + event.owner + " " + event.approved +
              " " + event.tokenId);
        return event.approved == accounts[12];
      });
      assert.equal(await ft721.getApproved(2234), accounts[12]);

    });

    it("FT721 - set approval for all ", async function () {
      
      txn = await ft721.setApprovalForAll(accounts[17], true, {from:accounts[13]});
      truffleAssert.eventEmitted(txn, 'ApprovalForAll', (event) => {
        console.log("ApprovalForAll event emitted: owner, to, tokenid: " + event.owner + " " + 
            event.operator + " " + event.approved);
        return event.approved == true;
      });
      assert.equal(await ft721.isApprovedForAll(accounts[13], accounts[17]), true);

    });
    
    it("FT721 - transfering token ", async function () {
      
      txn = await ft721.transferFrom(accounts[11], accounts[16], 2234, {from:accounts[12]});
      truffleAssert.eventEmitted(txn, 'Transfer', (event) => {
        console.log("Transfer event emitted: from, to, tokenid: " + event.from + " " + 
            event.to + " " + event.tokenId);
        return event.to == accounts[16];
      });
      assert.equal(await ft721.ownerOf(2234), accounts[16]);
      assert.equal(await ft721.balanceOf(accounts[11]),1);
      assert.equal(await ft721.balanceOf(accounts[16]),1);

    });

    it("FT721 - safe transfer token ", async function () {
      
      txn = await ft721.safeTransferFrom(accounts[16], accounts[11], 2234, 
                            {from:accounts[16]});
      truffleAssert.eventEmitted(txn, 'Transfer', (event) => {
        console.log("Transfer event emitted: from, to, tokenid: " + event.from + " " + 
            event.to + " " + event.tokenId);
        return event.to == accounts[11];
      });
      assert.equal(await ft721.ownerOf(2234), accounts[11]);
      assert.equal(await ft721.balanceOf(accounts[11]),2);
      assert.equal(await ft721.balanceOf(accounts[16]),0);

    });

    it("FT721 -token of onwers by index", async function () {
      let tokenRtn = await ft721.tokenOfOwnerByIndex(accounts[11],  0)
      assert.equal(tokenRtn, 1234);
    });

    it("FT721 - get token total supply2", async function () {
      const totalSupply = await ft721.totalSupply();
      assert.equal(totalSupply, 6);
    });

    it("FT721 - get token by  index", async function () {
      const tokenId = await ft721.tokenByIndex(3);
      console.log("Token id by index 3: " + tokenId);
      assert.equal(tokenId, 1236);
    });

  });
});