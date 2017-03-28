var express = require('express');
var router  = express.Router();

var auth          = require('./auth.js');
var organizations = require('./organization_routes.js');
var patients      = require('./patient_routes.js');

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

router.get('/api/v1/:tenantid/organizations', organizations.getAll);
router.get('/api/v1/:tenantid/organizations/:id', organizations.getOne);

router.get('/api/v1/:tenantid/patients', patients.getAll);
router.get('/api/v1/:tenantid/patients/:id', patients.getOne);

module.exports = router;
