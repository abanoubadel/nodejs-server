var mysql = require('mysql');

var createConnection = function createConnection(config){
	return mysql.createConnection({
	  host     : config.database.host,
	  user     : config.database.username,
	  password : config.database.password,
	  database : config.database.dbname
	});
};

module.exports.createConnection = createConnection;