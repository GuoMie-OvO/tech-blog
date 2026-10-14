# GuoMie 技术博客

基于 [satnaing/astro-paper](https://github.com/satnaing/astro-paper) 官方模板，保留 MIT 许可证。中文界面、文章与标签、Pagefind 搜索、个人作品与关于页面。

## 本地构建

Node.js 24，pnpm 11.25.0。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

部署产物为 dist。构建包含类型检查与搜索索引，复制搜索资源使用 Node.js，兼容 Windows。

## Cloudflare Pages 自动部署

控制台 Workers & Pages → Create → Pages → Connect to Git，选择 GuoMie-OvO/tech-blog。

- 生产分支：main
- 构建命令：pnpm build
- 输出目录：dist
- 根目录：仓库根目录
- 环境变量：NODE_VERSION=24；PNPM_VERSION=11.25.0
- SITE_URL：填最终的 https://项目名.pages.dev/ 或自定义域名，确保 canonical、RSS 与 sitemap 一致。

保存后每次提交自动构建与部署。首次部署完成后确认网站地址并设置 SITE_URL，再重新部署。

## Pages CMS

访问 https://app.pagescms.org/，使用 GitHub 登录，仅授权 tech-blog 仓库。选择 main 分支。

根目录 .pages.yml 已配置“技术文章”“关于我”“个人作品”和图片上传。

新建文章：填写标题、摘要、发布时间、标签和正文，先保留草稿。准备发布时关闭草稿并保存。保存将写入 GitHub，Cloudflare Pages 自动更新。文件名建议使用简短英文 slug，发布后尽量不改名，避免链接变化。

图片写入 public/uploads，正文引用 /uploads/...。文章中不发布公司内部数据、私有接口、密钥、客户信息或专有源码。示例使用公开资料或合成数据。

CMS 首次登录和 GitHub App 安装需仓库所有者授权。配置文件就绪不代表已完成在线授权。

## 内容

- 文章：src/content/posts/*.md
- 关于：src/content/pages/about.md
- 作品：src/content/pages/projects.md
- 站点设置：astro-paper.config.ts

个人作品只写入用户提供的公开项目概述；完整作品集使用外部链接，不复制企业案例与内部截图。初始技术文章为可修改的通用笔记。
