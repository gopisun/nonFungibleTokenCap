pragma solidity >=0.4.21 <0.6.0;
// pragma solidity ^0.8.7;

import "./ERC721Mintable.sol";
// import "./verifier.sol";   // uncommnet when truffle is used for compiling and migration 


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is FutureToken721 {

    Verifier private verifier;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] inputs;

    }


    // TODO define an array of the above struct
    Solution[] _solutions;


    // TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => bool) _mapSoln; // key will be a hash of Solutions instance


    constructor(address verifierAddress, string memory tokenName, string memory tokenSymbol)
                FutureToken721(tokenName, tokenSymbol)  public 
    {
        verifier = Verifier(verifierAddress);
    }


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(string tokenId, uint[2] inputs);

    // modifier to check solution uniqueness
    modifier requireUniqueSolution(uint[2] memory a, uint[2][2]  memory b, uint[2]  memory c, uint[2] memory inputs) {
        bytes32 solnKey = getSolutionKey(a, b, c, inputs);
        require(!_mapSoln[solnKey], "Solution already exists");
        _;
    }

    // if solution exists returns true, else false.
    function checkSolution(uint[2] memory  a, uint[2][2]  memory b, uint[2] memory  c, uint[2]  memory inputs)
                                                         public view returns (bool) {
        bytes32 solnKey = getSolutionKey(a, b, c, inputs);
        return _mapSoln[solnKey];
    }


    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint[2] memory  a, uint[2][2]  memory b, uint[2] memory  c, uint[2]  memory inputs, bytes32 solutionKey) internal 
    {
        Solution memory solution;
        solution.a = a;
        solution.b = b;
        solution.c = c;
        solution.inputs = inputs;

        _solutions.push(solution);
        _mapSoln[solutionKey] = true;

    }

    function getSolutionKey(uint[2]  memory a, uint[2][2] memory  b, uint[2]  memory c, uint[2] memory  inputs)
                                                                pure
                                                                public
                                                                returns(bytes32)
    {
        return keccak256(abi.encodePacked(a, b, c, inputs));
    }




    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function mintToken(address addr, uint256 tokenId, uint[2] memory  a, uint[2][2] memory  b, uint[2] memory  c, uint[2] memory  inputs)
                                                            public
                                                            requireUniqueSolution(a, b, c, inputs)
                                                            returns (bool)
    {
        if (verifier.verifyTx(a, b, c, inputs)  == true) {
            // add the solution
            bytes32 solnKey = getSolutionKey(a, b, c, inputs);
            addSolution(a, b, c, inputs, solnKey);
            // return FutureToken721.mint(addr, tokenId,"URI");
            return mint(addr, tokenId,"URI");
        }
        else {
            return false;
        }
    }

}


// comment the contract definition below when truffle is used for compiling and migration
contract Verifier {
    function verifyTx(uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c, uint[2] memory input
        ) public view returns (bool r);
}



























