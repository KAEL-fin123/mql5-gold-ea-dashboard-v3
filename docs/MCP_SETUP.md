# MCP (Model Context Protocol) 集成指南

本项目已集成 GitHub MCP 服务，可以自动将用户建议转换为 GitHub Issues。

## 🚀 功能特性

- ✅ 自动将用户建议创建为 GitHub Issues
- ✅ 包含完整的建议信息（EA名称、理由、联系方式）
- ✅ 自动标签分类
- ✅ 错误处理和日志记录
- ✅ 不影响原有建议提交流程

## 📋 前置要求

1. GitHub 账户
2. 用于存储 Issues 的 GitHub 仓库
3. GitHub Personal Access Token

## 🔧 配置步骤

### 1. 创建 GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称，如："MQL5 Dashboard MCP"
4. 选择权限：
   - ✅ `repo` - 完整的仓库访问权限
   - ✅ `write:discussion` - 写入讨论权限（可选）
5. 点击 "Generate token"
6. **重要：立即复制 Token，离开页面后将无法再次查看**

### 2. 配置环境变量

1. 复制 `.env.example` 文件为 `.env.local`：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，添加以下配置：
   ```env
   # GitHub MCP 配置
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_repository_name
   GITHUB_BRANCH=main
   ```

### 3. 初始化 MCP 服务

运行初始化脚本检查配置：
```bash
npm run mcp:init
```

如果配置正确，您将看到：
```
✅ MCP 服务初始化完成
GitHub MCP 已就绪，可以自动创建 Issues
```

### 4. 测试 MCP 功能

运行测试脚本：
```bash
npm run mcp:test
```

成功后会在您的 GitHub 仓库中创建一个测试 Issue。

## 📝 使用说明

### 自动 Issue 创建

当用户通过网站提交建议时，系统会：

1. 将建议保存到 Supabase 数据库
2. 自动在 GitHub 仓库中创建对应的 Issue
3. Issue 包含以下信息：
   - 标题：`[用户建议] EA名称`
   - 内容：建议理由和联系方式
   - 标签：`user-suggestion`, `enhancement`

### Issue 格式示例

```markdown
# 用户建议：黄金EA Pro

## 建议理由
这个EA在回测中表现优异，建议添加到排行榜中。

## 联系方式
user@example.com

## 提交信息
- 提交时间：2024-01-15 10:30:00
- IP地址：已隐藏（隐私保护）

---
*此 Issue 由 MQL5 Gold EA Dashboard 自动创建*
```

## 🛠️ 故障排除

### 常见问题

1. **Token 权限不足**
   ```
   错误：403 Forbidden
   解决：确保 Token 有 repo 权限
   ```

2. **仓库不存在**
   ```
   错误：404 Not Found
   解决：检查 GITHUB_OWNER 和 GITHUB_REPO 配置
   ```

3. **网络连接问题**
   ```
   错误：ECONNREFUSED
   解决：检查网络连接和防火墙设置
   ```

### 调试模式

在 `.env.local` 中添加：
```env
NODE_ENV=development
DEBUG=mcp:*
```

## 📊 监控和日志

### 查看日志

- 成功创建 Issue：控制台显示 "GitHub Issue 创建成功"
- 失败情况：控制台显示详细错误信息
- 不影响主要功能：即使 GitHub Issue 创建失败，用户建议仍会正常保存

### API 响应

建议提交成功后，API 会返回：
```json
{
  "success": true,
  "message": "建议提交成功，感谢您的反馈！",
  "githubIssueCreated": true
}
```

## 🔒 安全注意事项

1. **Token 安全**：
   - 不要将 Token 提交到代码仓库
   - 定期轮换 Token
   - 使用最小权限原则

2. **环境变量**：
   - 确保 `.env.local` 在 `.gitignore` 中
   - 生产环境使用环境变量而非文件

3. **IP 隐私**：
   - 系统不会在 GitHub Issue 中暴露用户 IP
   - 仅用于内部限流控制

## 🚀 高级配置

### 自定义 Issue 模板

修改 `src/lib/mcp-client.ts` 中的 `createIssueForSuggestion` 函数来自定义 Issue 格式。

### 添加更多标签

在 MCP 客户端配置中添加自定义标签：
```javascript
labels: ['user-suggestion', 'enhancement', 'auto-created']
```

### 指定 Assignees

自动分配 Issue 给特定用户：
```javascript
assignees: ['your-username']
```

## 📞 支持

如果遇到问题，请：

1. 检查环境变量配置
2. 运行 `npm run mcp:init` 验证配置
3. 查看控制台日志
4. 在项目仓库中创建 Issue

---

*最后更新：2024年1月*