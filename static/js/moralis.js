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
function logOut() {
  Moralis.User.logOut().then(() => {
    const currentUser = Moralis.User.current();
    window.location.replace("/")
  });
}

// Check if logged in
function mainPageLoad() {
  const currentUser = Moralis.User.current();
  if (currentUser) {
    window.location.replace("/dashboard")
  } else {
    console.log("Not logged in")
  }

}

// Dashboard
function dashboardLoad() {
  const currentUser = Moralis.User.current();
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
  console.log("this is web3 and eth", web3, web3.provider)
  await web3.provider.disconnect();
}

// Pawning NFTs
async function pawnNFT(address, loanAmount, loanDuration, tokenid, imageURI, symbol, name, description) {
  
  var modal = document.getElementById("pawnModal");
  var confirmBtn = document.getElementById("confirmPawn");
  var span = document.getElementById("close-pawn-modal");
  var nftWorth = document.getElementById("NFT-worth");
  var completeModal = document.getElementById("pawnComplete");
  var exitBtn = document.getElementById("exitFinishedPawn");
  var finishSpan = document.getElementById("close-pawn-complete");
  /* TODO ONCE PRICE PREDICTOR IS COMPLETE: ADD PRICE PREDICTOR
  TO TEXT INSTEAD OF "NOT PREDICTED YET"*/
  nftWorth.innerHTML = nftWorth.innerHTML + " a value not predicted yet"
  modal.style.display = "block";
  span.onclick = function() {
    nftWorth.innerHTML = nftWorth.innerHTML.replace(' a value not predicted yet', "")
    modal.style.display = "none";
  }
  finishSpan.onclick = function() {
    completeModal.style.display = "none";
  }
  exitBtn.onclick = function() {
    completeModal.style.display = "none";
  }

  
  confirmBtn.onclick = async function() {
    let user = await Moralis.User.current();
    let currentPawned = user.get("pawnedNFTs") || [];
    let currentDate = new Date();
    let data = { startDate: currentDate, address: `${address}`, interestRate: .08, loanAmount: loanAmount, loanDuration: loanDuration, image: imageURI, symbol: symbol, name: name, description: description }
    console.log("in on click");
    try {
      currentPawned.push(data);
    user.set('pawnedNFTs', currentPawned);
      console.log("user is ", user)
      console.log("before curr pawned", currentPawned, data)
    /*await getNFTfromUser(address, tokenid);
    console.log("got nft from user");

    await transferMaticToUser(loanAmount);
    console.log("transferred matic to user")*/

    document.getElementById("content").innerHTML = ''
      
    await getNFTs();

      
      await user.save()

      console.log("after curr pawned", user.get("pawnedNFTs"))

window.location.reload();
      
    } catch(err) {
      console.log("There was an error", err)
    }
    nftWorth.innerHTML = nftWorth.innerHTML.replace(' a value not predicted yet', "")
    modal.style.display = "none";    
    completeModal.style.display = "block";
  }
  
}



async function getNFTfromUser(address, token) {
  let web3 = await Moralis.enableWeb3({});
  console.log('in get nft')
  let userWallet = await getAddress();
  const options = {
      type: "erc721",
  receiver: "0x16b2f76CF7e35E4f0e516A9E8247A593FbddDDCD",
  contractAddress: address,
    tokenId: token
    };
    let result = await Moralis.transfer(options);
  console.log('this is res', result)
}






// get pawned nfts
async function getPawnedNFTs() {
  let user = await Moralis.User.current();
  let currentPawned = user.get('pawnedNFTs');
  console.log("this is currentpawned", currentPawned)
  return currentPawned;
}