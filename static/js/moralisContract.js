'use strict'

/* Moralis init code */
//const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
//const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
Moralis.start({ serverUrl, appId });


/* Contract Stuff */

// pawn
  
async function executeContractScript(functionName, params) {


let abi = [{
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        }
      ],
      "name": "acceptTerms",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amountInWei",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_interestRate",
          "type": "uint256"
        }
      ],
      "name": "calculatePayment",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        }
      ],
      "name": "claimCollateral",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "lender",
          "type": "address"
        }
      ],
      "name": "getLoans",
      "outputs": [
        {
          "components": [
            {
              "internalType": "contract IERC721",
              "name": "nftAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nftTokenID",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountInWei",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "enum NFTPawnShop.CollateralStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "borrowerIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lenderIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "allTermsIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTPawnShop.Terms[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "getPawnedTerms",
      "outputs": [
        {
          "components": [
            {
              "internalType": "contract IERC721",
              "name": "nftAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nftTokenID",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountInWei",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "enum NFTPawnShop.CollateralStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "borrowerIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lenderIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "allTermsIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTPawnShop.Terms[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getWaitingTerms",
      "outputs": [
        {
          "components": [
            {
              "internalType": "contract IERC721",
              "name": "nftAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "nftTokenID",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountInWei",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "duration",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "lender",
              "type": "address"
            },
            {
              "internalType": "enum NFTPawnShop.CollateralStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "borrowerIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lenderIndex",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "allTermsIndex",
              "type": "uint256"
            }
          ],
          "internalType": "struct NFTPawnShop.Terms[]",
          "name": "",
          "type": "tuple[]"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "onERC721Received",
      "outputs": [
        {
          "internalType": "bytes4",
          "name": "",
          "type": "bytes4"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
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
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        }
      ],
      "name": "paybackTerm",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "delta",
          "type": "uint256"
        }
      ],
      "name": "refund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_borrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "termIndex",
          "type": "uint256"
        }
      ],
      "name": "undoTerm",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  const options = {
    chain: "mumbai",
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    function_name: functionName,
    abi: abi,
    params: params
  };
  const allowance = await Moralis.Web3API.native.runContractFunction(options);
}