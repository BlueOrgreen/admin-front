<div align="center"> 
<br> 
<h1> Nest Admin </h1>
</div>

## 简介

Admin Front， 是一个个人风格的全栈项目，前端基于 React 18、Vite、Ant Design 和 TypeScript 构建，后端使用 NestJS 开发：[Admin Api](https://github.com/BlueOrgreen/admin-api)


## 特性

- 使用 **React 18 hooks** 进行构建
- 基于 **Rsbuild** 进行快速开发和热模块替换
- 集成 **Ant Design5**，提供丰富的 UI 组件和设计模式
- 使用 **TypeScript** 编写，提供类型安全性和更好的开发体验
- 使用 **Node.js** 流行框架 **NestJS** 集成后端 [Admin Api](https://github.com/BlueOrgreen/admin-api)，提供数据服务
- 集成常见的后台管理功能，如用户管理、角色管理、菜单管理、地区管理等
- 集成国际化支持，轻松切换多语言
- 可定制的主题和样式，使用 **TailwindCSS** 原子化操作按需使用
- 灵活的路由配置，支持多级嵌套路由
- 使用 **Zustand** 进行状态管理
- 使用 **React-Query** 进行数据获取


## 快速开始


### 安装依赖

在项目根目录下运行以下命令安装项目依赖：

项目使用 `volta` 控制 `pnpm`版本 

```bash
pnpm install
```

### 启动开发服务器

运行以下命令以启动开发服务器：

```bash
pnpm run start
```

### 构建生产版本

运行以下命令以构建生产版本：

```bash
pnpm build
```

构建后的文件将位于 `dist` 目录中。


## useQuery

1. `useMutation` 是 `React Query` 中处理数据修改的强大工具，通过它你可以轻松管理复杂的异步状态，实现乐观更新，并保持客户端与服务器数据的同步。

(乐观更新是一种前端优化技术，它在向服务器发送修改请求时，先假设请求会成功，立即在客户端更新UI，而不是等待服务器响应。如果后续请求失败，则回滚到之前的状态。)

**适用场景**

- 实时性要求高的应用：如聊天、协作工具
- 网络条件良好时：成功率高的操作
- 用户操作频繁时：如拖拽排序、快速点击

`React Query` 通过 `useMutation` 的 `onMutate`、`onError` 和 `onSettled` 回调实现乐观更新

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  // 步骤1：变异前立即更新本地缓存
  onMutate: async (newTodo) => {
    // 取消正在进行的查询，防止覆盖我们的乐观更新
    await queryClient.cancelQueries(['todos'])
    
    // 保存当前数据以便回滚
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // 乐观更新
    queryClient.setQueryData(['todos'], (old) => 
      old.map(todo => todo.id === newTodo.id ? newTodo : todo)
    )
    
    return { previousTodos } // 回滚上下文
  },
  // 步骤2：出错时回滚
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  // 步骤3：无论成功失败，最终重新验证数据
  onSettled: () => {
    queryClient.invalidateQueries(['todos'])
  }
})
```




#### 学习积累

函数

flattenTrees