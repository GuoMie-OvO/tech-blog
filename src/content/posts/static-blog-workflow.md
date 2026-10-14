---
title: 静态博客：写作、构建与发布的完整链路
author: 黎健恒
pubDatetime: 2026-10-14T00:00:00Z
description: 用 Markdown、Pagefind 和静态构建，让内容管理与网站部署各司其职。
tags: ["前端","Astro"]
featured: false
draft: false
---

## 内容与页面分开

Markdown 文件负责标题、摘要、标签和正文；Astro 负责将它们转换为网页。这种分工让文章可以通过代码编辑器或在线 CMS 管理。

## 构建才是交付物

执行 pnpm build 后，dist 中保存静态页面与资源。搜索索引也应在这一步生成，否则页面上线后搜索可能找不到文章。

## 保存之后发生什么

在线 CMS 将修改提交到 GitHub。连接仓库的 Cloudflare Pages 收到更新后安装依赖、运行构建，再发布 dist。

## 发布前检查

检查首页、文章、标签与搜索页面；确认草稿不会出现在公开结果中；检查图片路径、站点地址和 RSS。

依赖版本和构建命令应固定在仓库中，减少本地与线上环境的差异。
