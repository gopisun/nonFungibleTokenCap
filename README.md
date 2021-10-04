# Udacity Blockchain Capstone

## Install 
This repository contains Smart Contract code in Solidity, tests, zokrates code & generated proofs and scripts to mint tokens.

The project uses hardhat for testing and truffle for deployment to local and test environments.  Hardhat was used since it provides
console.log in smart contracts that is very helpful in debugging.

Caveat:  The smartcontract SolnSquareVerifier.sol can be compiled "as is" while using hardhat.  When truffle is used, uncomment the include for verifier.sol and comment out the Verifier contract definition at the bottom of the file. Not sure the reason for incompatibility.

To install, download or clone the repo, then:

npm install 
hardhat compile   (if hardhat is not installed, please follow the documention at https://hardhat.org/ for installation)

## Testing
For testing  
    cd to eth-contracts directory.  Then execute
    npx hardhat test

This will execute all the 3 test scripts in the tests directory.

## for deployment to rinkeby test network.  
    1. do th changes in SolnSquareVerifier.sol as described in "Install" section".
    2. in truffle.config (in eth-contracts folder), supply our mnemonic and infura key.
    3. do truffle migrate --network --rinkeby --reset

Deployed contract address:0x59D63d47E54E7589529040DCa65A078b93833fb3
url : https://rinkeby.etherscan.io/token/0x59D63d47E54E7589529040DCa65A078b93833fb3

## Tokens minted and sold
1. 5 tokens were minted with token ids: 2002, 2003, 2004, 2005 and 2006. 
2. 5 more tokens were minted but were not put up for sale - 2007, 2008, 2009, 2010, 2011
 Minted by account:  0xf062BE692c443C13746da4256D85D693e0Ed1735
 Token name:  "GopiToken" 
 Symbol: "GTK"

 url: https://testnets.opensea.io/assets?search[query]=GopiToken

2. The 5 tokens were put on sale on opensea.
3. the 5 tokens were purchased by account 0x6b35c1C061eDFAcA03b2F18dE69dF42BD42dC74D .

The trading history of each token provides the minting, putting up for sale and purchase (transfer)



