var mongoose = require('mongoose');
var Scema = mongoose.Schema;

var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

var fs = require('fs');
var uuid = require('uuid');

var User;

var Person;

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	//create schemas and models
	var personSchema = new mongoose.Schema({
		navn: String, 
		koen: String,
		foedt: Date,
		doed: Date,
		foedested: String,
		stilling: String, 
		mor: ObjectId, // Link til self _id 
		far: ObjectId, // Link til self _id 
		aegtefaelle: ObjectId, // Link til self _id 
		text: String,
		billede: String,
		meta: {
			created: Date,
			createdBy: ObjectId // Link til BrugerSchema
		}
	});

	var brugerSchema = new mongoose.Schema({
		uname: String, 
		pass: String,
		role: String
	});

	User = mongoose.model('User', brugerSchema);
	Person = mongoose.model('Person', personSchema);
});

mongoose.connect('mongodb://localhost/stamtraet');

var writeFile = function( file, callback, tries ) {
	// Callback = function ( filename )
	var filId = uuid.v1();
	var filType = ".png";
	var filnavn = filId + filType;
	var gfs = Grid(db.db);
	var writestream = gfs.createWriteStream({
		filename: filnavn
	});
	fs.createReadStream(file).pipe(writestream);

	writestream.on('close', function(file) {
		callback(file.filename);
	});

	var tries = (!tries) ? 1 : tries + 1;
	if(tries < 5) {
		writestream.on('error', function(err) {
			console.error('Save file error');
			console.error(err);
			writeFile(file, callback, tries);			
		});
	}
}

exports.nyPerson = function( personObj, uname, cb) {
	new person = new Person({
		navn: p.navn,
		koen: p.koem,
		foedt: p.foedt,
		doed: p.doed,
		foedested: p.foedsted,
		stilling: p.stilling, 
		mor: p.mor, // Link til self _id 
		far: p.far, // Link til self _id 
		aegtefaelle: p,aegtefaelle, // Link til self _id 
		text: p.text,
		meta: {
			created: new Date(),
			createdBy: uname // Link til BrugerSchema
		}
	});
	person.save(function ( err, pers ) {
		if(err) {
			cb(err);
			return console.error(err);
		}
		console.dir(pers);
		cb(null, pers);
	});
}

exports.tilfoejBillede = function( persId, file, cb ) {
	writeFile(file, function( filename ) {
		Person.findByIdAndUpdate( persId,
			{ $set: { billede: filename }},
			 function (err, tank) {
				if(err) {
					cb(err);
					return console.error(err);
				}
				cb(null, pers);
			});
	});	
}

exports.fjernPerson = function( id, cb ) {
	Person.findByIdAndRemove
}