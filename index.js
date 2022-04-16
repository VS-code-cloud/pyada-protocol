var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var ejs = require("ejs");

let eth = require("./backend/quote-price-eth.js")
let other = require("./backend/quote-price-other.js")

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use('/static', express.static('static'))
app.use('/vendor', express.static('vendor'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render("index.html", {})
})

app.get('/dashboard', (req, res) => {
  res.render("dashboard.html", 
    {privateKey: process.env['privateKey']
  })
})

app.get('/api/getQuotePrice', async (req, res) => {
  address = req.query.address;
  token = req.query.token;
  chain = req.query.chain ? req.query.chain : "eth";
  console.log('addr, token:', address, ', ', token)
  try {
    if (chain === "eth")
      value = await eth.quotePrice(address, token);
    else
      value = await other.quotePrice(address, token);
    console.log('got quote',value)
    res.send({'quote': value})
  } catch (error) {
    console.log("Error",error)
  }
})


app.listen(8080, () => {
  console.log('server started');
});
