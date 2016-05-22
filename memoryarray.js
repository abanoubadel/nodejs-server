/*
	@name: Memory Array Module
	@description: Execute sql queries and store the result in array.
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
*/
var events = require('events');
var database = require('./database').createConnection();
var logger = require('./logger');
var event = new events.EventEmitter();
var memoryArray = [];

var self = module.exports = {
	/*
		@description: clear memory array.
	 */
	clear: function clear() {
		memoryArray = [];
	},
	/*
		@description: Return memory array.
		@return: { array }
	 */
	get: function get() {
		return memoryArray;
	},
	/*
		@description: Async executes sql queries, store the result in memory array.
		@return: { Event }
	 */
	load: function load() {
		var sql = [
			'SELECT * FROM users',
			'SELECT * FROM topics'
		];
		self.clear();
		self.query(sql, 0);
		return event;
	},
	/* 
		@description: Recursive method to loop over sql statments, exectute them, store the result in memory array, and fires on loaded event when done.
	 */
	query: function query(sql, number) {
		if (sql.length > number) {
			var sqlObject = database.query(sql[number], function(error, rows, fields) {
				logger.log('debug', sqlObject.sql);

				if (error) {
					logger.log('error', 'Error executing sql statment ' + error);
					helper.loadErrorPage(response, 500, 'Internal server error');
					return false;
				}

				logger.log('trace', JSON.stringify(rows));

				self.add(number, rows);
				self.query(sql, ++number);
			});
		} else {
			event.emit('loaded', self.get());
			return;
		}
	},
	/*
		@description: add element to memory array.
	 */
	add: function add(key, value) {
		memoryArray[key] = value;
	}
};