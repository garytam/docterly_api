var express = require('express');
var config = require('./src/config');
var app = express();
var patientRoute = require('./src/routes/patient_routes.js')
var organizationRoute = require('./src/routes/organization_routes.js');
var bodyParser = require('body-parser');
var logger = require('./src/utils/logger');

var PORT = process.env.PORT || config.port;

app.use('/api_v1', patientRoute);
app.use('/api_v1', organizationRoute);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// app.get('/patients', function(req, res){
//   res.send("here in patients");
// })


app.listen(PORT, function(){
  logger.info("Doctrly API started on port " + PORT);
})
