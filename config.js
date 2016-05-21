/*
	@name: Config Module
	@description: Load configurations from config.xml file.
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
*/
var events = require('events');
var fs = require('fs');
var xml2js = require('xml2js');
var config = new events.EventEmitter();
/* module to read xml file */
var parser = new xml2js.Parser({
	explicitArray: false
});

fs.readFile(__dirname + '/config.xml', function(err, data) {
	/* Async method to parse xml string */
	parser.parseString(data, function(err, result) {
		/* fire loaded event : configuration file has been loaded */
		config.emit('loaded', result.server);
	});
});

module.exports = config;