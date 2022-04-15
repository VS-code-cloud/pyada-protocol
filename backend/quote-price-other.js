const serverUrl = "https://gox0zhxekxir.usemoralis.com:2053/server";
const appId = "1Wc4e9uFtXxdvJj3HvnN7irm6hrYAwei0znBZUka";
var Moralis = require('moralis/node');

Moralis.start({ serverUrl, appId });

exports.quotePrice = async (chain, address, token) => {
  
  return 0.000001;

}