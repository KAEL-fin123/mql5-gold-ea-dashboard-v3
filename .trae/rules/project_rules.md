- **前端框架**：Next.js 15 + React 19
- **样式**：TailwindCSS + Lucide Icons
- **数据库**：Supabase (PostgreSQL)
- **状态管理**：Zustand + React Query
- **表单处理**：React Hook Form + Zod
- **图表**：Recharts
- **部署**：Vercel
- **自动化**：GitHub MCP
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rllpuaybvztqqqhnvaok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTY1NjUsImV4cCI6MjA2NDk3MjU2NX0.5EnMZmgmPDVtMsh-qjlgDQ5oSvlOrjQt-0FLn7JSfYo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHB1YXlidnp0cXFxaG52YW9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM5NjU2NSwiZXhwIjoyMDY0OTcyNTY1fQ.mpFtW2irZyeDaaUwKPixIC5EalJBhbaxr7qGUaIKCuE

# Admin Configuration
ADMIN_SECRET_KEY=mql5-gold-admin-2025

# GitHub MCP 配置
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repository_name
GITHUB_BRANCH=main
{
  "on_ai_response": "若AI返回为代码或涉及项目文件改动",
  "then_generate": {
    "message": "是否将本次操作记录入文档或更新到项目变更日志？\n\n修改文件：{{filename}}\n\n说明：{{change_summary}}",
    "actions": ["确认写入", "放弃", "稍后处理"]
  },
  "on_user_confirm": {
    "then": "写入文档变更记录 + 更新文件结构索引"
  }
}
