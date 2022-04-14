var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var ejs = require("ejs");

var { quotePrice } = require("./backend/quote-price-matic.js")

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use('/static', express.static('static'))
app.use('/vendor', express.static('vendor'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render("index.html", {})
})

app.get('/dashboard', (req, res) => {
  res.render("dashboard.html", {})
})

app.get('/api/getQuotePrice', async (req, res) => {
  address = req.query.address;
  token = req.query.token;
  console.log('addr, token:', address, ', ', token)
  try {
    value = await quotePrice(address, token);
    console.log('got quote',value)
    res.send({'quote': value})
  } catch (error) {
    console.log("Error",error)
  }
})


app.listen(8080, () => {
  console.log('server started');
});
