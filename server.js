/* require core modules */
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var util = require('util');
/* require custom modules */
var configuration = require('./config');
var routes = require('./routes');
var logger = null;
var helper = null;
/* 
	Configuration event: fires when config.xml file loaded
	check config.js for more details
*/
configuration.once('loaded', function(CONFIGURATION) {
	/* set global configuration */
	global._conf = CONFIGURATION;

	logger = require('./logger');
	helper = require('./helper');

	logger.log('debug', 'Configuration file loaded ');
	logger.log('trace', 'config.xml ' + JSON.stringify(CONFIGURATION));

	/*
		Load memory array
	 */
	var memoryArray = require('./memoryarray')

	memoryArray.load().once('loaded', function(data) {
		/* memory array has been loaded */
		logger.log('debug', 'Memory Array loaded ');
		logger.log('trace', util.inspect(data));
	});

	http.createServer(function(request, response) {
		/* get requested url */
		var requestedUrl = url.parse(request.url);
		var pathName = requestedUrl.pathname

		/* construct corresponding route file path */
		var fileAbsolutePath = CONFIGURATION.rootPath + requestedUrl.pathname;

		/* get file extention */
		var fileExtention = path.extname(fileAbsolutePath);

		if (isStaticPage(fileExtention)) {
			/* read static file '.html' */
			fs.readFile(fileAbsolutePath, function(error, data) {
				if (error) {
					/* static file does not exist */
					helper.loadErrorPage(response, 404, 'Page not found!');
				} else {
					/* set response content-type */
					response.writeHead(200, {
						'Content-Type': 'text/html'
					});
					/* set response data */
					response.end(data);

					logger.log('trace', 'Server response "' + data + '"');
					logger.log('info', 'static page ' + fileAbsolutePath + ' loaded.');
				}
			});
			return;
		}
		/* 
			if requested url has '/' at the end, remove it.
		*/

		if (pathName.charAt(pathName.length - 1) == '/') {
			pathName = pathName.substring(0, pathName.length - 1);
		}
		/* 
			map requested url to file through routes object
			check routes.js for more details 
		*/
		var route = routes[pathName];

		logger.log('info', request.method + ' request from ' + request.connection.remoteAddress + ' to ' + request.url);

		if (route) {
			/* route found in routes object */
			logger.log('debug', 'Loading route ');
			logger.log('trace', 'route ' + route);
			/* construct corresponding route file path */
			fileAbsolutePath = CONFIGURATION.rootPath + route;

			logger.log('trace', 'File ' + fileAbsolutePath);

			/* get file extention */
			fileExtention = path.extname(fileAbsolutePath);

			if (isStaticPage(fileExtention)) {
				/* read static file '.html' */
				fs.readFile(fileAbsolutePath, function(error, data) {
					if (error) {
						/* static file does not exist */
						helper.loadErrorPage(response, 404, 'Page not found!');
					} else {
						/* set response content-type */
						response.writeHead(200, {
							'Content-Type': 'text/html'
						});
						/* set response data */
						response.end(data);

						logger.log('trace', 'Server response "' + data + '"');
						logger.log('info', 'static page ' + fileAbsolutePath + ' loaded.');
					}
				});
				return;
			}

			if (isWebService(fileExtention)) {
				/* load web service file '.js' */
				var ws = require(fileAbsolutePath);
				/* check request method in webservice dispatcher */
				if (ws.dispatch[request.method] instanceof Function) {
					/* execute webservice based on request method through dispatcher */
					ws.dispatch[request.method](response, request);

					logger.log('info', 'web service ' + fileAbsolutePath + ' loaded.');
				} else {
					/* webservice can't handle that type of request */
					helper.loadErrorPage(response, 404, 'Service not found!');
				}
				return;
			}

		} else {
			/* route was not found in routes object */
			logger.log('debug', 'Route not found');
			helper.loadErrorPage(response, 404, 'Page not found! ' + request.url);
		}

	}).listen(CONFIGURATION.port, CONFIGURATION.host, function(error) {
		/* 
			Server listen event : fires when server starts 
		*/
		logger.log('info', `Server started at http://${CONFIGURATION.host}:${CONFIGURATION.port}/`);
	}).on('error', function(error) {
		/* 
			Server error event : fires when server fails to start
		*/
		logger.log('error', 'Error starting server code "' + error.code + '" ' + error.message);
	});
});
/*
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
	@description: check specified file whether it's static file or not based on file extention.
	@param: { file Extenstion }
	@return: { true or false }
*/
var isStaticPage = function isStaticPage(fileExtention) {
	if (fileExtention.match(/\.(html|css|png|jpeg|jpg|gif)$/i))
		return true;
	else
		return false;
};

/*
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
	@description: check specified file whether it's web service or not based on file extention.
	@param: { file Extenstion }
	@return: { true or false }
*/
var isWebService = function isWebService(fileExtention) {
	if (fileExtention.match(/\.(js)$/i))
		return true;
	else
		return false;
};