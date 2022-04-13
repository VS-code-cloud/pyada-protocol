var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var ejs = require("ejs");

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


app.listen(8080, () => {
  console.log('server started');
});
