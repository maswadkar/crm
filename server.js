const express = require('express');
const mongoClient  = require('mongodb').MongoClient;
const bodyParser = require('body-parser');


var coll = 'customer';
var mydb='crm';
var cursor;


app = express();




app.listen(8800)
app.use(bodyParser.json());


app.get('/ping',function(req,res){res.send('Pinging hallo world')});

// Connect to the db
mongoClient.connect('mongodb://mongodb-11:27017', {useNewUrlParser:true}, function(err, client) {
  if(!err) {
    cursor = client.db(mydb).collection(coll);
  }
});

app.get('/customers',function(req,res){
        cursor.find(req.query).toArray(function(err,documents){
        res.json({customers:documents})});
});

app.post('/customers',function(req,res){
    cursor.insertOne(req.body,function(err,result){
        if(err){res.json(err)}
        else(res.json({inserted_id:result.insertedId}));
    });
});


app.delete('/customers',function(req,res){
    cursor.deleteOne(req.query,function(err,result){
        if(!err){res.json({result:result})}
    });
});


