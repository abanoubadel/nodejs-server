var mysql = require('mysql');
var database = require('../../database');
var helper = require('../../helper');

var findAll = function findAll(response, request, config){
	console.log(database);
	var db = database.createConnection(config);
	db.query('SELECT * from users', function(error, rows, fields) {
		if (error){
			helper.logger(2, 'error', 'error executing sql statment ' + error);
		}
		response.end(JSON.stringify(rows));
	});
	db.end();
};

var create = function create(response, request, config){
	var body = '';
	request.on('data', function(chunk){ 
		body += chunk 
	});
	request.on('end', function(){
		var qs = require('querystring');
		var postObject = qs.parse(body);
		var db = database.createConnection(config);
		db.query('INSERT INTO users set ?', postObject, function(error, result) {
			if(error){
				helper.loadErrorPage(response, 500, 'Internal server error');
				helper.logger(2, 'error', 'error executing sql statment ' + error);
			}else{
				response.end(JSON.stringify(result));
			}
		});
		db.end();
	});
};

module.exports.dispatch = {
	'GET'	: findAll,
	'POST'	: create,
	'PUT'	: null,
	'DELETE': null
};