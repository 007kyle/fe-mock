/**
 * express服务入口文件
 */
var express = require('express');
var path = require('path');
var fs = require('fs');

var rOk = fs.constants? fs.constants.R_OK: fs.R_OK;
var app = express();
var configPath = path.resolve("femock.conf.json");
var send = require("./send");

// 验证主配置文件已建立
fs.access(configPath, rOk, function (err) {
	if (err) {
		throw new Error('when you use fe-mock,you must create a file called femock.conf.json in the project root directory');
	}
	else {
		// 读取主配置文件
		fs.readFile(configPath, "utf-8", function(err, userConfig) {
			var globalConfig = JSON.parse(userConfig);
			if(typeof globalConfig.confDir != "string") {
				throw new Error("femock.conf.json:configDir can't be null");
			}
			// 配置文件目录
			var configDir = globalConfig.confDir;
			// 配置文件列表
			var configList = fs.readdirSync(configDir);
			var configArray = [];
			// 读取文件内容并加入路由
			configList.forEach(function (item, index) {
				var config = JSON.parse(
					fs.readFileSync(configDir + item, 'utf-8')
				);
				setRes(config, globalConfig);
			});
			// 启动MOCK数据服务
			startSever(globalConfig.port);
		});
	}
}.bind(this));

// 设置mock路由
function setRes(config, globalConfig) {
	app[config.type](config.api, function (req, res) {
		// 根据配置和请求参数返回内容
		send(config, globalConfig, req, res);
	});
}
// 启动mock服务器
function startSever(port) {
	app.get('/', function (req, res) {
		res.send('fe-mock is working!');
		res.end();
	});
	app.listen(port, function () {
		console.log('fe-mock server is listening on port %d !', port);
	});
}
