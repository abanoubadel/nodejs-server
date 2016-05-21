/*
	@name: Routes Module
	@description: Map url to specific file, used for routing urls to webservices or static files
	@author: abanoub adel [abanoub.adel@spimesenselabs.com]
	@return: { object }
*/
module.exports = {
	'/': 'index.html',
	'/users': 'ws/users.js',
	'/users/new': 'ws/users.js',
};