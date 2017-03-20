var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var excuteScript = require('./excuteScript');

var configPath = path.resolve("femock.conf.json");

var rOk = fs.constants ? fs.constants.R_OK: fs.R_OK;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
        // 默认逻辑判断表达式的环境是get中query对象
        var context = req.query;
        // 非GET请求，逻辑判断表达式的context取req的body对象
        if (item.type.toUpperCase() !== 'GET') {
            context = req.body;
        }
        // 执行逻辑表达式，如果执行失败或者未配置，返回默认的json数据
        if (Array.isArray(item.ifArr) && item.ifArr.length > 0) {
            var response  = getJsonByLogic(context, item.ifArr, globalPath);
            if (response != null) {
                res.json(response);
            }
            else {
                res.json(getJson(item, globalPath));
            }
        }
        else {
            res.json(getJson(item, globalPath));
        }
    });
}

function getJson(item, globalPath) {
	var jsonPath = path.join(process.cwd(), globalPath, item.defaultJson);
	console.log(jsonPath);
	return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
}

/**
 * 根据接口配置的条件返回json
 *
 * @param {Object} context 执行脚本的上下文环境
 * @param {Array} logicalExpressions 接口的逻辑判断配置
 * @param {string} globalPath 全局配置
 * @return {null|Object} 如果逻辑判断结果是true则返回对应的json，否则返回null
 */
function getJsonByLogic(context, logicalExpressions, globalPath) {
    var json = null;
    for (var i = 0; i < logicalExpressions.length; i++) {
        if (logicalExpressions[i].ifState && excuteScript(context, logicalExpressions[i].ifState)) {
            var jsonPath = path.join(process.cwd(), globalPath, logicalExpressions[i].returnJson);
            json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            break;
        }
    }

    return json;
}


function startSever(port) {
    app.listen(port, function () {
        console.log('fe-mock server is listening on port %d !', port);
	});
}
