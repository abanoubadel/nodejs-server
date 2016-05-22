/*
	@name: Logger Module
	@description: 
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
*/

var CONFIGURATION = _conf;

module.exports = {
	log: function log(type, message) {
		var colors = {
			'red': '\x1b[31m',
			'green': '\x1b[32m',
			'yellow': '\x1b[33m',
			'blue': '\x1b[34m',
			'magenta': '\x1b[35m',
			'cyan': '\x1b[36m',
			'reset': '\x1b[0m'
		};

		var level = 0;
		var levelColor = null;

		switch (type) {
			case 'error':
				level = 1;
				levelColor = colors.red;
				break;
			case 'warning':
				level = 2;
				levelColor = colors.yellow;
				break;
			case 'info':
				level = 3;
				levelColor = colors.blue;
				break;
			case 'debug':
				level = 4;
				levelColor = colors.green;
				break;
			case 'trace':
				level = 5;
				levelColor = colors.magenta;
				break;
		}

		var coloredLog = `${colors.cyan}${new Date()}${colors.reset} ${levelColor}[${type}]${colors.reset}: ${message}`;
		var normalLog = `${new Date()} [${type}]: ${message}\n`;

		var fs = require('fs');

		if (CONFIGURATION.log.level >= level) {

			var promise = new Promise(function(resolve, reject) {
				// read current log filename from hidden file '.log'
				fs.readFile(CONFIGURATION.log.path + '.log', 'utf8', function(error, data) {
					if (error) {
						// hidden file '.log' does not exist
						// let's create a new one with initial value 'log.1'
						data = 'log.1';
						fs.writeFile(CONFIGURATION.log.path + '.log', data, {
							'flag': 'w'
						}, function(err) {
							if (err) return console.log(err);
						});
					}
					resolve(data);
				});
			}).then(function(file) {
				return new Promise(function(resolve, reject) {
					fs.stat(CONFIGURATION.log.path + file, function(error, stats) {
						if (error && error.code == 'ENOENT') {
							// there is no any log file yet
						} else {
							// log file exist, let's check it's size
							// console.log(stats);
							if (stats.size >= (CONFIGURATION.log.maxSize * 1024)) {
								// current log file exceded limit, let's compress it
								var gzipme = require('gzipme');
								gzipme(CONFIGURATION.log.path + file);
								// generate new log filename
								file = 'log.' + (Number(file.split(".")[1]) + 1);
								// write new log filename to the hidden file '.log'
								fs.writeFile(CONFIGURATION.log.path + '.log', file, {
									'flag': 'w'
								}, function(err) {
									if (err) return console.log(err);
								});
							}
						}
						resolve(file);
					});
				});
			}).then(function(file) {
				// create or append log data to log file
				fs.writeFile(CONFIGURATION.log.path + file, normalLog, {
					'flag': 'a'
				}, function(err) {
					if (err) return console.log(err);
				});
			});

			// display colored log at current console screen
			console.log(coloredLog);
		}
	},
};