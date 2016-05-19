var logger = require('./logger');

module.exports = {
	loadErrorPage : function loadErrorPage(response, code, message, config){
		response.writeHead(code);
		response.end(message);
		logger.log('error', 'Code error "' + code + '" ' + message, config);
	},
};