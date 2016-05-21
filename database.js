/*
	@name: Database Module
	@description: Establish connection with MySql database.
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
*/
var mysql = require('mysql');
/* _conf is a global variable */
var CONFIGURATION = _conf;

/*
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
	@description: Create connection with database credentials, return connection object. 
	@return: MySql connection object
*/
var createConnection = function createConnection() {
	return mysql.createConnection({
		host: CONFIGURATION.database.host,
		user: CONFIGURATION.database.username,
		password: CONFIGURATION.database.password,
		database: CONFIGURATION.database.dbname
	});
};

module.exports.createConnection = createConnection;