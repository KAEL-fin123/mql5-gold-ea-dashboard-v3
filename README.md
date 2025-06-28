# MQL5 Gold EA Dashboard

一个专业的黄金EA交易机器人排行榜系统，基于 Next.js 构建，集成了 Supabase 数据库和 GitHub MCP 服务。

## ✨ 功能特性

- 📊 **EA排行榜**：展示黄金EA的详细性能数据
- 📈 **数据可视化**：使用 Recharts 展示交易统计
- 💡 **用户建议**：用户可以提交EA建议，自动创建 GitHub Issues
- 🔒 **安全防护**：IP限流、数据验证、环境变量保护
- 🚀 **现代技术栈**：Next.js 15、React 19、TypeScript、TailwindCSS
- 🤖 **MCP集成**：自动化GitHub工作流程

## 🛠️ 技术栈

- **前端框架**：Next.js 15 + React 19
- **样式**：TailwindCSS + Lucide Icons
- **数据库**：Supabase (PostgreSQL)
- **状态管理**：Zustand + React Query
- **表单处理**：React Hook Form + Zod
- **图表**：Recharts
- **部署**：Vercel
- **自动化**：GitHub MCP

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd mql5-gold-ea-dashboard
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制环境变量示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置以下变量：
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# GitHub MCP 配置（可选）
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo_name

# 管理员密钥
ADMIN_SECRET_KEY=your_admin_secret
```

### 4. 数据库设置

1. 在 Supabase 控制台执行 `database/schema.sql`
2. 测试数据库连接：
   ```bash
   npm run db:test
   ```

### 5. MCP 服务配置（可选）

如需启用 GitHub 自动化功能：
```bash
npm run mcp:init
npm run mcp:test
```

详细配置请参考：[MCP_SETUP.md](./MCP_SETUP.md)

### 6. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📝 可用脚本

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run type-check   # TypeScript 类型检查

# 数据库
npm run db:setup     # 数据库设置说明
npm run db:test      # 测试数据库连接

# MCP 服务
npm run mcp:init     # 初始化 MCP 服务
npm run mcp:test     # 测试 MCP 功能
```

## 📁 项目结构

```
📦 mql5-gold-ea-dashboard/
├── 📂 src/                    # 源代码目录
│   ├── 📂 app/               # Next.js App Router
│   │   ├── 📂 api/          # API 路由
│   │   │   ├── 📂 eas/      # EA 数据 API
│   │   │   └── 📂 suggestions/ # 用户建议 API
│   │   ├── 📂 business-partnership/ # 商务合作页面
│   │   ├── 🎨 globals.css   # 全局样式
│   │   ├── 📄 layout.tsx    # 根布局
│   │   └── 📄 page.tsx      # 首页
│   ├── 📂 components/        # React 组件
│   │   ├── 📂 ui/           # 通用 UI 组件
│   │   ├── 📄 EACard.tsx    # EA 卡片组件
│   │   ├── 📄 EAChart.tsx   # EA 图表组件
│   │   ├── 📄 EADetailModal.tsx # EA 详情模态框
│   │   ├── 📄 Header.tsx    # 头部导航
│   │   ├── 📄 QueryProvider.tsx # React Query 提供者
│   │   └── 📄 SuggestionForm.tsx # 建议表单
│   ├── 📂 hooks/            # 自定义 Hooks
│   │   └── 📄 useEAs.ts     # EA 数据获取 Hook
│   └── 📂 lib/              # 工具库
│       ├── 📄 mcp-client.ts # MCP 客户端
│       ├── 📄 query-client.ts # React Query 配置
│       ├── 📄 supabase.ts   # Supabase 客户端
│       └── 📄 utils.ts      # 通用工具函数
├── 📂 docs/                  # 📚 项目文档
│   ├── 📄 README.md         # 文档目录说明
│   ├── 📄 MCP_SETUP.md      # MCP 配置指南
│   ├── 📄 PROGRESS.md       # 开发进度记录
│   └── 📄 ...               # 其他技术文档
├── 📂 tools/                 # 🛠️ 工具和脚本
│   ├── 📄 README.md         # 工具说明
│   ├── 📄 create-clean-repo.ps1 # PowerShell 脚本
│   └── 📄 fix-npm-install.ps1   # 修复脚本
├── 📂 tests/                 # 🧪 测试文件
│   ├── 📄 README.md         # 测试说明
│   ├── 📄 test-all-metrics.html # 指标测试
│   └── 📄 test-modal.html   # 模态框测试
├── 📂 config/                # ⚙️ 配置文件
│   ├── 📄 README.md         # 配置说明
│   ├── 📄 mcp.config.json   # MCP 配置
│   └── 📄 vercel-simple.json # 部署配置
├── 📂 database/              # 🗄️ 数据库文件
│   ├── 📄 schema.sql        # 数据库结构
│   └── 📄 ...               # 其他数据库脚本
├── 📂 scripts/               # 📜 Node.js 脚本
│   ├── 📄 init-mcp.js       # MCP 初始化
│   ├── 📄 test-db.js        # 数据库测试
│   └── 📄 ...               # 其他脚本
└── 📂 public/                # 🌐 静态资源
    ├── 📂 logos/            # EA Logo 文件
    └── 📄 ...               # 其他静态文件
```

## 🔧 API 端点

### EA 数据 API
```
GET /api/eas?sort=profit&year=2024&month=1
```

### 建议提交 API
```
POST /api/suggestions
{
  "eaName": "EA名称",
  "reason": "建议理由",
  "contact": "联系邮箱"
}
```

### 管理员统计 API
```
GET /api/suggestions?admin_key=your_secret
```

## 🚀 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 环境变量配置

在 Vercel 控制台添加以下环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET_KEY`
- `GITHUB_PERSONAL_ACCESS_TOKEN`（可选）
- `GITHUB_OWNER`（可选）
- `GITHUB_REPO`（可选）

## 📚 相关文档

- [MCP 集成指南](./MCP_SETUP.md) - GitHub MCP 配置详解
- [Next.js 文档](https://nextjs.org/docs) - Next.js 官方文档
- [Supabase 文档](https://supabase.com/docs) - Supabase 使用指南
- [TailwindCSS 文档](https://tailwindcss.com/docs) - 样式框架文档

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📄 许可证

MIT License
