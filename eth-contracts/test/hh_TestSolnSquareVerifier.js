
const fs = require('fs');
const { artifacts, assert } = require("hardhat");

const Verifier = artifacts.require("contracts\\verifier.sol:Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

// Test if a new solution can be added for contract - SolnSquareVerifier
describe("SolnSquareVerifier contract", function () {
    let accounts;
    let solnSquareVerifier;
    let verifier;
  
    before(async function () {
      accounts = await web3.eth.getAccounts();
      verifier = await Verifier.new();
      solnSquareVerifier = await SolnSquareVerifier.new(verifier.address, "Gopi Token", "GTK");
    });
  
    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("Check Solution", async function () {
      
      // read the proof
      const proof = await JSON.parse(fs.readFileSync("./test/proof.json")) ;
      
      // verify if the proof already exists.  If true, soluton cannot be added to contract
      const rtnVal = await solnSquareVerifier.checkSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
      console.log("Verification: " + rtnVal);
      assert.equal(rtnVal, false);
     
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("Mint ERC721 token", async function () {
      
        // read the proof
        const proof = await JSON.parse(fs.readFileSync("./test/proof.json")) ;
        
        // verify if the proof already exists.  If true, soluton cannot be added to contract
        const rtnVal = await solnSquareVerifier.checkSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
        console.log("Verification: " + rtnVal);
        assert.equal(rtnVal, false);

        if (!rtnVal) {
            const tokenId = 7575;
            await solnSquareVerifier.mintToken(accounts[2],tokenId,proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
            assert.equal(await solnSquareVerifier.totalSupply(), 1 );

        }
       
        const rtnVal2 = await solnSquareVerifier.checkSolution(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);
        console.log("Verification: " + rtnVal2);
        assert.equal(rtnVal2, true);

        // add a few more tokens and validate total supply, token name, symbol, URI, 
        // owners count balance
       
    });

})
