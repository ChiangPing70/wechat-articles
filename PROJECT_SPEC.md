# 公众号文章 AI 摘要系统 - 项目规格说明

> 将此文件放入你的新项目根目录，让 Claude Code 帮你一步步完成开发和部署

## 项目概述

一个公众号文章 AI 摘要系统，自动抓取订阅的公众号文章，使用 AI 提炼核心观点，通过 Web 界面展示。

### 核心特点

- **零 API 费用**：使用 Claude Code 直接分析文章，无需购买 Claude API
- **手动触发**：所有操作由用户手动触发，简单可控
- **本地优先**：Web 应用运行在本地，数据存储在云端

### 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   WeWe RSS      │────▶│   Next.js App   │────▶│    Supabase     │
│  (抓取公众号)    │     │   (本地运行)     │     │   (数据存储)     │
│  部署在服务器    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Claude Code   │
                        │  (AI 分析文章)   │
                        └─────────────────┘
```

---

## 第一阶段：基础设施准备

### 1.1 部署 WeWe RSS 服务

**目标**：在云服务器上部署 WeWe RSS，将公众号转换为 RSS 源

**前置条件**：
- 一台云服务器（腾讯云轻量应用服务器，约 ¥50/月）
- 微信读书账号

**部署步骤**：

1. 购买腾讯云轻量应用服务器
   - 访问 https://cloud.tencent.com/product/lighthouse
   - 选择 Ubuntu 22.04 LTS，2核2G 配置
   - 完成购买后设置 root 密码
   - 在防火墙中开放 4000 端口

2. SSH 登录服务器安装 Docker
   ```bash
   ssh root@你的服务器IP
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://get.docker.com | sh
   sudo apt install docker-compose -y
   ```

3. 部署 WeWe RSS
   ```bash
   mkdir -p ~/wewe-rss && cd ~/wewe-rss

   cat > docker-compose.yml << 'EOF'
   version: '3'
   services:
     wewe-rss:
       image: cooderl/wewe-rss:latest
       container_name: wewe-rss
       restart: always
       ports:
         - "4000:4000"
       environment:
         - DATABASE_TYPE=sqlite
         - SERVER_ORIGIN_URL=http://你的服务器IP:4000
         - AUTH_CODE=设置访问密码
         - FEED_UPDATE_INTERVAL=30
       volumes:
         - ./data:/app/data
   EOF

   docker-compose up -d
   ```

4. 访问 `http://你的服务器IP:4000`，用微信读书扫码登录

5. 添加公众号订阅，记录生成的 RSS 地址

**完成标志**：能通过浏览器访问 WeWe RSS 并看到订阅的公众号文章列表

---

### 1.2 配置 Supabase 数据库

**目标**：创建云端数据库存储文章数据

**步骤**：

1. 访问 https://supabase.com 注册账号

2. 创建新项目，记录：
   - Project URL: `https://xxx.supabase.co`
   - anon public key
   - service_role key（保密）

3. 在 SQL Editor 中执行建表语句：
   ```sql
   -- 订阅表
   CREATE TABLE subscriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     rss_url TEXT NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- 文章表
   CREATE TABLE articles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     link TEXT NOT NULL UNIQUE,
     content TEXT,
     source TEXT,
     pub_date TIMESTAMPTZ,
     analysis JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX idx_articles_pub_date ON articles(pub_date DESC);
   CREATE INDEX idx_articles_source ON articles(source);
   ```

4. 在 Table Editor 的 subscriptions 表中添加订阅记录：
   - name: 公众号名称
   - rss_url: WeWe RSS 生成的地址
   - is_active: true

**完成标志**：Supabase 中有 subscriptions 和 articles 两张表，且 subscriptions 表有至少一条订阅记录

---

## 第二阶段：Web 应用开发

### 2.1 技术栈

- **框架**：Next.js 15 (App Router)
- **样式**：Tailwind CSS
- **数据库**：Supabase (PostgreSQL)
- **RSS 解析**：rss-parser

### 2.2 项目结构

```
项目根目录/
├── app/
│   ├── page.tsx              # 首页 - 文章列表
│   ├── layout.tsx            # 布局
│   ├── globals.css           # 全局样式
│   ├── article/
│   │   └── [id]/
│   │       └── page.tsx      # 文章详情页
│   └── api/
│       └── fetch-articles/
│           └── route.ts      # 抓取文章 API
├── lib/
│   ├── supabase.ts           # Supabase 客户端
│   └── rss.ts                # RSS 解析工具
├── components/
│   ├── ArticleCard.tsx       # 文章卡片组件
│   └── ArticleList.tsx       # 文章列表组件
├── types/
│   └── index.ts              # TypeScript 类型定义
├── .env.local                # 环境变量（不提交到 Git）
├── .env.local.example        # 环境变量示例
└── .claude/
    └── skills/
        └── wechat-digest/
            └── SKILL.md      # Claude Code 文章分析技能
```

### 2.3 环境变量

```bash
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
SUPABASE_SERVICE_KEY=你的service_role_key
WEWE_RSS_BASE_URL=http://你的服务器IP:4000
```

### 2.4 核心功能

#### 功能 1：文章列表展示

- 从 Supabase 读取文章
- 按发布时间倒序显示
- 显示标题、来源、发布时间、AI 摘要

#### 功能 2：抓取新文章 API

- 端点：`POST /api/fetch-articles`
- 从 subscriptions 表读取活跃订阅
- 解析每个 RSS 源
- 将新文章存入 articles 表（不含 analysis 字段）
- 返回抓取结果统计

#### 功能 3：文章详情页

- 显示文章完整内容
- 显示 AI 分析结果（如果有）
- 提供「复制正文」按钮，方便用户复制给 Claude Code 分析

---

## 第三阶段：Claude Code 集成

### 3.1 文章分析技能

创建 `.claude/skills/wechat-digest/SKILL.md`：

```markdown
---
name: wechat-digest
description: 公众号文章分析助手，快速提炼文章核心价值
user_invocable: true
---

# wechat-digest Skill

你是一个公众号文章分析助手。你的任务是快速提炼文章的核心价值。

## 输入
用户会提供一篇公众号文章的正文内容。

## 输出要求
严格按以下 JSON 格式输出：

\`\`\`json
{
  "summary": "100字左右的摘要",
  "insights": [
    {
      "point": "核心观点（一句话）",
      "evidence": "支撑论据（50-100字）"
    }
  ],
  "quotes": ["金句1", "金句2"],
  "newConcepts": [
    {
      "term": "新概念",
      "explanation": "解释"
    }
  ]
}
\`\`\`

## 分析原则

1. insights 数组包含文章的核心观点，按重要性排序
2. quotes 是原文中最有洞察力的句子，必须是原话
3. newConcepts 提取文章中的新兴概念或术语
4. 如果文章质量低，在 summary 中如实说明
```

### 3.2 使用流程

1. 用户在 Web 界面点击文章，进入详情页
2. 点击「复制正文」按钮
3. 在 Claude Code 中输入 `/wechat-digest`
4. 粘贴文章内容
5. Claude Code 返回 JSON 格式的分析结果
6. （可选）用户可手动将分析结果保存到 Supabase

---

## 第四阶段：便捷脚本

### 4.1 一键抓取脚本

创建 `scripts/fetch.sh`：

```bash
#!/bin/bash
cd "$(dirname "$0")/.."

# 检查服务器
check_server() {
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null
}

# 启动服务器（如果未运行）
if [ "$(check_server)" != "200" ]; then
  echo "启动开发服务器..."
  npm run dev &
  sleep 5
fi

# 抓取文章
echo "正在抓取文章..."
curl -s -X POST http://localhost:3000/api/fetch-articles | python3 -m json.tool

echo "完成时间: $(date '+%Y-%m-%d %H:%M:%S')"
```

---

## 开发计划

Claude Code 请按以下顺序帮助用户完成项目：

### Phase 1: 环境准备 [需要用户操作]
- [ ] 指导用户购买腾讯云服务器
- [ ] 指导用户 SSH 登录并部署 WeWe RSS
- [ ] 指导用户配置 Supabase 数据库
- [ ] 指导用户添加公众号订阅

### Phase 2: 项目初始化
- [ ] 创建 Next.js 项目
- [ ] 安装依赖（@supabase/supabase-js, rss-parser）
- [ ] 配置 Tailwind CSS
- [ ] 创建 .env.local.example

### Phase 3: 核心功能开发
- [ ] 实现 Supabase 客户端
- [ ] 实现 RSS 解析工具
- [ ] 实现文章抓取 API
- [ ] 实现文章列表页面
- [ ] 实现文章详情页面

### Phase 4: Claude Code 集成
- [ ] 创建 wechat-digest 技能文件
- [ ] 创建便捷抓取脚本

### Phase 5: 测试与优化
- [ ] 测试完整流程
- [ ] 优化 UI 样式
- [ ] 编写使用说明

---

## 费用估算

| 项目 | 月费用 |
|------|--------|
| 腾讯云服务器 | ¥30-50 |
| Supabase | ¥0（免费额度） |
| Claude Code | 已包含在订阅中 |
| **合计** | **约 ¥30-50/月** |

---

## 注意事项

1. **WeWe RSS 登录状态**：微信读书登录会过期，需定期检查
2. **抓取频率**：不要太频繁抓取，避免被限制
3. **数据安全**：.env.local 不要提交到 Git
4. **文章分析**：使用 Claude Code 分析，无需额外 API 费用
