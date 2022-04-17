'use strict';

/* Moralis init code */
const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
Moralis.start({ serverUrl, appId });
// Log In
let contractAddress = '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02'
const ERC721TransferABI = [
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    name: 'safeTransferFrom',
    type: 'function',
    constant: false,
    payable: false,
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    name: 'transferFrom',
    type: 'function',
    constant: false,
    payable: false,
  },
];


function auth() {
  Moralis.authenticate({ signingMessage: "Authenticate to gain access to the Pyada Protocol." }).then(() => {
    document.getElementById("login").style.display = 'none';
    document.getElementById("logout").style.display = 'block'
    document.getElementById("modal").style.display = 'none';
    window.location.replace("/dashboard")
  })
}


// Log Out
async function logOut() {
  let logout = document.getElementById("logoutMetamask")
  logout.onclick = async function() {
    await Moralis.User.logOut();
    window.location.replace("/");
  }
}


// Check if logged in
async function mainPageLoad() {
  const currentUser = await Moralis.User.current();
  if (currentUser) {
    window.location.replace("/dashboard")
  }

}

// Dashboard
async function dashboardLoad() {
  const currentUser = await Moralis.User.current();
  if (!currentUser) {
    window.location.replace('/');
  }
}


// User NFTs

//get addr
async function getAddress() {
  var wallet = await Moralis.User.currentAsync().then(function(user) {
    return user.get('ethAddress');
  }).catch(err => { return "there was an error" })
  return wallet;
}


//check if url
async function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

//get nfts
async function getNFTs(address) {
  // get polygon NFTs for address
  let chain = 'mumbai';
  const options = { chain: chain, address: address };

  const nftCount = await Moralis.Web3.getNFTsCount(options);
  document.getElementById("content").innerHTML = `<p class='content-p'>Showing ${nftCount} nfts</p>` + document.getElementById("content").innerHTML
  
  let nftsList = []
  if (nftCount > 0) {
    const allNFTs = await Moralis.Web3.getNFTs(options);
    for (let i in allNFTs) {
      let nft = allNFTs[i];
      let srcImg = ("https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg");

      var name = nft.name || 'No name found';
      var description = 'No description found';
      var address = nft.token_address;
      var symbol = nft.symbol;
      var tokenid = nft.token_id;
      var polygonscan = `https://mumbai.polygonscan.com/token/${address}`;

      if (await isUrl(nft.token_uri)) {
        let resp = await fetch(nft.token_uri);
        let data = await resp.json();
        if ((data.image).startsWith("https:") || (data.image).startsWith("http:")) {
          srcImg = data.image;
        }

        if (data.description) {
          description = data.description;
        }
      }
      let nftData = { name: name, description: description, address: address, image: srcImg, symbol: symbol, polygonscan: polygonscan, tokenid: tokenid };
      nftsList.push(nftData);
    }
    return nftsList;
  } else {
    return nftsList;
  }
}

async function transferMaticToUser(value) {
  let userWallet = await getAddress();
  let web3 = await Moralis.enableWeb3({
        chainId: 0x13881,
        privateKey:
          "3ec6ae487b65a47fe0633edca65a393ea05369b85f7cb58f6d24044172708f66"
  });


    // sending 0.5 tokens with 18 decimals
  const options = {
    type: "native",
    amount: `${(value * 1000000000000000000)}`,
    receiver: userWallet
  };
  let transaction = await Moralis.transfer(options);
  let result = await transaction.wait();
  return result
}


async function pawnNFT(address, loanAmount, loanRate, loanDuration, tokenid, imageURI, symbol, name, description) {
  
  var modal = document.getElementById("pawnModal");
  var confirmBtn = document.getElementById("confirmPawn");
  var span = document.getElementById("close-pawn-modal");
  var loadModal = document.getElementById("loadModal");
  var nftWorth = document.getElementById("NFT-worth");
  // TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  //TO TEXT INSTEAD OF "NOT PREDICTED YET"
  let resp = await fetch(`https://pyadaprotocol.randomcodingboy.repl.co/api/getQuotePrice?address=${address}&token=${tokenid}&chain=8001`);
  var quoteDict = await resp.json();
  quoteDict = quoteDict ? quoteDict :  {"quote":0.000001}
  var loanAmount = quoteDict.quote;
  nftWorth.innerHTML = nftWorth.innerHTML + " " + loanAmount
  modal.style.display = "block";
  span.onclick = function() {
    nftWorth.innerHTML = nftWorth.innerHTML.replace(' a value not predicted yet', "")
    modal.style.display = "none";
  }
  var transferN
  var transferM
  confirmBtn.onclick = async function() {
    modal.style.display = "none";
    loadModal.style.display = "block";
    let user = await Moralis.User.current();
    var currentPawned = user.get("pawnedNFTs") || [];
    let currentDate = new Date();
    tokenid = parseInt(tokenid) ? parseInt(tokenid) : tokenid;
    var data = { startDate: currentDate, address: `${address}`, interestRate: loanRate, loanAmount: loanAmount, loanDuration: loanDuration, image: imageURI, symbol: symbol, name: name, description: description, token: tokenid }
    try {
      modal.style.display = "none";
      await Moralis.enableWeb3();
      transferN = await getNFTfromUser(address, tokenid);
      transferM = await transferMaticToUser(loanAmount);
      currentPawned.push(data);
      user.set('pawnedNFTs', currentPawned);
      await user.save();
      //document.getElementById("content").innerHTML = ''
      window.location.reload();
    } catch(err) {
      console.log("There was an error", err, 'n', transferN, 'm', transferM)
      window.location.reload();

    }
  }
  
}


async function getNFTfromUser(address, token) {
  token = parseInt(token) ? parseInt(token) : token;
  let web3 = await Moralis.enableWeb3();
  let userWallet = await getAddress();
  const options = {
    type: "erc721",
    receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD",
    contractAddress: address,
    tokenId: token,
  };
  let transaction = await Moralis.transfer(options);
  let result = await transaction.wait();
  return result;
}


async function giveNFTtoUser(address, token) {
  let userWallet = await getAddress();
  //let web3 = await Moralis.enableWeb3(); 
  let web3 = await Moralis.enableWeb3({
        chainId: 0x13881, 
        privateKey:
          "3ec6ae487b65a47fe0633edca65a393ea05369b85f7cb58f6d24044172708f66"
  });
  /*const options = {
    type: "erc721",
    receiver: userWallet,
    contractAddress: address,
    tokenId: token,
  };*/
  const ethers = Moralis.web3Library;
  let provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/v1/202cf93e75046c12f10f2d8310787279e6cc2110")

  const pawnShop = web3.getSigner();
  let pawnWallet = new ethers.Wallet("3ec6ae487b65a47fe0633edca65a393ea05369b85f7cb58f6d24044172708f66");
  var connectedPawnWallet = pawnWallet.connect(provider);
  const sender = "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD";
 // let customToken = new ethers.Contract(address, ERC721TransferABI, signer);
//  let result = await customToken.safeTransferFrom(sender, userWallet, token, {from:sender});

    let NFT = new ethers.Contract(address, ERC721TransferABI, pawnShop);
  let result = await NFT.connect(connectedPawnWallet).transferFrom(sender, userWallet, token);
  //let transaction = await Moralis.transfer(options);
  //let result = await transaction.wait();
  return result;

}

async function getMaticFromUser(value) {
  await getAddress();
  await Moralis.enableWeb3();

    // sending 0.5 tokens with 18 decimals
  let price = Math.round(Number(value * 1000000000000000000));
  const options = {
    type: "native",
    amount: `${price}`,
    receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD"
  };
  let transaction = await Moralis.transfer(options);
  let result = await transaction.wait();
  return result;
}


// get pawned nfts
async function getPawnedNFTs() {
  let user = await Moralis.User.current();
  let currentPawned = user.get('pawnedNFTs');
  return currentPawned;
}

// reclaim stuff
async function reclaimNFT(address) {
  var modal = document.getElementById("reclaimModal");
  var confirmBtn = document.getElementById("confirmReclaim");
  var span = document.getElementById("close-reclaim-modal");
  var loadModal = document.getElementById("loadModal");
  var nftPrice = document.getElementById("NFT-price");
  let user = await Moralis.User.current();
  var currentPawned = user.get("pawnedNFTs") || [];
  var NFT = null;
  NFT = currentPawned.filter(item => item.address == address)[0]
  var now = new Date();
  var startDate = new Date(NFT.startDate);
  var dayDiff = Math.round((now.getTime() - startDate.getTime())/(1000 * 3600 * 24));
// To calculate the no. of days between two dates
  var price = NFT.loanAmount*Math.pow((1+(NFT.interestRate/30)), dayDiff);
  nftPrice.innerHTML = nftPrice.innerHTML + price + "."
  modal.style.display = "block";
  span.onclick = function() {
    nftPrice.innerHTML = nftPrice.innerHTML.replace(`${price}.`, "")
    modal.style.display = "none";
  }
  var transferM
  var transferN
  
  confirmBtn.onclick = async function() {
    try {
      modal.style.display = "none";
      loadModal.style.display = "block";
      let numPrice = Number(price);
    transferM = await getMaticFromUser(numPrice);
    transferN = await giveNFTtoUser(address, NFT.token);
      
    let data = currentPawned.filter(item => item.address !== address && item.token!==NFT.token)
    user.set('pawnedNFTs', data);

    document.getElementById("content").innerHTML = ''
      
    await getNFTs();

      
    await user.save();
    window.location.reload();
    } catch(err) {
      console.log("There was an error", JSON.stringify(err), 'm', transferM, 'n', transferN)
      window.location.reload();
    }

  }
  
}