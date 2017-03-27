var express = require('express');
var config = require('../config');
var doctrly = require('../doctrly');
var path = require('path');
var logger = require('../utils/logger');

var organizationRoute = express.Router();
var thisFile = path.basename(__filename);
var REST_GET = config.REST_GET;
var REST_POST = config.REST_POST;

// ************************ //
// get ALL Organization     //
// ************************ //
organizationRoute.get('/:tenantid/organizations', function(req, res) {
  tenantid = req.params.tenantid;
  var loggerMessage = thisFile + " get ALL organizations for tenantid (" + tenantid + ")";
  logger.debug(loggerMessage + " starts...");

  var allOrganizations = `/${tenantid}/organizations`;

  doctrly.api(REST_GET, allOrganizations, (err, result) => {

    if(err) {
      logger.error(loggerMessage + " failed, error => " + err);
      res.json({error: JSON.stringify(err)});
      return;
    }

    logger.info(loggerMessage + " completed");
    res.json({result: result})

  });
});

// ************************ //
// get single Organization  //
// ************************ //

organizationRoute.get('/:tenantid/organizations/:id', function(req, res) {
  organizationsId = req.params.id;
  tenantid = req.params.tenantid; //tenant01
  var loggerMessage = thisFile + " get organizations ( " + organizationsId + ") for tenantid (" + tenantid + ")";

  logger.info(loggerMessage + " starts...");
  var singleOrganization = `/${tenantid}/organizations/${organizationsId}`;
  doctrly.api(singleOrganization, (err, result) =>
  {
    if(err) {
      logger.error(loggerMessage + " failed, error => " + err);
      res.json({error: JSON.stringify(err)});
      return;
    };

    logger.info(loggerMessage + " completed");
    res.json({result: result})

  });
});

module.exports = organizationRoute
