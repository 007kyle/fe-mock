FE-MOCK — 前端数据模拟服务
======
### 1.安装服务
      npm install fe-mock

### 2.将FE-MOCK加入到项目中
将以下代码加入项目启动文件中：（webpack.proxy 例）

        require('fe-mock')();
        webpackDevServerConfig.proxy = {
            '/api/**': {
                target: 'http://127.0.0.1:9998'
            }
        }
        
你可以使用任何代理服务，但映射端口必须指向femock.conf.json中的设置

### 3.添加文件: femock.conf.json（全局配置）, 添加文件组: mock_conf/*.conf（接口配置）
        
femock.conf.json 例：

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

business.conf 例：

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
            "httpCode": 500,
            "timeout": 0
        }

### 4.启动你的项目，访问你的项目或直接访问模拟数据
          npm start

参数说明/Parameter Description
------

> ### femock.conf.json
> > confDir             接口配置文件所在目录
> >                    The directory where the interface configuration file is located
> > 
> > dataDir             本地数据文件目录，全使用http网络数据可不填
> >                    Local data file directory,ignore this if you get data from internet
> > 
> > port                模拟数据服务启动端口
> >                     Analog data service startup port
> > 
> > exceptionStatus     设置异常状态时返回的数据
> 
> >                     The data returned when the exception status is set

> ### business.conf
> > des                 接口描述
> 
> >                     Interface description
> > 
> > api                 访问接口路由地址
> 
> >                     Access the interface routing address
> > 
> > type                路由请求类型
> 
> >                     Route request type
> > 
> > defaultJson         默认接口数据
> 
> >                     default data
> > 
> > ifArr               条件表达式返回数据，选填
> 
> >                     Conditional expression returns data,Optional
> > 
> > httpCode            异常状态码，选填
> 
> >                     Http status code,Optional
> > 
> > timeout             延迟返回，单位：毫秒，为负数时会请求中断
> 
> >                     Delayed return in milliseconds,a request is interrupted when it is negative

FE-MOCK — Front-end data simulation service
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
            "httpCode": 500,
            "timeout": 0
        }

### 4.Start your project,access your project or access the mock server.
          npm start
