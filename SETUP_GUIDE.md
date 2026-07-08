# 公众号文章摘要系统 - 环境配置指南

## 第一部分：腾讯云服务器购买与配置

### 1.1 购买腾讯云轻量应用服务器

#### 步骤 1：访问购买页面
1. 打开浏览器，访问：https://cloud.tencent.com/product/lighthouse
2. 点击「立即购买」按钮
3. 使用微信或 QQ 扫码登录

#### 步骤 2：选择配置
- **地域**：选择离你最近的地区（推荐：广州、上海、北京）
- **镜像**：选择 **Ubuntu 22.04 LTS**
- **套餐**：选择 **2核2G** 配置（约 ¥50/月，新用户有优惠）
- **时长**：建议先选 1 个月测试

#### 步骤 3：完成购买
1. 勾选「我已阅读并同意《腾讯云服务协议》」
2. 点击「立即购买」
3. 完成支付

### 1.2 初始化服务器配置

#### 步骤 1：重置密码
1. 进入腾讯云控制台：https://console.cloud.tencent.com/lighthouse
2. 找到你刚购买的服务器，点击进入详情页
3. 点击右上角「更多操作」→「重置密码」
4. 设置一个强密码（建议：大小写字母+数字+符号，至少 12 位）
   - ⚠️ **重要**：记录这个密码，后续 SSH 登录需要用到

#### 步骤 2：开放防火墙端口
1. 在服务器详情页，点击「防火墙」标签
2. 点击「添加规则」
3. 添加以下规则：
   - 协议：TCP
   - 端口：4000
   - 策略：允许
   - 备注：WeWe RSS 服务
4. 点击「确定」保存

#### 步骤 3：获取服务器 IP
- 在服务器详情页的「实例信息」中找到「公网 IP」
- ⚠️ **重要**：记录这个 IP 地址，后续需要用到

### 1.3 SSH 登录服务器

#### Windows 用户
1. 按 `Win + R`，输入 `cmd`，回车打开命令提示符
2. 输入命令（替换为你的服务器 IP）：
   ```bash
   ssh root@你的服务器IP
   ```
3. 输入 `yes` 确认连接
4. 输入你在步骤 1.2 设置的密码

#### Mac/Linux 用户
1. 打开终端
2. 输入命令（替换为你的服务器 IP）：
   ```bash
   ssh root@你的服务器IP
   ```
3. 输入 `yes` 确认连接
4. 输入你在步骤 1.2 设置的密码

---

## 第二部分：部署 WeWe RSS 服务

### 2.1 安装 Docker

SSH 登录到服务器后，执行以下命令：

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装 docker-compose
sudo apt install docker-compose -y

# 验证安装
docker --version
docker-compose --version
```

### 2.2 部署 WeWe RSS

#### 步骤 1：创建配置目录
```bash
mkdir -p ~/wewe-rss && cd ~/wewe-rss
```

#### 步骤 2：创建 docker-compose.yml 文件

⚠️ **重要**：请先修改以下配置中的两个地方：
- `你的服务器IP` → 替换为你的实际服务器 IP
- `设置访问密码` → 设置一个安全的密码（用于保护 WeWe RSS 管理界面）

```bash
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
```

#### 步骤 3：启动服务
```bash
docker-compose up -d
```

#### 步骤 4：验证服务
```bash
# 检查容器是否正常运行
docker ps

# 查看日志（如有问题）
docker logs wewe-rss
```

### 2.3 登录 WeWe RSS 并添加订阅

#### 步骤 1：访问 WeW RSS 管理界面
1. 在本地浏览器中访问：`http://你的服务器IP:4000`
2. 输入你设置的访问密码登录

#### 步骤 2：微信读书扫码登录
1. 点击「微信读书登录」
2. 使用微信扫码登录你的微信读书账号
3. 登录成功后，页面会显示「已登录」状态

#### 步骤 3：添加公众号订阅
1. 在 WeWe RSS 界面中，点击「添加订阅」
2. 搜索你想订阅的公众号名称
3. 点击「订阅」按钮
4. 订阅成功后，点击公众号名称进入详情页
5. 在详情页找到「RSS 地址」，点击复制

⚠️ **重要**：记录这个 RSS 地址，后续需要用到

#### 步骤 4：测试 RSS 地址
在浏览器中访问你复制的 RSS 地址，应该能看到 XML 格式的文章列表

---

## 第三部分：配置 Supabase 数据库

### 3.1 注册 Supabase 账号并创建项目

#### 步骤 1：注册账号
1. 访问：https://supabase.com
2. 点击「Start your project」
3. 使用 GitHub 账号登录（推荐）或邮箱注册

#### 步骤 2：创建项目
1. 登录后，点击「New Project」
2. 填写项目信息：
   - **Name**：`wechat-articles`（或你喜欢的名字）
   - **Database Password**：设置一个强密码
     - ⚠️ **重要**：记录这个密码
   - **Region**：选择离你最近的区域（推荐：Northeast Asia (Tokyo)）
3. 点击「Create new project」
4. 等待项目创建完成（约 2 分钟）

#### 步骤 3：获取 API 密钥
1. 项目创建完成后，点击左侧菜单「Settings」（齿轮图标）
2. 点击「API」
3. 找到以下信息并记录：
   - **Project URL**：`https://xxx.supabase.co`
   - **anon public key**：以 `eyJ` 开头的长字符串
   - **service_role key**：以 `eyJ` 开头的长字符串
     - ⚠️ **重要**：service_role key 有完全权限，务必保密

### 3.2 创建数据表

#### 步骤 1：打开 SQL Editor
1. 在 Supabase 项目界面，点击左侧菜单「SQL Editor」
2. 点击「New query」

#### 步骤 2：创建订阅表
复制并执行以下 SQL：

```sql
-- 创建订阅表
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rss_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

点击「Run」执行。

#### 步骤 3：创建文章表
复制并执行以下 SQL：

```sql
-- 创建文章表
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

-- 创建索引以提升查询性能
CREATE INDEX idx_articles_pub_date ON articles(pub_date DESC);
CREATE INDEX idx_articles_source ON articles(source);
```

点击「Run」执行。

#### 步骤 4：添加订阅记录
1. 点击左侧菜单「Table Editor」
2. 点击 `subscriptions` 表
3. 点击「Insert」→「Insert row」
4. 填写以下字段：
   - **name**：公众号名称（例如：`润宇赛道`）
   - **rss_url**：在 WeWe RSS 中获取的 RSS 地址
   - **is_active**：勾选（默认已勾选）
5. 点击「Save」保存

#### 步骤 5：验证表创建
在 Table Editor 中，你应该看到两个表：
- `subscriptions`：至少有一条记录
- `articles`：空表（后续会自动填充）

---

## ✅ 配置完成检查清单

在继续下一步之前，请确认：

- [ ] 已购买腾讯云服务器并记录：
  - 服务器 IP：_________________
  - root 密码：_________________
  
- [ ] 已部署 WeWe RSS 并记录：
  - WeWe RSS 地址：`http://服务器IP:4000`
  - 访问密码：_________________
  - 至少添加了一个公众号订阅
  - 记录了 RSS 地址：_________________
  
- [ ] 已配置 Supabase 并记录：
  - Project URL：_________________
  - anon public key：_________________
  - service_role key：_________________
  - 已创建 `subscriptions` 和 `articles` 两张表
  - `subscriptions` 表中至少有一条记录

---

## 📝 下一步

完成以上配置后，请将以下信息提供给我：

```
WeWe RSS:
- 基础地址: http://你的服务器IP:4000
- RSS 订阅地址: (从 WeWe RSS 获取的 RSS 地址)

Supabase:
- Project URL: https://xxx.supabase.co
- anon public key: eyJ...
- service_role key: eyJ...
```

我会帮你创建项目的 `.env.local` 配置文件，并开始 Phase 2 的项目初始化工作。