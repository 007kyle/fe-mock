var nodemon = require('nodemon');
var path = require('path');

var mainScript = path.join(__dirname, 'main.js');
module.exports = function () {
	nodemon({
	    script: mainScript,
	    verbose: true,
	    ignore: [],
	    execMap: {
	        js: 'node'
	    }
	}).on('restart', function (files) {
	    // console.log('json data hasChange: %files', files);
	    console.log(1);
	}).on('start', function () {
		debugger;
		console.log('start 9999999999999999999999')
	});
} 

