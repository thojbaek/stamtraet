var express = require('express');

var personsEndpoints = require('./lib/rest/persons.js');

var app = express();
var admin = express();

admin.all('*', requireAuthentication, loadUser);

admin.get('/', function (req, res) {
	var myPath = path.resolve(__dirname, "../private/admin.html");
	fs.readFile(myPath,
		function (err, data) {
			res.writeHead(200);
			res.end(data);
		});
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin);
app.use('/personer', personsEndpoints);

app.get('/', function(req, res) {
	var myPath = path.resolve(__dirname, "../private/index.html");
	fs.readFile(myPath,
		function (err, data) {
			res.writeHead(200);
			res.end(data);
		});
});

console.log("running");

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});