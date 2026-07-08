# 公众号文章摘要系统

这是一个公众号文章 AI 摘要系统，自动抓取订阅的公众号文章，使用 AI 提炼核心观点。

## 项目结构

```
├── src/app/           # Next.js 应用
├── src/lib/           # 工具库（Supabase、RSS解析）
├── src/types/         # TypeScript 类型定义
├── .claude/skills/    # Claude Code 技能
│   └── wechat-digest/ # 公众号文章分析技能
├── .env.local         # 环境变量
└── CLAUDE.md          # 本文件
```

## 可用技能

### `/wechat-digest`

分析公众号文章，提炼核心价值。

**使用方法：**
```
/wechat-digest [文章内容]
```

**输出内容：**
- summary：100字摘要
- insights：核心观点列表（含论据）
- quotes：金句列表（1-5句）
- newConcepts：新概念列表（含解释）

## 环境配置

项目依赖以下环境变量（已在 .env.local 中配置）：
- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase 匿名密钥
- `SUPABASE_SERVICE_KEY`：Supabase 服务密钥
- `RSSHUB_BASE_URL`：RSSHub 服务地址

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 访问应用
# http://localhost:3000
```

## 服务地址

- Web 应用：http://localhost:3000
- WeWe RSS：http://106.54.31.49:4000
- RSSHub：http://106.54.31.49:1200