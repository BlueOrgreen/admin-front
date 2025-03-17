<div align="center"> 
<br> 
<h1> Nest Admin </h1>
</div>

## 简介

Admin Front， 是一个个人风格的全栈项目，前端基于 React 18、Vite、Ant Design 和 TypeScript 构建，后端使用 NestJS 开发：[Prune Api](https://github.com/BlueOrgreen/admin-api)


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