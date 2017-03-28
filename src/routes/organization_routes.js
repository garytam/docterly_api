var express = require('express');
var config = require('../config');
var doctrly = require('../doctrly');
var path = require('path');
var logger = require('../utils/logger');
var mongodb = require('../mongodb');

var organizationRoute = express.Router();
var thisFile = path.basename(__filename);
var REST_GET = config.REST_GET;
var REST_POST = config.REST_POST;

// ************************ //
// get ALL Organization     //
// ************************ //
function getAllOrganizations(req, res) {
    tenantid = req.params.tenantid;
    var loggerMessage = thisFile + " get ALL organizations for tenantid (" + tenantid + ")";
    logger.debug(loggerMessage + " starts...");

    var allOrganizations = `/${tenantid}/organizations`;

    doctrly.api(REST_GET, allOrganizations, (err, result) => {

        if (err) {
            logger.error(loggerMessage + " failed, error => " + err);
            res.json({error: JSON.stringify(err)});
            return;
        }

        logger.info(loggerMessage + " completed");
        res.json({result: result})

    });
};


// ************************ //
// get ONE Organization     //
// ************************ //
function getOneOrganization(req, res) {
    organizationsId = req.params.id;
    tenantid = req.params.tenantid; //tenant01
    var loggerMessage = thisFile + " get organizations ( " + organizationsId + ") for tenantid (" + tenantid + ")";

    // var document = null;
    logger.info("*** check if record exists in MongoDB");

    var mongoPayload = {
        "collection": "organizations",
        "id": organizationsId
    };

    mongodb.mongoFindById(mongoPayload, function(err, document) {
        logger.info("Number of documents = " + document.length);

        if (document.length == 0) {
            logger.info(loggerMessage + " go to DoctrlyAPI...");
            var singleOrganization = `/${tenantid}/organizations/${organizationsId}`;
            doctrly.api(REST_GET, singleOrganization, (err, result) => {
                if (err) {
                    logger.error(loggerMessage + " failed, error => " + err);
                    res.json({error: JSON.stringify(err)});
                    return;
                } else {
                    // insert record into mongoDB
                    mongoPayload = {
                        "collection": "organizations",
                        "document": result
                    };

                    mongodb.mongoInsert(mongoPayload, function(err, insertResult) {
                        if (err) {
                            logger.info("inserted into Mongo failed err = " + err);
                        }
                        logger.info(loggerMessage + " completed");
                        res.json({result: result});
                    });
                }

            });
        } else {
            res.json({result: document});
        }
    });
};

var organizations = {
    getAll: function(req, res) {
        getAllOrganizations(req, res);
    },

    getOne: function(req, res) {
        getOneOrganization(req, res);
    }
}

module.exports = organizations;
