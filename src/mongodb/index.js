var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var config = require('../config');
var logger = require('../utils/logger');

var url = config.mongo_url;

function insertDocument(db, payload, callback){
  logger.info("insert document");

  collection = payload.collection;
  document = payload.document;
  docId = document["id"]

  logger.debug("docId ==> " + docId);
  logger.debug("collection = " + collection);

  document["_id"] = docId.toString();
  document["id"] = docId.toString();
  document["cached_datetime"] = new Date();
  document["organization_id"] = document["organization_id"].toString()

  db.collection(collection).insertOne(document, function(err, result) {
    assert.equal(err, null);
    if (err){
      callback(err);
      return;
    }

    callback(null, result);
    return;
  });

};
function insertMongoData(payload, callback){

  MongoClient.connect(url, function(err, db){

    console.log("Connected to Mongo");

    logger.info("insert document");

    collection = payload.collection;
    document = payload.document;
    docId = document["id"]

    logger.debug("docId ==> " + docId);
    logger.debug("collection = " + collection);

    document["_id"] = docId.toString();
    document["id"] = docId.toString();
    document["cached_datetime"] = new Date();
    document["organization_id"] = document["organization_id"].toString()

    db.collection(collection).insertOne(document, function(err, result) {
      assert.equal(err, null);
      if (err){
        callback(err);
        return;
      }

      callback(null, result);
      return;
    });

  });
};

exports.mongoInsert = function(payload, callback){
  logger.debug("Mongo insert document ");

  MongoClient.connect(url, function(err, db){

    logger.debug("Connected to Mongo");

    collection = payload.collection;
    document = payload.document;
    docId = document["id"]

    logger.debug("docId ==> " + docId);
    logger.debug("collection = " + collection);

    document["_id"] = docId.toString();
    document["id"] = docId.toString();
    document["cached_datetime"] = new Date();

    if (document["organization_id"])
      document["organization_id"] = document["organization_id"].toString()

    db.collection(collection).insertOne(document, function(err, result) {
      assert.equal(err, null);
      if (err){
        callback(err);
      } else {
        callback(null, result);
        return;
      }
    });

  });
}

exports.mongoFindById = function(payload, callback){

  logger.debug("Mongo find by ID => ", payload);

  MongoClient.connect(url, function(err, db){

    if (err){
      logger.error("Error connecting to MongoDB");
      callback(err);
      return;
    }

    var collection = payload.collection;
    var id = payload.id;
    var mongoCollection = db.collection(collection);

    mongoCollection.find({"id": id}).toArray(function(err, result){

      db.close();

      if (err) {
        logger.error(err);
        callback(err);
        return;
      }

      if (result.length) {
        callback(null, result);
        return;
      };

      logger.info('No document(s) found for id (' + id + ')');
      callback(null, []);
    });

  });
}
