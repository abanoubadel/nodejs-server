var events = require('events');
var mysql = require('mysql');
var database = require('../../database');
var logger = require('../../logger');

var mysqlQuery = new events.EventEmitter();

var self = module.exports = {
	/* 
		empty array : this will include model variables (Database columns)
		ex: ['id', 'name', 'email' }]
	 */
	fields: [],
	/* model database table name */
	table: null,
	/*
		@author: abanoub adel [abanoub.adel@spimesenselabs.com]
		@description: Perform Select * query to model table, fires query event when success
		@return: { EventEmitter }
	 */
	findAll: function findAll() {
		var db = database.createConnection();
		var sqlObject = db.query(`SELECT * from ${self.table}`, function(error, rows, fields) {
			logger.log('debug', sqlObject.sql);

			if (error) {
				logger.log('error', 'Error executing sql statment ' + error);
				helper.loadErrorPage(response, 500, 'Internal server error');
				return false;
			}

			logger.log('trace', JSON.stringify(rows));

			db.end();
			mysqlQuery.emit('query', rows);
		});
		return mysqlQuery;
	},
	/*
		@author: abanoub adel [abanoub.adel@spimesenselabs.com]
		@description: Save giving object (POST) to database, fires done event when success
		@param: { POST object }
		@return: { EventEmitter or false }
	*/
	save: function save(object) {
		object = self.validate(object);
		if (object) {
			var db = database.createConnection();
			var sqlObject = db.query(`INSERT INTO ${self.table} set ?`, object, function(error, result) {
				logger.log('debug', sqlObject.sql);

				if (error) {
					logger.log('error', 'Error executing sql statment ' + error);
					helper.loadErrorPage(response, 500, 'Internal server error');
					return false;
				}

				logger.log('trace', JSON.stringify(result));

				db.end();
				/* fires done event : success inserted new row to database */
				mysqlQuery.emit('done', result);
			});
			return mysqlQuery;
		} else {
			return false;
		}
	},
	/*
		@author: abanoub adel [abanoub.adel@spimesenselabs.com]
		@description: Check giving object parameters (POST object) with model fields (Defiend in 'fields' parameter), if success return new filtered object (because the POST object may contain other fields that are not important and it will cause database query fail) 
		@param: { POST object }
		@return: { Object or false }
	 */
	validate: function validate(object) {
		var newObject = {};
		/* loop through model variables array 'fields' */
		for (var i = 0; i < self.fields.length; ++i) {
			/* check if the giving object has model variables */
			if (object.hasOwnProperty(self.fields[i])) {
				/* copy variable to new object */
				newObject[self.fields[i]] = object[self.fields[i]];
			} else {
				return false;
			}
		}
		return newObject;
	},
};