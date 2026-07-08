# 公众号文章摘要系统 - 使用指南

## 🎉 系统已部署完成！

### 访问地址

| 页面 | 地址 |
|------|------|
| 首页 | http://localhost:3000 |
| 文章列表 | http://localhost:3000/articles |

---

## 📋 使用流程

### 1. 查看文章列表

访问 http://localhost:3000/articles，可以看到所有已抓取的文章。

### 2. 查看文章详情

点击任意文章标题，进入详情页可以看到：
- 文章完整内容
- AI 分析结果（如果已分析）
- 「复制正文」按钮

### 3. 使用 Claude Code 分析文章

**步骤：**

1. 在文章详情页，点击「📋 复制正文」按钮
2. 在 Claude Code 中输入 `/wechat-digest`
3. 粘贴文章内容
4. Claude Code 会返回 JSON 格式的分析结果

**分析结果格式：**
```json
{
  "summary": "100字左右的摘要",
  "insights": [
    {
      "point": "核心观点",
      "evidence": "支撑论据"
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
```

### 4. 保存分析结果到数据库

在 Supabase 控制台：
1. 打开 Table Editor → articles 表
2. 找到对应的文章
3. 点击「Edit」编辑
4. 在 `analysis` 字段粘贴 JSON 结果
5. 点击「Save」保存

---

## 🔧 添加新的订阅源

### 在 Supabase 中添加订阅

1. 打开 Table Editor → subscriptions 表
2. 点击「Insert」→「Insert row」
3. 填写：
   - **name**：订阅名称（如「科技新闻」）
   - **rss_url**：RSS 地址
   - **is_active**：勾选
4. 点击「Save」

### RSSHub 常用路由

| 内容 | RSS 地址 |
|------|---------|
| 微博热搜 | `/weibo/search/hot` |
| B站热门 | `/bilibili/popular` |
| GitHub 趋势 | `/github/trending/daily` |
| V2EX 最新 | `/v2ex/topics/latest` |

完整路由文档：https://docs.rsshub.app/routes

**注意**：RSS 地址需要加上你的 RSSHub 服务器地址前缀：
```
http://106.54.31.49:1200/路由路径
```

---

## 🚀 抓取新文章

### 方法 1：Web 界面

在文章列表页点击「抓取新文章」按钮。

### 方法 2：API 调用

```bash
curl -X POST http://localhost:3000/api/fetch-articles
```

---

## 🛠️ 常用命令

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm run start
```

---

## 📁 项目文件结构

```
公众号文章摘要/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页
│   │   ├── layout.tsx            # 布局
│   │   ├── globals.css           # 样式
│   │   ├── articles/
│   │   │   ├── page.tsx          # 文章列表
│   │   │   └── [id]/page.tsx     # 文章详情
│   │   └── api/
│   │   │   └── fetch-articles/route.ts  # 抓取API
│   └── lib/
│   │   ├── supabase.ts           # 数据库客户端
│   │   └── rss.ts                # RSS解析
│   └── types/index.ts            # 类型定义
├── .env.local                    # 环境变量
└── .claude/skills/wechat-digest/SKILL.md  # AI分析技能
```

---

## 📊 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   RSSHub       │────▶│   Next.js App   │────▶│    Supabase     │
│  (RSS服务)      │     │   (本地3000端口) │     │   (数据存储)     │
│  服务器:1200    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Claude Code   │
                        │  (AI 分析文章)   │
                        │  /wechat-digest │
                        └─────────────────┘
```

---

## ❓ 常见问题

### Q: 为什么抓取文章失败？

部分 RSSHub 路由需要特殊配置或有反爬虫限制。建议：
- 尝试其他可用的订阅源
- 查看 RSSHub 文档了解路由要求

### Q: 如何部署到生产环境？

1. 构建项目：`npm run build`
2. 部署到 Vercel 或其他平台
3. 配置环境变量

### Q: 如何添加微信公众号订阅？

RSSHub 对微信公众号支持有限。建议：
- 使用 WeWe RSS（需要单独部署）
- 或手动复制文章内容进行分析

---

## 🎯 下一步建议

1. **添加更多订阅源**：尝试不同的 RSS 路由
2. **优化 UI**：美化文章列表和详情页
3. **自动化分析**：开发 API 自动调用 Claude 分析
4. **部署上线**：将应用部署到云平台

---

祝你使用愉快！有问题随时问 Claude Code。