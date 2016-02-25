var express = require('express');
var router = express.Router();
var pg = require('pg');


router.get('/', function(req, res, next) {

});

module.exports = router;




/*

GET ‘/’ - shows all resources
GET ‘/new’ - shows new create new resource page
POST ‘/new’ - creates individual
GET ‘/:id’ - shows individual resource
GET ‘/:id/edit’ - shows edit page of individual resource
PUT ‘/:id’ - updates individual resource
DELETE ‘/:id’ - removes resource

*/