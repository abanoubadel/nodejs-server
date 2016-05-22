var ws = require('./base.js');
var helper = require('../../helper');
var model = require('../model/users');

var index = function index(response, request) {
	var get = ws.GET(request);
	console.log(get);
	if (get.hasOwnProperty('id') && get['id'] >= 0) {
		var findUser = model.findById(get['id']);

		findUser.once('query', function(user) {
			console.log(user);
			helper.render(response, 'users', 'user', {
				'pageTitle': 'User Page',
				'user': user
			});
		});

		findUser.once('error', function(error) {
			helper.loadErrorPage(response, 404, error.message);
		});

	} else {
		model.findAll().once('query', function(users) {
			helper.render(response, 'users', 'index', {
				'pageTitle': 'Users Page',
				'users': users
			});
		});
	}
};

var create = function create(response, request) {
	var post = ws.POST(request);
	post.once('data', function(body) {
		var save = model.save(body)
		if (save) {
			save.once('done', function(result) {
				response.end('user added');
			});
		} else {
			response.end('object not saved!');
		}
	});
};

module.exports.dispatch = {
	'GET': index,
	'POST': create,
	'PUT': null,
	'DELETE': null
};