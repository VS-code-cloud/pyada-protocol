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
  Moralis.User.logOut().then(async () => {
    const currentUser = await Moralis.User.current();
    window.location.replace("/")
  });
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
  const result = await transaction.wait();
  // await web3.provider.disconnect();
}

// Pawning NFTs
async function pawnNFT(address, loanAmount, loanRate, loanDuration, tokenid, imageURI, symbol, name, description) {
  
  var modal = document.getElementById("pawnModal");
  var confirmBtn = document.getElementById("confirmPawn");
  var span = document.getElementById("close-pawn-modal");
  var nftWorth = document.getElementById("NFT-worth");
  /* TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  TO TEXT INSTEAD OF "NOT PREDICTED YET"*/
  nftWorth.innerHTML = nftWorth.innerHTML + " a value not predicted yet"
  modal.style.display = "block";
  span.onclick = function() {
    nftWorth.innerHTML = nftWorth.innerHTML.replace(' a value not predicted yet', "")
    modal.style.display = "none";
  }

  
  confirmBtn.onclick = async function() {
    let user = await Moralis.User.current();
    let currentPawned = user.get("pawnedNFTs") || [];
    let currentDate = new Date();
    let data = { startDate: currentDate, address: `${address}`, interestRate: loanRate, loanAmount: loanAmount, loanDuration: loanDuration, image: imageURI, symbol: symbol, name: name, description: description, token: tokenid }
    console.log("in on click");
    try {
      currentPawned.push(data);
      user.set('pawnedNFTs', currentPawned);
      console.log("user is ", user)
      console.log("before curr pawned", currentPawned, data)
    
      
    await getNFTfromUser(address, tokenid);

    await transferMaticToUser(loanAmount);

    document.getElementById("content").innerHTML = ''
      
    await getNFTs();

      
    await user.save()
    } catch(err) {
      console.log("There was an error", err)
    }
    window.location.reload();

  }
  
}



async function getNFTfromUser(address, token) {
  let web3 = await Moralis.enableWeb3({});

  console.log('in get nft')
  let userWallet = await getAddress();
  console.log('this wallet', userWallet)
  const options = {
      type: "erc721",
  receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD",
  contractAddress: address,
    tokenId: token
    };
  console.log("this is options", options)
let result = await Moralis.transfer(options);
  console.log('this is web3 provider', web3.provider)
  // await web3.provider.disconnect()
}


async function giveNFTtoUser(address, token) {
  let userWallet = await getAddress();
  let web3 = await Moralis.enableWeb3({
        chainId: 0x13881,
        privateKey:
          "3ec6ae487b65a47fe0633edca65a393ea05369b85f7cb58f6d24044172708f66"
  });
  console.log('in get nft')
  const options = {
      type: "erc721",
  receiver: userWallet,
  contractAddress: address,
    tokenId: token
    };
  let result = await Moralis.transfer(options);
    // await web3.provider.disconnect();
}

async function getMaticFromUser(value) {
  let userWallet = await getAddress();
  let web3 = await Moralis.enableWeb3({});

    // sending 0.5 tokens with 18 decimals
  const options = {
    type: "native",
    amount: `${(value * 1000000000000000000)}`,
    receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD"
  };
  let transaction = await Moralis.transfer(options);
  const result = await transaction.wait();
  console.log("this is web3 and eth", web3, web3.provider)
  // await web3.provider.disconnect();
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
  var NFT = currentPawned.filter(item => item.address == address)[0]
  /* TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  TO TEXT INSTEAD OF "NOT PREDICTED YET"*/
  var now = new Date();
  var startDate = new Date(NFT.startDate);
  console.log('nftochiye', NFT)
  var dayDiff = Math.round((now.getTime() - startDate.getTime())/(1000 * 3600 * 24));
  console.log('now, startdate, daydiff', now, startDate, dayDiff)
// To calculate the no. of days between two dates
  var price = NFT.loanAmount*Math.pow((1+(NFT.interestRate/30)), dayDiff);
  nftPrice.innerHTML = nftPrice.innerHTML + price + "."
  modal.style.display = "block";
  span.onclick = function() {
    nftWorth.innerHTML = nftWorth.innerHTML.replace(`${price}.`, "")
    modal.style.display = "none";
  }

  
  confirmBtn.onclick = async function() {
    try {
      currentPawned = currentPawned.filter(item => item.address !== address && item.token!==NFT.token)
      currentPawned.push(currentPawned);
    user.set('pawnedNFTs', currentPawned);
      console.log("user is ", user)
      console.log("before curr reclaimed", currentPawned)
    
      
    await giveNFTtoUser(address, NFT.tokenid);

    await getMaticFromUser(NFT.loanAmount);

    document.getElementById("content").innerHTML = ''
      
    await getNFTs();

      
    await user.save()
    } catch(err) {
      console.log("There was an error", err)
    }
    window.location.reload();

  }
  
}