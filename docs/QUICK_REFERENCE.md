# MQL5 GOLD EA 仪表板 - 快速参考

## 🚀 快速启动

### 1. 环境检查
```bash
# 检查Node.js版本（需要18+）
node --version

# 检查项目依赖
npm list --depth=0
```

### 2. 数据库设置（首次运行必须）
1. 访问Supabase控制台: https://supabase.com/dashboard/project/rllpuaybvztqqqhnvaok/sql
2. 复制 `database/schema.sql` 文件内容
3. 在SQL编辑器中执行
4. 验证连接: `npm run db:test`

### 3. 本地开发
```bash
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run db:test      # 测试数据库连接
npm run type-check   # TypeScript检查
```

## 🔌 API端点

### EA数据API
```bash
GET /api/eas?sortBy={type}&year={year}&limit={limit}
```

**排序类型 (sortBy)**:
- `win_rate` - 胜率榜
- `drawdown` - 回撤榜
- `max_risk_reward` - 最大盈亏比榜
- `avg_risk_reward` - 平均盈亏比榜
- `annual_return` - 年化收益榜
- `monthly_return` - 月度收益榜

**参数说明**:
- `year`: 年份 (默认: 2024)
- `month`: 月份 (可选，用于月度数据)
- `limit`: 返回数量 (默认: 10)

**示例请求**:
```bash
GET /api/eas?sortBy=win_rate&year=2024&limit=10
GET /api/eas?sortBy=monthly_return&year=2024&month=12&limit=5
```

### 测试API
```bash
GET /api/test  # 简单的API连接测试
```

## 📊 数据库配置

### 环境变量 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://rllpuaybvztqqqhnvaok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_SECRET_KEY=mql5-gold-admin-2025
```

### 数据表结构
- **eas**: EA基础信息（id, name, logo_url, description）
- **ea_stats**: EA统计数据（胜率、回撤、收益等）
- **user_requests**: 用户建议提交
- **ads**: 广告配置

## 🎨 设计系统

### 主要颜色
```css
/* 金色主题 */
--primary: oklch(0.75 0.15 45);

/* 霓虹绿（成功/正向） */
--accent: oklch(0.65 0.18 162);

/* 霓虹红（错误/负向） */
--destructive: oklch(0.65 0.25 22);

/* 深色背景 */
--background: oklch(0.08 0.005 285.823);
```

### 常用样式类
```css
.financial-card     /* 金融风格卡片 */
.neon-glow         /* 霓虹发光效果 */
.gradient-text     /* 金色渐变文字 */
.ea-card          /* EA排行榜卡片 */
.ranking-tab      /* 排行榜标签 */
.metric-positive  /* 正向指标（绿色） */
.metric-negative  /* 负向指标（红色） */
.metric-neutral   /* 中性指标（金色） */
```

## 📁 关键文件路径

### 配置文件
- `src/lib/supabase.ts` - 数据库客户端配置
- `src/app/globals.css` - 全局样式和主题
- `components.json` - shadcn/ui配置
- `.env.local` - 环境变量

### 开发文件
- `src/app/page.tsx` - 首页组件
- `src/app/layout.tsx` - 根布局
- `database/schema.sql` - 数据库结构
- `scripts/test-db.js` - 数据库测试

## 🔧 开发工具

### 推荐的VS Code扩展
- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter

### 有用的命令
```bash
# 添加shadcn/ui组件
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs

# 类型检查
npm run type-check

# 构建检查
npm run build
```

## 📊 数据结构示例

### EA数据
```typescript
interface EA {
  id: string
  name: string
  logo_url?: string
  description?: string
}
```

### 统计数据
```typescript
interface EAStats {
  id: string
  ea_id: string
  year: number
  month?: number
  win_rate: number      // 胜率 (0-100)
  drawdown: number      // 最大回撤
  avg_risk_reward: number
  max_risk_reward: number
  annual_return: number
  monthly_return: number
}
```

## 🎯 榜单类型

### 6种排行榜
1. **胜率榜** (`win_rate`) - 按胜率降序
2. **回撤榜** (`drawdown`) - 按回撤升序（越小越好）
3. **最大盈亏比榜** (`max_risk_reward`) - 按最大盈亏比降序
4. **平均盈亏比榜** (`avg_risk_reward`) - 按平均盈亏比降序
5. **年化榜** (`annual_return`) - 按年化收益降序
6. **本月收益榜** (`monthly_return`) - 按月度收益降序

## 🔗 重要链接

### 开发环境
- **本地开发**: http://localhost:3000 (或 http://localhost:3001)
- **生产部署**: 🔄 Vercel自动部署 (GitHub集成)
- **Supabase控制台**: https://supabase.com/dashboard/project/rllpuaybvztqqqhnvaok
- **GitHub仓库**: https://github.com/KAEL-fin123/mql5-gold-ea-dashboard

### 版本信息
- **当前版本**: v0.2.0-phase2-complete
- **最新提交**: Phase 2 完成 - EA榜单展示系统
- **部署状态**: 自动部署已配置

### 文档资源
- **Next.js文档**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Supabase文档**: https://supabase.com/docs

## ⚠️ 常见问题

### 数据库连接失败
1. 检查 `.env.local` 文件是否存在
2. 确认Supabase URL和密钥正确
3. 运行 `npm run db:test` 诊断问题

### 样式不生效
1. 确认Tailwind CSS配置正确
2. 检查 `globals.css` 文件
3. 重启开发服务器

### TypeScript错误
1. 运行 `npm run type-check`
2. 检查类型定义文件
3. 确认导入路径正确

## 📋 开发检查清单

### 开始开发前
- [ ] 数据库表已创建
- [ ] 环境变量已配置
- [ ] `npm run db:test` 通过
- [ ] `npm run dev` 正常启动

### 提交代码前
- [ ] `npm run type-check` 无错误
- [ ] `npm run lint` 通过
- [ ] 功能测试完成
- [ ] 响应式设计检查
