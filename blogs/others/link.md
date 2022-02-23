---
title: npm link
date: 2021-02-22
sidebar: 'auto'
categories:
 - others
tags:
 - 前端
---

### 组件库开发

-   各组件项目的入口文件引入了`dist/`目录文件，因此调试代码需要先执行`npm run build`进行编译。

-   然后通过`npm link`的方式将安装在 node_modules 中的组件链接至本地项目。具体操作如下：

```bash
# 1. 通过 pwd 命令找到本地的组件目录，如：base-com 项目
pwd
# 输出如下
/users/myname/gitlab/base-com

# 2. 进入具体项目，如 H5 项目，在根目录使用 npn link 进行链接
cd /users/myname/gitlab/h5
npm link /users/myname/gitlab/base-com

# 3. 校验链接是否成功
ll node_modules/@xxx/
# 如果目录后有软连接指向符 '->' ，就说明 link 成功了
base-com -> ../../../../../.nvm/versions/node/v10.19.0/lib/node_modules/@xxx/base-com
```

-   这样在每次修改代码以后，重新 build，对应的项目就可以自动更新依赖的代码了。