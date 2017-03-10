var express = require('express');
var path = require('path');
var fs = require('fs');

var configPath = path.resolve("femock.conf.json");

var rOk = fs.constants? fs.constants.R_OK: fs.R_OK;
var app = express();

app.get('/', function (req, res) {
    res.send('It works! ');
});
fs.access(configPath, rOk, function (err) {
	if (err) {
		throw new Error('when you use fe-mock,you must create a file called femock.conf.json in the project root directory');
	}
	else {
		fs.readFile(configPath, "utf-8", function(err, userConfig) {
			var userConfigJson = JSON.parse(userConfig);
			userConfigJson.list.forEach(function (item, index) {
				setRes(item, userConfigJson.globalPath);
			});
			startSever(userConfigJson.port);
		});
	}
}.bind(this));
function setRes(item, globalPath) {
	app[item['type']](item.api, function (req, res) {
	    res.json(getJson(item, globalPath));
	});
}
function getJson(item, globalPath) {
	var jsonPath = path.join(process.cwd(), globalPath, item.defaultJson);
	console.log(jsonPath);
	return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
}
function startSever(port) {
	app.listen(port, function () {
	    console.log('fe-mock server is listening on port %d !', port);
	});
}
