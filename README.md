
# es-script-version

### 背景
想整理下JavaScript各个版本的changelog，但找了很多资料都没有一个有效的方式。ESMA规范没有找到相关变更变化，只能追踪最近的版本日志。网上其他的ES6版本中都插入了或多或少的其他版本（如阮一峰ES6）。最后想手动整理，但感觉有点多，再结合自己目前的整理方式（读MDN API，然后校对相应版本再记录），直接写了这个脚本从MDN拉数据了，然后再将其转换成MD格式即可。


### 如何做
考虑到目的，目前需要做的事情：
1. 从MDN拉取HTML文档
2. 解析相应元素，获得版本信息
3. 转换成markdown格式

找了以下三方库：
```
"cheerio": "^1.0.0-rc.3",  // 像jQuery一样获取DOM元素
"fs-extra": "^8.1.0",  // 读写文件
"superagent": "^5.1.3"  // 用于读取网页客户端
```

### 如何使用

1. 版本要求：
  * node: > v12.6.0
2. 获取代码：git clone git@github.com:iWuzhi/es-script-version.git
3. 安装依赖：npm i
4. 启动：node index

### 文件说明

1. ESMA_XXXXStore.js：从MDM拉取的原始HTML构造的JSON数据
2. ESMA_XXXXStore.md: 对应版本的目标文件(markdown格式)






