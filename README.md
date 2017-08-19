## 外卖通web-开店流程

### 开发环境
#### 启动本地服务
运行命令 `npm start`，启动本地开发服务，默认端口为8989
### 访问本地页面
http://127.0.0.1:8989/build/home/index-daily.html
> 最终build出来的页面包含daily/gray/production三个版本。发布时手动提交到java服务端或crm服务端。

#### 访问静态资源
http://127.0.0.1:8989/home/index.js
#### 模拟真实环境
实际开发中不能使用`127.0.0.1`访问，会有跨域问题。建议使用 [whistle](https://github.com/avwo/whistle) 代理转发请求，配置如下：

```
# 真实路径代理
http://daily.manage.51xianqu.com/callcenter/pages/index.html http://127.0.0.1:8989/build/home/index-daily.html 
http://daily.manage.51xianqu.com/callcenter/pages/reports.html http://127.0.0.1:8989/build/reports/index-daily.html 

# hmr代理
/^https?:\/\/daily.manage.51xianqu.com\/(.+)\/([\.0-9a-z]+)\.hot-update.(json|js)/ http://127.0.0.1:8989/$2.hot-update.$3 

# 静态资源代理
http://cdndaily.52shangou.com/customer-service/call-center_branch/daily/build/ http://127.0.0.1:8989/ 
或
在开发分支中使用相对路径。虚拟目录根路径是相对于build
```
### 发布
- 发布前修改 `package.json` 里的 `version` 字段
- npm run build
- git add ./build; git commit -m 'publish [version]'
- git push origin master
- git tag [version]
- git push origin --tags

### 目录结构
- build(构建后的文件)
- src(源码文件)
  - common(公共组件，与业务无关，后续可以抽取到组件框架里)
  - components(业务组件)
  - images(图片源文件)
  - pages(页面入口文件)
