var unirest = require('unirest');
var config = require('./../config');
var JSONbig = require('json-bigint');
var logger = require('../utils/logger');


function getCommand(command, callback){
  var docerlyUrl = config.docerlyUrl;
  var authorization = config.authorization;

  var Request = unirest.get(docerlyUrl + command);
  logger.info("Doctrly command =>" + command + " starts...");

  // Call Doctrly using command and url
  doctrly_request = Request
      .headers({
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': authorization
      });

  doctrly_request.send();
  doctrly_request.end(function(response) {

    logger.info(command + ' status: ' + response.status);
    var payload = JSONbig.parse(response.raw_body);

    if (response.status != 200){
      return callback(response.status, payload);
    }

    return callback(null, payload); // response.body);
  });
}

function postCommand(){
  logger.info("doing post command");
}


exports.api = function(restCommand, command, callback){

  if (restCommand === 'GET'){
    return getCommand(command, callback);
  }
  // var docerlyUrl = config.docerlyUrl;
  // var authorization = config.authorization;
  //
  // var Request = unirest.get(docerlyUrl + command);
  // logger.info("Doctrly command =>" + command + " starts...");
  //
  // if (restCommand === "GET"){
  //   getCommand(command);
  // }
  //
  // // Call Doctrly using command and url
  // doctrly_request = Request
  //     .headers({
  //         'Content-Type': 'application/json;charset=utf-8',
  //         'Authorization': authorization
  //     });
  //
  // doctrly_request.send();
  // doctrly_request.end(function(response) {
  //
  //   logger.info(command + ' status: ' + response.status);
  //   var payload = JSONbig.parse(response.raw_body);
  //
  //   if (response.status != 200){
  //     return callback(response.status, payload);
  //   }
  //
  //   return callback(null, payload); // response.body);
  // });
}
