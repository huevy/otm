var ExpressBrute = require('express-brute');

var store = new ExpressBrute.MemoryStore();
var writeProtection = new ExpressBrute(store, {
	freeRetries: 2,
	minWait: 30 * 1000,
	maxWait: 5 * 60 * 1000,
});
var readProtection = new ExpressBrute(store, {
	freeRetries: 50,
	minWait: 30 * 1000,
	maxWait: 5 * 60 * 1000,
	lifetime: 5 * 60
});

module.exports = {
	writeProtection: writeProtection,
	readProtection: readProtection,
};