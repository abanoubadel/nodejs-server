/*
	@name: Helper Module
	@description: Includes methods that most commonly used.
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
*/
var fs = require('fs');
var logger = require('./logger');
var CONFIGURATION = _conf;

module.exports = {
	loadErrorPage: function loadErrorPage(response, code, message) {
		response.writeHead(code);
		response.end(message);
		logger.log('error', 'Code error "' + code + '" ' + message);
	},
	/*
		@author: abanoub adel [abanoub.adel@spimesenselabs.com]
		@description: render views using Jade Template Engine
		@param: { 
			response: server response object
			webService: webservice name
			action: method name in that webservice
			data: sent data to view
		}
	*/
	render: function render(response, webService, action, data) {
		/* construct view file path */
		var viewName = CONFIGURATION.rootPath + 'views/' + webService + '/' + action + '.html.pug';

		logger.log('debug', 'Render view ' + viewName);
		/* require pug (AKA: Jade) Template Engine module */
		var pug = require('pug');
		/* render view */
		var func = pug.compileFile(viewName);
		/* send data to view */
		var html = func(data);
		/* send response with renderd page */
		response.end(html);

		logger.log('trace', 'Server response ' + html);
	},
};