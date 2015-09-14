var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	var personSchema = new Schema({
		navn: String, 
		koen: String,
		foedt: Date,
		doed: Date,
		foedested: String,
		stilling: String, 
		mor: [{type: Schema.Types.ObjectId, ref: 'Person'}], // Link til self _id 
		far: [{type: Schema.Types.ObjectId, ref: 'Person'}], // Link til self _id 
		aegtefaelle: [{type: Schema.Types.ObjectId, ref: 'Person'}], // Link til self _id 
		text: String,
		billede: String,
		meta: {
			created: Date,
			createdBy: [{type: Schema.Types.ObjectId, ref: 'User'}] // Link til BrugerSchema
		}
	});

	var brugerSchema = new Schema({
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
		navn: personObj.navn,
		koen: personObj.koem,
		foedt: personObj.foedt,
		doed: personObj.doed,
		foedested: personObj.foedsted,
		stilling: personObj.stilling, 
		mor: personObj.mor, // Link til self _id 
		far: personObj.far, // Link til self _id 
		aegtefaelle: personObj.aegtefaelle, // Link til self _id 
		text: personObj.text,
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

exports.hentPerson = function(id, cb) {
	Person.findById(id, function(err, pers) {
		
	});
}