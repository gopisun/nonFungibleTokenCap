// pragma solidity ^0.7.0;
pragma solidity ^0.5.5;

import "hardhat/console.sol";


contract Greeter {

    string greeting;

    constructor(string memory _greeting) public {
        console.log("In constructor");
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("In setGreeting()");
        greeting = _greeting;
    }

}