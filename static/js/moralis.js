'use strict'

/* Moralis init code */
const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
Moralis.start({ serverUrl, appId });


// Log In
function auth() {
  Moralis.authenticate({signingMessage:"Authenticate to gain access to the Pyada Protocol."}).then(() => {
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
  }).catch(err => {return "there was an error"})
  return wallet;
}


//check if url
const isUrl = (str) => {
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
  $("#content").html("<p>Items count: " + nftCount);

  if (nftCount > 0) {
    const allNFTs = await Moralis.Web3.getNFTs(options);
    console.log(allNFTs);

    allNFTs.forEach( (nft) => {
      
        fetch(nft.token_uri)
          .then(response => response.json())
          .then(data => {
            $("#content").html($("#content").html() 
              + "<div><img width='100' align='left' src='" + ((data.image).startsWith("https:") || (data.image).startsWith("http:")) ? data.image :   + "' />"
              + "<h2>" + data.name + "</h2>"
              + "<p>" + data.description + "</p></div><br clear='all' />");
          });
    });
  }
}
