# IOT平台

## 项目
http://192.168.37.5/web/env-manager-front

前端git地址: http://192.168.37.5/web/env-manager-front.git dev分支

访问地址:http://192.168.37.16:9999 
服务器: 192.168.37.16 
采用nginx 部署 
播放器 采用 ckplayer swf 部署在nginx 上 需要启用静态目录访问
图标采用iconfont symbol 图标(infore-iot)
mysql数据库:manager

项目主要为iot的基本配置 
* 数据字典的配置 五遥量配置 基本库 配置库的配置
* 区域管理
* 站点设备管理 站点拷贝 设备拷贝等
* 设备协议导入 
* rtmp 视频流播放 1 4 9画面切换
* 用户管理 角色管理 api数据权限管理 菜单管理 角色菜单 角色数据管理等
* 告警管理等
* 视频管理 摄像头样式管理等



项目运行打包 依赖node
node v6.11.3 LTS 版本 
下载地址:
https://nodejs.org/en/

兼容 node V8 (升级v重新安装npm 包依赖 )




## bash

``` bash

# 安装依赖 /Install dependencies
npm install --registry=https://registry.npm.taobao.org

# 安装失败可以采用cnpm 或yarn 阿里npm镜像 https://npm.taobao.org/

> npm install -g cnpm --registry=https://registry.npm.taobao.org
> cnpm install 
或采用yarn安装
> yarn install 


npm install -g http-server
# 开发环境 localhost:9999
npm run dev

# 生产环境打包
npm run build


## 项目结构参考:
```
build webpack的相关配置 请勿随意修改
   |--build.js build 文件
   |--check-version文件
   |--dev-server 开发服务器
   |--webpack.base.conf.js 基本配置 
   |--webpack.dev.conf.js  开发配置
   |--webpack.prod.conf.js 生产配置

.src 程序代码
|--core
    |--api api接口
      |-- advanced 基本请求
    |--assets 样式资源目录 css资源 图片 字体 第三方库 主题等
    |--components 组件 公用组件 和自定义组件 业务组件
    |--mock mockjs 模拟数据接口
    |--router 路由配置
      --index.js 路由和组件的配置
    |--store  全局数据状态管理
       |--modules 各个模块
       |--index.js 数据状态出口文件
       |--actions 动作 可以使异步函数等
       |--getters 全局状态输出文件 vuex getters
    |--styles 全局样式文件 
    |--utils 工具类 请求拦截 其他的一些工具类
       |--fetch axios 请求拦截
       |--validate 正则校验等
       |--index 其他一些通用工具
    |--views 页面 可以根据不同的模块逻辑划分不同的页面
       |--login 登录界面
       |--advanced 高级设置
       |--general 基本设置
       |--geteway 网关设置
       |--home-alarm 告警管理
       |--home-data-analysis 数据分析
       |--home-monitoring 实时监控
       |--ipcs 视频管理
       |--layout 布局管理
       |--user 用户管理

    App.vue 程序根组件
    config.js 全局配置
    directives.js 
    event-bus.js 全局事件 
    global.js  全局医用
    filters.js 全局filters 用于格式化字段 如时间日期的格式化等 价格的格式化等
    global.js 全局函数 方便各个地方使用
    main.js 程序入口
--favicon.ico favicon图标
--package.json 文件
--README.md 说明文件
  


