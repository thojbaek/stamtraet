var express = require('express');

var personsEndpoints = require('./lib/rest/persons.js');

var app = express();

app.use('/personer', personsEndpoints);

