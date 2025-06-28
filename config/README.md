# ⚙️ 配置文件目录

本目录包含项目的各种配置文件。

## 📁 文件说明

### MCP 配置
- `mcp.config.json` - Model Context Protocol 服务配置
  - GitHub MCP 服务器配置
  - 自动Issue创建功能设置

### 部署配置
- `vercel-simple.json` - Vercel简化部署配置
  - 备用部署配置文件
  - 简化的构建设置

## 🔧 配置说明

### mcp.config.json
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

### vercel-simple.json
- 简化的Vercel部署配置
- 用于快速部署和测试
- 包含基本的构建和路由设置

## 🚀 使用方法

### MCP 配置
1. 复制 `mcp.config.json` 到项目根目录
2. 配置GitHub Personal Access Token
3. 运行 `npm run mcp:init` 初始化服务

### Vercel 配置
1. 在需要时将配置文件复制到项目根目录
2. 重命名为 `vercel.json`
3. 执行部署命令

## ⚠️ 安全注意事项

- 🔐 **不要提交包含敏感信息的配置文件**
- 🔑 **使用环境变量存储API密钥**
- 📝 **定期轮换访问令牌**
- 🛡️ **限制令牌权限范围**

## 📋 配置检查清单

- [ ] MCP服务配置正确
- [ ] GitHub令牌权限充足
- [ ] 环境变量设置完整
- [ ] 部署配置验证通过
- [ ] 安全设置检查完毕