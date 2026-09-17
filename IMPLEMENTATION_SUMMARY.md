# 本次对话改进总结

本文档按“用户提示 -> 对应做法”的形式，记录本次对话中完成的所有功能改进。

## 1. 项目工时累计

### 用户提示

> 这个data中的project的值不同,该怎么收集某类项目的累积时间hours

### 对应做法

- 在 `Home.vue` 中按照 `project` 对数据分组。
- 使用 `reduce` 累加相同项目的 `hours`。
- 生成 `projectHours` 计算属性。
- 在页面中展示各项目的累计工时。
- 同时修复了原文件中孤立的 `const` 语法错误。

核心逻辑：

```ts
const projectHours = computed(() => data.reduce<Record<string, number>>((totals, item) => {
  totals[item.project] = (totals[item.project] ?? 0) + item.hours
  return totals
}, {}))
```

## 2. Pinia、登录路由、删除联动和图表

### 用户提示

> 将柱状图的横坐标动态渲染所有的projectname,值也是响应式的,把data数据存入pinia中实现响应式数据,给删除按钮绑定事件实现功能:删除目标后,更新图表,更新树状图,更新store,最后实现路由"/"为登录页,"/home"为table和树状图展示页,其中table和树状图在同一行,不需要太复杂的css属性,只要完成基础功能即可

### 对应做法

- 安装并注册 `pinia`。
- 新增 `src/stores/project.ts`：
  - 定义 `Person` 类型。
  - 保存成员数据。
  - 提供 `removePerson(id)` 删除 action。
- 将 `Home.vue` 的静态 `data` 改为读取 Pinia store。
- 使用计算属性按项目累计 `hours`。
- 柱状图的横坐标动态读取项目名称。
- 删除按钮调用 `projectStore.removePerson(record.id)`。
- 删除后让表格和图表从响应式 store 自动更新。
- 新增 `src/components/Login.vue` 登录页。
- 配置路由：
  - `/` 显示登录页。
  - `/home` 显示数据页。
- 登录用户名为 `admin` 时保存 `role = admin`，否则保存 `role = user`。
- 登录成功后跳转 `/home`。
- 初始版本曾实现表格和树状图同排展示。

## 3. 根据后续视觉调整修改页面

### 用户提示

> 1.图片一中右侧内容不需要  
> 2.当用户不是"role"的时候就不渲染options表头即那一列  
> 3.关于图片二,x轴没有把每个projectname都渲染出来

### 对应做法

- 移除了右侧树状图及其 ECharts 实例。
- `Options` 列改为计算属性：
  - 管理员显示 `Options` 列和删除按钮。
  - 普通用户不渲染表头，也不渲染整列。
- 柱状图横坐标增加：

```ts
axisLabel: {
  interval: 0,
  rotate: 25,
}
```

- 增加图表底部空间，避免项目名称被截断或重叠。

## 4. 删除后 ID 重排和最终布局

### 用户提示

> 实现:1.当管理员删除成员时,其他表格元素的id都减1,2.把table和柱状图使用flex放在同一行

### 对应做法

- 修改 Pinia store 的 `removePerson`：
  - 先删除目标成员。
  - 再按照剩余数组顺序重新生成连续 ID。
  - ID 保持三位格式，例如 `001`、`002`、`003`。
- 例如删除 `002` 后，原来的 `003`、`004` 会变成 `002`、`003`。
- 在 `Home.vue` 中将表格和柱状图放入同一个 `.content-row`。
- 使用基础 flex 布局：

```css
.content-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.project-table,
.bar-chart {
  width: 50%;
  height: 360px;
}
```

## 5. 最终文件职责

| 文件 | 最终职责 |
| --- | --- |
| `src/stores/project.ts` | Pinia store、成员数据、删除和 ID 重排 |
| `src/components/Login.vue` | 登录表单、角色保存和跳转 `/home` |
| `src/components/Home.vue` | 成员表格、权限控制、删除按钮、项目工时柱状图 |
| `src/router/index.ts` | 配置 `/` 和 `/home` 路由 |
| `src/main.ts` | 注册 Pinia、Vue Router 和 Ant Design Vue |
| `src/App.vue` | 提供 `RouterView` 路由出口 |
| `IMPLEMENTATION_SUMMARY.md` | 保存本次对话的改进记录 |

## 6. 最终功能状态

- `/` 是登录页。
- `/home` 是数据展示页。
- 管理员可以删除成员。
- 普通用户不显示 `Options` 列。
- 删除成员后，剩余成员 ID 自动连续编号。
- 表格和柱状图使用 flex 放在同一行。
- 柱状图横坐标动态显示所有项目名称。
- 柱状图显示每个项目累计工时。
- 删除数据后，Pinia、表格和柱状图保持响应式同步。
- 页面销毁时会清理 ECharts 实例和窗口 resize 监听。

## 7. 验证结果

已执行并通过：

```bash
npm run type-check
npm run build
```

构建过程中仅存在 ECharts 打包体积较大的提示，不影响当前功能。
