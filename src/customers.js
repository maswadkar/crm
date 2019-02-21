var express = require('express');
var mongoClient  = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var coll = 'customer';
var mydb='crm';
var cursor;

var router = express.Router()


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
  })

// Connect to the db
mongoClient.connect('mongodb://mongodb-11:27017', {useNewUrlParser:true}, function(err, client) {
  if(!err) {
    cursor = client.db(mydb).collection(coll);
  }
});

// define the home page route
router.get('/',function(req,res){
        cursor.find(req.query).toArray(function(err,documents){
        res.json({customers:documents})});
});

router.post('/customers',function(req,res){
    cursor.insertOne(req.body,function(err,result){
        if(err){res.json(err)}
        else(res.json({inserted_id:result.insertedId}));
    });
});


router.delete('/customers',function(req,res){
    cursor.deleteOne(req.query,function(err,result){
        if(!err){res.json({result:result})}
    });
});

module.exports = router;
