var express = require('express');
var config = require('../config');
var doctrly = require('../doctrly');
var path = require('path');
var logger = require('../utils/logger');

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
  var all_patient = `/${tenantId}/patients`;

  doctrly.api(REST_GET, all_patient, (err, result) => {

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
  patients_id = req.params.id;
  tenantId = req.params.tenantId; //tenant01
  var loggerMessage = thisFile + " get patients ( " + patients_id + ") for tenantId (" + tenantId + ")";

  logger.info(loggerMessage + " starts...");
  var single_patient = `/${tenantId}/patients/${patients_id}`;

  doctrly.api(REST_GET, single_patient, (err, result) => {

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
// create single patient    //
// ************************ //
patientRoute.post('/:tenantId/patients', function(req, res) {
  patients_id = req.params.id;
  tenantId = req.params.tenantId; //tenant01
  var loggerMessage = thisFile + " get patients ( " + patients_id + ") for tenantId (" + tenantId + ")";

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
