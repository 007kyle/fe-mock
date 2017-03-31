/**
 * 发送响应内容
 * Created by kyle on 2017/3/29.
 */
var fs = require('fs');
var path = require('path');
var request = require('urllib-sync').request;

var randomJson = require('randomjson');
var excuteScript = require('./excuteScript');
var sleep = require('./sleep.node').sleep;

/**
 *
 * 错误状态返回
 * @param httpCode  状态码
 * @param globalConfig    主配置数据
 * @param res       响应对象
 * @returns {boolean}   是否已发送数据
 */
function sendStatus(httpCode, globalConfig, res) {
    if(!httpCode) {
        return 0;
    }
    // 存在httpCode 才设置状态
    res.status(httpCode);
    var status = {
        "404": {
            "ret": 404,
            "retMsg": "url is not found."
        },
        "500": {
            "ret": 500,
            "retMsg": "request is error."
        }
    }
    var sended = !1;
    for(var code in status) {
        // 已配置返回内容则发送配置，否 则发送默认值
        if(code == httpCode) {
            var sendCode =
                globalConfig["exceptionStatus"]
                    ? (globalConfig["exceptionStatus"][code] || status[code])
                    : status[code];
            res.send(sendCode);
            sended = !0;
            break;
        }
    }
    return sended;
}

/**
 * 超时/延时处理
 * @param ms        毫秒，负数为请求中断，0不作任何处理
 * @param res       响应对象
 * @returns {boolean}   是否已发送数据
 */
function sendTimeout(ms, res) {
    if(typeof ms != "number") {
        return !1;
    }
    if(ms < 0) {
        res.redirect('http://needstopurl');
        return !0;
    }
    else if(ms > 0) {
        sleep(ms);
        return !1;
    }
}

/**
 * 匹配条件
 * @param config
 * @param globalConfig
 * @param req
 * @param res
 * @returns {boolean}   是否已发送数据
 */
function pickCondition(config, globalConfig, req, res) {
    var sended = !1;
    // 默认逻辑判断表达式的环境是get中query对象
    var context = req.query;
    // 非GET请求，逻辑判断表达式的context取req的body对象
    (config.type.toUpperCase() !== 'GET') && (context = req.body);
    // 执行逻辑表达式，如果执行失败或者未配置，返回默认的json数据
    if (Array.isArray(config.ifArr) && config.ifArr.length > 0) {
        // 遍历表达式条件
        sended = config.ifArr.some(function (item, index) {
            var condition = item['ifState'];
            var jsonPath = item['returnJson'];
            // 验证表达式是否成立
            if (condition && excuteScript(context, condition)) {
                var responseJson = getJson(jsonPath, globalConfig.dataDir);
                if(typeof responseJson == "object") {
                    // 发送JSON
                    res.send(randomJson(responseJson));
                    return !0;
                }
            }
        });
    }
    return sended;
}

/**
 * 获得JSON数据对象   本地项目内/网络链接
 * @param jsonPath  json资源路径
 * @param dataDir   本地数据目录
 * @returns {any}
 */
function getJson(jsonPath, dataDir) {
    if(jsonPath.match("http:") || jsonPath.match("https:")) {
        var jsonObj = {};
        var requestObj = request(jsonPath);
        jsonObj = JSON.parse(requestObj);
        return jsonObj;
    } else {
        var jsonPath = path.join(process.cwd(), dataDir, jsonPath);
        jsonObj = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        console.log(jsonPath);
        return jsonObj;
    }
}

/**
 * 发送响应信息
 * @param config
 * @param globalConfig
 * @param req
 * @param res
 */
function sendResponse(config, globalConfig, req, res) {
    var sended = false;
    // 是否返回错误状态（404、500等）
    !sended && (sended = sendStatus(config.httpCode, globalConfig, res));
    // 是否进行延时或断开连接处理
    !sended && (sended = sendTimeout(config.timeout, res));
    // 通过请求参数匹配ifArr对应JSON
    !sended && (sended = pickCondition(config, globalConfig, req, res));
    // 返回默认json
    !sended && res.send(getJson(config.defaultJson, globalConfig.dataDir));
    res.end();
}

module.exports = sendResponse;
