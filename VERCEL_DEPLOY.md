# Vercel 部署指南

## 部署步骤

### 步骤 1：注册 Vercel 账号

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（推荐）
3. 授权 Vercel 访问你的 GitHub

---

### 步骤 2：创建 Git 仓库

在本地项目目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 在 GitHub 创建新仓库后，添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到 GitHub
git push -u origin main
```

---

### 步骤 3：在 Vercel 导入项目

1. 登录 Vercel Dashboard：https://vercel.com/dashboard
2. 点击「Add New...」→「Project」
3. 选择你的 GitHub 仓库
4. 点击「Import」

---

### 步骤 4：配置项目

在 Import 项目页面：

| 配置项 | 值 |
|-------|-----|
| Framework Preset | Next.js（自动检测） |
| Root Directory | ./（默认） |
| Build Command | npm run build（默认） |
| Output Directory | .next（默认） |

---

### 步骤 5：配置环境变量

点击「Environment Variables」展开，添加以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://oocbfhntgwpmvkzkdbfw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY2JmaG50Z3dwbXZremtkYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Mjk0NDQsImV4cCI6MjA5OTAwNTQ0NH0.nj_UPULAUvwsEHTLGdYMMioYIV4VQptsujKR94Jsv4s
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vY2JmaG50Z3dwbXZremtkYmZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzQyOTQ0NCwiZXhwIjoyMDk5MDA1NDQ0fQ.WedajAddGFb6wXWTpg07lTyg-wKfvdBRQPwEdVU9pAE
RSSHUB_BASE_URL=http://106.54.31.49:1200
WEWE_RSS_BASE_URL=http://106.54.31.49:4000
```

⚠️ **注意**：
- 确保 Environment 选择「Production」「Preview」「Development」都勾选

---

### 步骤 6：部署

1. 点击「Deploy」按钮
2. 等待构建完成（约 1-2 分钟）
3. 看到庆祝页面表示部署成功！

---

## 部署后操作

### 获取部署地址

部署成功后，Vercel 会分配一个地址，类似：
```
https://你的项目名.vercel.app
```

### 绑定自定义域名（可选）

1. 进入项目设置 → Domains
2. 添加你的域名
3. 按提示配置 DNS

---

## 后续更新

每次推送到 GitHub，Vercel 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update"
git push
```

---

## 常见问题

### Q: 构建失败怎么办？

检查 Vercel 的 Build Logs，常见问题：
- 依赖安装失败：检查 package.json
- 环境变量缺失：确保所有变量都已配置

### Q: 如何查看日志？

项目页面 → Deployments → 点击部署记录 → Building/Logs

### Q: 如何回滚？

Deployments 页面 → 选择历史部署 → 点击「Promote to Production」

---

## 本地预览部署

在推送前可以本地预览：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 本地预览
vercel dev
```