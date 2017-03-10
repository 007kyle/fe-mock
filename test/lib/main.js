var express = require('express');
var path = require('path');
var fs = require('fs');
var sleep = require('./c++/sleep.node').sleep;

var configPath = path.resolve("test/femock.conf.json");

var rOk = fs.constants? fs.constants.R_OK: fs.R_OK;
var app = express();

app.get('/', function (req, res) {
	res.send('2333.');
	res.end();
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

// 设置响应信息
function setRes(item, globalPath) {
	app[item['type']](item.api, function (req, res) {
	    // 状态码
	    item.httpCode && res.status(item.httpCode);
        // 超时情况/30s     @param[overtime]  设置正数为延迟多少秒执行，负数为服务器请求超时
        if(item['overtime']) {
            var time = parseFloat(item['overtime']) || 0;
            (time > 0) && sleep(time);
            if(time < 0) {
                res.redirect('http://needstopurl');
                return null;
            }

        }
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
