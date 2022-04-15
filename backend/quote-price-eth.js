const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://api.opensea.io',
  timeout: 1000,
  headers: {'Content-Type': 'application/json',
    "Accept": "application/json",
    "X-API-KEY": "619330d9fda540fcbabd4e794ea271a4"}
});

// tested on  address = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb' , token = 1

//token: 77930492900535418824665005014698243119405791409320987470910248036458458775553

// address: 0x2953399124f0cbb46d2cbacd8a89cf0599974963

exports.quotePrice = async (address, token) => {
  console.log("in quote")
  if (!address || !token) {
    //return false
    throw "No address or token specified";
  }
  let data = null;
  try {
    let resp = await instance.get('/api/v1/asset/'+address+'/'+token);
    data = resp.data;
  } catch (error) {
    console.log('This is error', error);
    throw error.reason;
    
  }
  var lastPrice = (data.last_sale) ? data.last_sale.total_price : 0;
  lastPrice /= (1000000000000000000)
  console.log("lastPrice",data)
  if (!lastPrice) {
    //return false;
    throw "This NFT doesn't qualify for pawning at this time.";
  }
  var isReputedCreator = data.collection.stats; 
  if (isReputedCreator) {
    return lastPrice*.8;
  } 
  return lastPrice*.5;
  
}