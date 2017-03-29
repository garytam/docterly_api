var express = require('express');
var config = require('../config');
var path = require('path');
var logger = require('../utils/logger');

var patientRoute = express.Router();
var thisFile = path.basename(__filename);

var help_msg = "You must call the login first to obtain the access token \n " +
" POST http://localhost:3005/login \n\n" +
" In the body, pass in the user credentials \n" +
" {                                \n " +
"	\"username\":\"gtam@stericycle.com\", \n " +
"	\"password\":\"password\" \n " +
" } \n\n "+
" if credentials correct, you will receive a JWT and must attache to \n" +
" the header with key 'x-access-token' when making API calls \n \n ";


// ************************ //
// get single patient       //
// ************************ //
function about(req, res) {
  res.send(help_msg);
};


// ************************ //
// setup for export         //
// ************************ //
var helper = {
  about : function(req, res){
    about(req,res);
  }
}

module.exports = helper;
