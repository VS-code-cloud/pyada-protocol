'use strict'

/* Moralis init code */
const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
Moralis.start({ serverUrl, appId });
// Log In
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
    console.log('user being logged out')
    await Moralis.User.logOut();
    window.location.replace("/");
  }
}


// Check if logged in
async function mainPageLoad() {
  const currentUser = await Moralis.User.current();
  if (currentUser) {
    window.location.replace("/dashboard")
  } else {
    console.log("Not logged in")
  }

}

// Dashboard
async function dashboardLoad() {
  const currentUser = await Moralis.User.current();
  if (currentUser) {
    console.log("current user", currentUser)
  } else {
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
  var nftWorth = document.getElementById("NFT-worth");
  // TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  //TO TEXT INSTEAD OF "NOT PREDICTED YET"
  let resp = await fetch(`https://pyada-protocol-stopgap.vs-code-cloud.repl.co/api/getQuotePrice?address=${address}&token=${tokenid}&chain=8001`);
  console.log("resp",resp);
  var quoteDict = await resp.json();
  quoteDict = quoteDict ? quoteDict :  {"quote":0.000001}
  console.log('this is quoteDict', quoteDict)
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
    let user = await Moralis.User.current();
    var currentPawned = user.get("pawnedNFTs") || [];
    let currentDate = new Date();
    tokenid = parseInt(tokenid) ? parseInt(tokenid) : tokenid;
    var data = { startDate: currentDate, address: `${address}`, interestRate: loanRate, loanAmount: loanAmount, loanDuration: loanDuration, image: imageURI, symbol: symbol, name: name, description: description, token: tokenid }
    console.log("in on click", data);
    try {
      modal.style.display = "none";
      await Moralis.enableWeb3();
      transferN = await getNFTfromUser(address, tokenid);
      transferM = await transferMaticToUser(loanAmount);
      console.log('this is transferm and trasnfern', transferM, transferN);
      console.log("this is currentpawned before push", currentPawned, data)
      currentPawned.push(data);
      user.set('pawnedNFTs', currentPawned);
      console.log('this is currentpawned after', currentPawned)
      await user.save();
      document.getElementById("content").innerHTML = ''
      window.location.reload();
    } catch(err) {
      console.log("There was an error", err, 'n', transferN, 'm', transferM)
    }
  }
  
}


async function getNFTfromUser(address, token) {
  /*await getAddress();
  await Moralis.enableWeb3();
  const options = {
      type: "erc721",
  receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD",
  contractAddress: address,
    tokenId: token
    };
  await Moralis.transfer(options);
  console.log('this is web3 provider', web3.provider)*/
  token = parseInt(token) ? parseInt(token) : token;
  let web3 = await Moralis.enableWeb3();
  console.log('in get nft')
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
  let web3 = await Moralis.enableWeb3({
        chainId: 0x13881,
        privateKey:
          "3ec6ae487b65a47fe0633edca65a393ea05369b85f7cb58f6d24044172708f66"
  });
  token = parseInt(token) ? parseInt(token) : token;
  console.log('inputs', address, token, userWallet, web3)
  console.log('in get nft')
  const options = {
      type: "erc721",
  receiver: userWallet,
  contractAddress: address,
    tokenId: token
    };
  let transaction = await Moralis.transfer(options);
  let result = await transaction.wait();
  return result;
}

async function getMaticFromUser(value) {
  await getAddress();
  await Moralis.enableWeb3();

    // sending 0.5 tokens with 18 decimals
  const options = {
    type: "native",
    amount: `${(value * 1000000000000000000)}`,
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
  var nftPrice = document.getElementById("NFT-price");
  let user = await Moralis.User.current();
  var currentPawned = user.get("pawnedNFTs") || [];
  var NFT = null;
  NFT = currentPawned.filter(item => item.address == address)[0]
  console.log("this is nft", NFT, address)
  /* TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  TO TEXT INSTEAD OF "NOT PREDICTED YET"*/
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
      
      console.log("before curr reclaimed", currentPawned)
    console.log('nft and addr', NFT, address)
    transferN = await giveNFTtoUser(address, NFT.token);
    //transferM = await getMaticFromUser(NFT.loanAmount);
      
    let data = currentPawned.filter(item => item.address !== address && item.token!==NFT.token)
    user.set('pawnedNFTs', data);
      console.log("user is ", user)

    document.getElementById("content").innerHTML = ''
      
    await getNFTs();

      
    await user.save();
    window.location.reload();
    } catch(err) {
      console.log("There was an error", err, 'm', transferM, 'n', transferN)
    }

  }
  
}