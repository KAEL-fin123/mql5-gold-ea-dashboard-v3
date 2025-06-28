# 🛠️ 工具和脚本目录

本目录包含项目的各种工具脚本和实用程序。

## 📁 文件说明

### PowerShell 脚本
- `create-clean-repo.ps1` - 创建干净仓库的脚本
- `fix-npm-install.ps1` - 修复npm安装问题的脚本

### JavaScript 脚本 (scripts文件夹)
- `add-missing-columns.js` - 添加缺失数据库列
- `check-table-structure.js` - 检查表结构
- `clean-babel.js` - 清理Babel配置
- `clean.js` - 项目清理脚本
- `fix-suggestion-form.js` - 修复建议表单
- `init-mcp.js` - 初始化MCP服务
- `simple-db-test.js` - 简单数据库测试
- `test-db.js` - 数据库测试
- `test-fixed-api.js` - 测试修复后的API
- `test-suggestion-api.js` - 测试建议API
- `update-database.js` - 更新数据库
- `vercel-build.js` - Vercel构建脚本

## 🚀 使用方法

### PowerShell 脚本
```powershell
# 在项目根目录执行
.\tools\script-name.ps1
```

### Node.js 脚本
```bash
# 在项目根目录执行
node scripts/script-name.js
```

## ⚠️ 注意事项

- 执行脚本前请确保已安装相关依赖
- 数据库相关脚本需要配置环境变量
- 建议在测试环境中先验证脚本功能
- 重要操作前请备份数据