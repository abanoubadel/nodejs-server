var events = require('events');
var fs = require('fs');
var xml2js = require('xml2js');

var config = new events.EventEmitter();
var parser = new xml2js.Parser({explicitArray : false});

fs.readFile(__dirname + '/config.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
    	config.emit('loaded', result.server);
    });
});

module.exports = config;