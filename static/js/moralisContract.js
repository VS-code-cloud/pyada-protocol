'use strict'

/* Moralis init code */
const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
Moralis.start({ serverUrl, appId });


/* Contract Stuff */
async function pawn(tokenid, address, amount, duration = 30, interestrate = 0.08) {
let options = {
  "contractAddress": "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "contract IERC721",
          "name": "_nftAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_nftTokenID",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_amountInWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_duration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_interestRate",
          "type": "uint256"
        }
      ],
      "name": "pawn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "Params": {
    "_nftAddress": address,
    "_nftTokenID":tokenid,
    "_amountInWei": (amount*1000000000000000000)
  }
}

  
}
