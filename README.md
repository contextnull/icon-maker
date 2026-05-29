# Icon Maker

一个本地图标制作器，用于搜索图标、调整颜色和画布参数，并导出 PNG 文件。

## 在线预览

[https://your-icon-maker.vercel.app/](https://your-icon-maker.vercel.app/)

## 背景

日常做原型、文档、Demo 页面或小工具时，经常需要一批风格统一、尺寸一致、背景和图标颜色可控的 PNG 图标。直接去设计工具里逐个处理会比较繁琐，在线图标站又常常需要反复下载、改色、裁切和压缩。

Icon Maker 解决的是这个轻量但高频的问题：在本地快速搜索图标，统一设置画布、背景、圆角、留白、图标颜色和导出倍率，然后直接导出可用的 PNG 文件。

## 图标来源

当前可搜索和导出的图标基于 [Central Icons](https://centralicons.com/)：项目通过本地 Vite 插件从 `centralicons.com` 拉取图标页面，解析其中的 SVG、分类和别名，再提供给前端筛选和预览。

界面里的搜索、刷新、下载、调色板等操作按钮使用的是 `lucide-react` 图标库；它主要用于应用自身的 UI 控件，不是导出图标的主要来源。

## 功能

- 从图标库加载图标并按关键词或分类筛选
- 调整图标颜色、背景、圆角、留白和大小
- 支持线性/填充样式、描边粗细和转角风格
- 按不同倍率导出 PNG

## 本地运行

```bash
npm install
npm run dev
```

启动后打开终端输出的本地地址即可使用。也可以双击 `run-local.command` 自动安装依赖并启动。

## 构建

```bash
npm run build
```
