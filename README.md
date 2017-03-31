1.npm install fe-mock

2.在业务项目启动文件添加：
var femock = require(‘fe-mock’);

femock();
webpackDevServerConfig.proxy = {
    '/api/**': {
        // 默认是自带的mock server， 可自行修改
        target: 'http://localhost:9998'
        // target: '10.95.27.39:8098'
    },
以上为webpack proxy配置，其他服务也是配置代理到femock.conf.json设置的端口上

3.添加femock.conf.json主配置文件 ，创建mock_conf/*.conf 每个接口创建配置文件

4.npm start 运行业务程序可查看到mock数据服务器运行效果

femock.conf.json 示例：
{
    "confDir": "mock_conf/",
    "dataDir": "mock/",
    "port": "9998",
    "exceptionStatus": {
      "404": {
         "ret": 404,
         "retMsg": "url is not found!"
      },
      "500": {
         "ret": 500,
         "retMsg": "request is error!"
      }
   }
}

business.conf 示例：
{
    "des": "业务接口",
    "api": "/api/project",
    "type": "get",
    "defaultJson": "project.json",
    "ifArr": [
        {
        "ifState": "page==2",
        "returnJson": "project2.json"
        }
    ],
    "timeout": 0
}
