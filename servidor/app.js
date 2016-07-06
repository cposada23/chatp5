var config = require('./config/environment');

var express = require('express');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
var io = socketio(server);

io.sockets.on('connection', newConnection);


function newConnection (socket) {
	// body...
	console.log('newConection ' + socket.id);
	socket.on('mouse',mouseMsg);

	function  mouseMsg (data) {
		socket.broadcast.emit('mouse',data);
		//console.log(data);
	}
}



server.listen(config.port, config.ip, function  () {
	console.log("servidor corriendo en el puerto "+ config.port);
});

exports = module.exports = app;