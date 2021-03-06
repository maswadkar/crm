var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var coll = 'hashtags';
var mydb = 'twitter';
var cursor;

var router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


var uri = 'mongodb://twitterx.organic-farmer.in:27017'

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now())
    next()
});

// Connect to the db
mongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
    if (!err) {
        cursor = client.db(mydb).collection(coll);
    }
});

// define the home page route
router.get('/', function (req, res) {
    cursor.find(req.query).toArray(function (err, documents) {
        res.json({ twitter: documents })
    });
});

router.post('/', function (req, res) {
    cursor.insertOne(req.body, function (err, result) {
        if (err) { res.json(err) }
        else (res.json({ inserted_id: result.insertedId }));
    });
});


router.delete('/:id', function (req, res) {
    cursor.deleteOne(req.query, function (err, result) {
        if (!err) { res.json({ result: result }) }
    });
});

module.exports = router;
