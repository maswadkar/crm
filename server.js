var express = require('express');
var bodyParser = require('body-parser');

var PORT = 8800

app = express();

var customers = require('./src/customers')
app.use('/customers',customers);

app.listen(PORT)
app.use(bodyParser.json());


app.get('/',function(req,res){res.json({homepage:'Welcome to the homepage of CRM restful services'})});
app.get('/ping',function(req,res){res.json({message:'Pinging hallo world'})});
