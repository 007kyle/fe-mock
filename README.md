FE-MOCK — 前端模拟数据服务
======
### 1.Install the server
      npm install fe-mock

### 2.Add fe-mock to your project
Add the following code to the project startup file：（webpack.proxy example）

        require('fe-mock')();
        webpackDevServerConfig.proxy = {
            '/api/**': {
                target: 'http://127.0.0.1:9998'
            }
        }
        
You can use any proxy service as long as the configuration is configured into the port of 'femock.conf.json'

### 3.Add file: femock.conf.json(global config), add files: mock_conf/*.conf(interface config)
        
femock.conf.json example：

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

business.conf example：

        {
        "des": "interface of the business",
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

### 4.Start your project,visit your project or visit the mock server.
          like: npm start
