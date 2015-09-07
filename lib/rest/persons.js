var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.json());

var model = require('../mongo_model.js');


/* http://www.restapitutorial.com/lessons/httpmethods.html */

var doAuth = function( cookie ) {
	if(cookie) {
		return { uname: "uname" };
	}
	return null;
}

/* POST opret ny person */
router.post('/', function(req, res) {
	var auth = doAuth(req.cookies.auth);
	if(auth !== null) { 
		var pers = req.body.person;

		var bruger = auth.uname;
		model.nyPerson(pers, bruger, function(err, p) {
			if(err) {
				res.writeHead(500);
				res.send("Kunne ikke oprette person " + err);
			} else {
				var id = p._id;
				res.writeHead(201);
				res.send(req.path + "/" + id);
			}
		});
		res.send('Opret person med nyt id');
	}
});

/* GET alle personer */
router.get('/', function(req, res) { 
	res.send('Alle personer blev anmodet');
});

/* GET enkelt person data */
router.get('/:id', function(req, res) {
	var id = req.params.id;
	res.writeHead(200);
	res.send('Person med id = ' + id + ' anmodet');
});

/* PUT / update en enkelt person */
router.put('/:id', function( req, res ) {
	var id = req.params.id;
	var person = req.body.person;
	model.opdaterPerson(id, person, function(err) {
		if(err) {
			res.writeHead(500);
			res.send("Update error " + err);
		} else {
			res.writeHead(200);
			res.send("Update person med id = " + id);
		}
	});
});

/* PUT image into person */
router.put('/:id/billede', function( req, res ) {
	var id = req.params.id;
	var file = req.query.file;
	model.tilfoejBillede( id, file, function( err, nyPers ) {
		if(err) {
			res.writeHead(500);
			res.send(err);
		} else {
			res.writeHead(200);
			res.send(JSON.stringify(pers);
		}
	});
})

/* DELETE en enkelt person */
router.delete('/:id', function( req, res ) {
	var id = req.params.id;
	res.writeHead(200);
	res.send("Delete person med id = " + id);
})