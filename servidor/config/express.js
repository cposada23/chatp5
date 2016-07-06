'use strict';
var _ = require('lodash');
var config = require('./environment');
var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');

module.exports = function  (app) {
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.use(compression());
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use('/cliente',express.static(path.join(config.root, '/cliente')));
	//bower_components/bootstrap/dist/css/bootstrap.min.css 
	app.use('/bower_components', express.static(path.join(config.root, '/bower_components')));
	app.set('appPath', 'cliente');
	app.use(morgan('dev'));
	app.use(errorHandler());

	app.use(function  (req,res,next) {
		res.setHeader('Access-Controll-Allow-Origin', '*');


		res.setHeader('Access-Controll-Allow-Methods', 'GET,POST', 'OPTIONS','PUT','DELETE');

		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, X-ACCESS_TOKEN, Authorization,Access-Control-Allow-Origin');

		res.setHeader('Access-Control-Allow-Credentials', true);

		next();
	});

};