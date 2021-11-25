# DocsChina Weekly CLI

> 专注翻译，让流程化更清晰，更容易操作

### How to

- 1 安装依赖：@cliz/translate-weekly
- 2 初始化数据源：在 src 目录下建立 data.json，参考：react-status 的 src/data.json
- 3 配置 NPM scripts：参考：react-status 的 package.json
- 4 React 适配：对应 React 逻辑数据源改造，参考：react-status 的 src/pages/index.js
- 5 GitHub Action 适配：参考: react-status

### 翻译步骤

```
1. 格式化阶段
   1.1 开始：yarn lint:start
   1.2 提交：yarn lint:commit
   1.3 PR: yarn lint:pr
2. 翻译阶段
   2.1 开始：yarn translate:start
   2.2 提交：yarn translate:commit
   2.3 PR: yarn translate:pr
```

### 发布步骤（翻译无需此步骤）

```
yarn release
```
