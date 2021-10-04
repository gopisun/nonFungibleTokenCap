/* require('dotenv').config({path: './.env'})  */
require('dotenv').config()
const fs = require('fs')
const HDWalletProvider = require('truffle-hdwallet-provider')
const web3 = require('web3')

SolnSquareVerifier = require('./../build/contracts/SolnSquareVerifier.json');
// Verifier = require('./../build/Verifier.json');


const MNEMONIC = process.env.MNEMONIC

const infuraKey = process.env.INFURA_KEY
const mnemonic = process.env.MNEMONIC
const solnSquareVerifierAddress =  process.env.solnSquareVerifierAddress

/*
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const NUM_CREATURES = 10
const NUM_LOOTBOXES = 4
const DEFAULT_OPTION_ID = 0
const LOOTBOX_OPTION_ID = 2
*/



async function mintToken() {
   
  const provider = new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`)
  
  const web3Instance = new web3(provider)

  if (solnSquareVerifierAddress) {
        const factoryContract = new web3Instance.eth.Contract(
            SolnSquareVerifier.abi,
            solnSquareVerifierAddress,
        { gasLimit: '1000000' }
        )
        const minterAddress = "0xf062BE692c443C13746da4256D85D693e0Ed1735";
        const proof = await JSON.parse(fs.readFileSync("../test/proof10.json")) ;

        console.log("Proof a: " + proof.proof.a);

        const accountsArr = await web3Instance.eth.getAccounts();
        console.log("Accounts length: " + accountsArr.length);
        console.log("Accounts: " + accountsArr);

        try {
            const result = await factoryContract.methods.mintToken(minterAddress, 2011, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs).send({from:accountsArr[0]});
            console.log("result: " + result)
        } catch(e)  {
            console.log("Exception: " + e)
        }

  } else {
        console.error(
        'Add FACTORY_CONTRACT_ADDRESS to the environment variables'
        )
  }
  console.log("leaving mint token");
}

mintToken()
console.log("After invoking mintToken()")