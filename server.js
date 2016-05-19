var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var util = require('util');
//
var configuration = require('./config');
var routes = require('./routes');
var logger = require('./logger');
var helper = require('./helper');

configuration.on('loaded', function(config){

	logger.log('debug', 'Configuration file loaded ', config);
	logger.log('trace', 'config.xml ' + JSON.stringify(config), config);

	http.createServer(function(request, response){
		var requestedUrl = url.parse(request.url);
		// map request url to file through routes object
		// for more info check routes.js
		var route = routes[requestedUrl.path];

		logger.log('info', request.method +  ' request from ' + request.connection.remoteAddress + ' to ' + request.url, config);

		if( route ){
			logger.log('debug', 'Loading route ', config);
			logger.log('trace', 'route ' + route, config);

			var fileAbsolutePath = config.rootPath + route;

			logger.log('trace', 'File ' + fileAbsolutePath, config);

			var fileExtention = path.extname(fileAbsolutePath);
			if(isStaticPage(fileExtention)){
				// loadStaticPage(response, fileAbsolutePath);

				fs.readFile(fileAbsolutePath, function(error, data){
					if(error){
						helper.loadErrorPage(response, 404, 'Page not found!', config);
					}else{
						response.writeHead(200, { 'Content-Type': 'text/html' });
						response.end(data);

						logger.log('trace', 'Server response "' + data + '"', config);

						logger.log('info', 'static page '+ fileAbsolutePath + ' loaded.', config);
					}
				});

			}else{
				// loadWebService(response, request, fileAbsolutePath, config);

				var ws = require(fileAbsolutePath);
				if(ws.dispatch[request.method] instanceof Function){
					ws.dispatch[request.method](response, request, config);
					logger.log('info', 'web service '+ fileAbsolutePath + ' loaded.', config);
				}else{
					helper.loadErrorPage(response, 404, 'Service not found!', config);
				}


			}
		}else{
			logger.log('debug', 'Route not found', config);
			helper.loadErrorPage(response, 404, 'Page not found! ' + request.url, config);
		}

	}).listen(config.port, config.host, function(error){
		console.log(error);
		logger.log('info', `Server started at http://${config.host}:${config.port}/`, config);

	}).on('error', function(error){
		logger.log('error', 'Error starting server code "' + error.code + '" ' + error.message, config);
	});
});

var isStaticPage = function isStaticPage(fileExtention){
	if(fileExtention == '.html')
		return true;
	else
		return false;
};