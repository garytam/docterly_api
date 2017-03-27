var express = require('express');
var config = require('../config');
var doctrly = require('../doctrly');
var path = require('path');
var logger = require('../utils/logger');
var mongodb = require('../mongodb');

var patientRoute = express.Router();
var thisFile = path.basename(__filename);

var REST_GET = config.REST_GET;
var REST_POST = config.REST_POST;

// ************************ //
// get all patients         //
// ************************ //
patientRoute.get('/:tenantId/patients', function(req, res) {
  tenantId = req.params.tenantId;
  var loggerMessage = thisFile + " get ALL patients for tenantId (" + tenantId + ")";
  logger.debug(loggerMessage + " starts...");
  var allPatients = `/${tenantId}/patients`;

  doctrly.api(REST_GET, allPatients, (err, result) => {

    if(err) {
      logger.error(loggerMessage + " failed, error => " + err);
      res.json({error: JSON.stringify(err)})
    } else if(result){
      logger.info(loggerMessage + " completed");
      res.json({result: result})
    }

  });
});

// ************************ //
// get single patient       //
// ************************ //
patientRoute.get('/:tenantId/patients/:id', function(req, res) {
  var patientsId = req.params.id;
  var tenantId = req.params.tenantId; //tenant01
  var loggerMessage = thisFile + " get patients ( " + patientsId + ") for tenantId (" + tenantId + ")";

  logger.info(loggerMessage + " starts...");

  // fetch from mongo cache first
  var mongoPayload = { "collection": "patients",
                       "id": patientsId};

  // var document = null;
  logger.info("*** check if record exists in MongoDB");

  mongodb.mongoFindById(mongoPayload, function(err, document){

    // document = mongoDocuments;
    logger.info(loggerMessage + " - Found " + document.length + " Document" );

    // Document not exists in Mongo, need to call Doctrly API
    if (document.length == 0){

      var singlePatient = `/${tenantId}/patients/${patientsId}`;
      doctrly.api(REST_GET, singlePatient, (err, result) => {

        if(err) {
          logger.error(loggerMessage + " failed, error => " + err);
          res.json({error: JSON.stringify(err)})
        } else if(result){

          // insert record into mongoDB
          mongoPayload = { "collection": "patients",
                           "document": result};

          mongodb.mongoInsert(mongoPayload, function(err, insertResult){
            if (err){
              logger.info("inserted into Mongo failed err = " + err);
            }
            logger.info(loggerMessage + " completed");
            res.json({result: result})
          });

          // logger.info(loggerMessage + " completed");
          // res.json({result: result})
        }
      });
    } else {
      res.json({result: document});
    }
  });

});


// ************************ //
// create single patient    //
// ************************ //
patientRoute.post('/:tenantId/patients', function(req, res) {
  patientsId = req.params.id;
  tenantId = req.params.tenantId; //tenant01
  var loggerMessage = thisFile + " get patients ( " + patientsId + ") for tenantId (" + tenantId + ")";

  logger.info(loggerMessage + " starts...");
  var post_patient = `/${tenantId}/patients`;

  doctrly.api(REST_POST, post_patient, (err, result) => {

    if(err) {
      logger.error(loggerMessage + " failed, error => " + err);
      res.json({error: JSON.stringify(err)})
    } else if(result){
      logger.info(loggerMessage + " completed");
      res.json({result: result})
    }
  });
});

module.exports = patientRoute
