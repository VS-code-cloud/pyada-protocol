const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
var Moralis = require('moralis/node');

Moralis.start({ serverUrl, appId });

exports.quotePrice = async (chain, address, token) => {
  chain = 'eth'
  address = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'
  token = 1
  
  let obj = {};
  let op =  { chain, address }
  let txns = await Moralis.Web3API.token.getNFTTrades(op);
  console.log("txns",txns)
  let prices = txns.result.map(i => i.price);
  var lastPrice = prices.length ? prices[0] : 0;
  if (!lastPrice) {
    throw "Cannot get sufficient price history on this NFT"
  }
  return .5*lastPrice;

}