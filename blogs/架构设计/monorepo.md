# 背景

开映工作台原本是一个 PC 端项目，随着移动端 平板端的需求，项目面临着跨平台、跨设备的多端开发挑战。
为了应对多端协同开发的复杂性、提升开发效率，并减少后期维护的成本，决定对原有的项目架构进行升级，重构为 Monorepo 架构。

- 多端需求、功能同步： 需要支持 PC、移动端、平板端，且这些平台间有很多共享的业务逻辑和组件，独立管理多个代码仓库不仅增加了重复工作，还容易导致版本不一致、依赖冲突等问题
- 如何响应敏捷开发： Monorepo 架构能帮助团队避免模块间的重复开发，并且统一进行版本管理，提升开发效率。（不仅组件、utils 需要共享、store、server、业务级 hooks 也需要共享）
- 降低维护成本： 随着项目的迭代，旧有架构逐渐暴露出问题，如模块重复开发、资源浪费、版本不一致等，迫切需要一种高效的技术架构来管理复杂的项目结构。
- 高扩展性： 比如未来可能平板端也需要单独成一个项目，如何快速落地。

# 如何解决修改公共代码降低故障率，提高测试效率问题

- Test Impact Analysis (TIA)

1.  静态依赖分析 madge 或 rollup-plugin-visualizer

- 运行 madge 获取依赖关系：

```bash
madge --json packages/components/src > dependency-tree.json
```

2.  引入动态影响分析：结合代码逻辑
    使用 git diff 获取本次提交的所有变更：

```bash
git diff --name-only HEAD~1 HEAD

```

3. 分析 button.tsx 被哪些项目引用：确定影响范围

```js
cat dependency-tree.json | jq '."button.tsx"'

// 输出
[
  "packages/pc/src/pages/Home.tsx",
  "packages/mobile/src/pages/Welcome.tsx"
]
```

4.  进一步确定如何两个文件都引用了，但是实际只有一个文件是真正运行到了

- 根据自定义 platform 比如 platform === PC 等判断本次修改中是否有这样的字符
- 具体如何实现？？？

5.  根据 jest Cypress 代码覆盖率分析 ？？？
