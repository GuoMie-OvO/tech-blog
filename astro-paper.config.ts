import { defineAstroPaperConfig } from "./src/types/config";
export default defineAstroPaperConfig({
  site: {
    url: process.env.SITE_URL || "https://guomie-tech-blog.pages.dev/",
    title: "GuoMie 技术博客", description: "黎健恒的技术笔记与个人作品：AI 工程、前端开发、Agent 与产品实践。",
    author: "黎健恒", profile: "https://github.com/GuoMie-OvO", ogImage: "default-og.svg",
    lang: "zh-CN", timezone: "Asia/Shanghai", dir: "ltr",
  },
  posts: { perPage: 8, perIndex: 4, scheduledPostMargin: 0 },
  features: { lightAndDarkMode: false, dynamicOgImage: false, showArchives: false, showBackButton: true,
    editPost: { enabled: false }, search: "pagefind" },
  socials: [{ name: "github", url: "https://github.com/GuoMie-OvO" }], shareLinks: [],
});
