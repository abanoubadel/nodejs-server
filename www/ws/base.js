var util = require('util');
var events = require('events');

var helper = require('../../helper');
var logger = require('../../logger');

var POST = function POST(request){
	var post = new events.EventEmitter();
	var body = '';
	request.on('data', function(chunk){ 
		body += chunk;
	});
	request.on('end', function(){
		var qs = require('querystring');
		post.emit('data', qs.parse(body));
	});
	return post;
};

var GET = function GET(request){
	return require('url').parse(request.url, true).query;
};

var self = module.exports = {
	POST: POST,
	GET: GET
};