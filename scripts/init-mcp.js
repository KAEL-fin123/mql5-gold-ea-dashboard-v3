const { initializeGitHubMCP } = require('../src/lib/mcp-client');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config({ path: '.env.local' });

async function initializeMCP() {
  console.log('开始初始化 MCP 服务...');
  
  try {
    // 检查必要的环境变量
    if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
      console.warn('警告: GITHUB_PERSONAL_ACCESS_TOKEN 环境变量未设置');
      console.log('请在 .env.local 文件中添加您的 GitHub Personal Access Token');
      return;
    }

    if (!process.env.GITHUB_OWNER) {
      console.warn('警告: GITHUB_OWNER 环境变量未设置');
      console.log('请在 .env.local 文件中添加您的 GitHub 用户名或组织名');
      return;
    }

    if (!process.env.GITHUB_REPO) {
      console.warn('警告: GITHUB_REPO 环境变量未设置');
      console.log('请在 .env.local 文件中添加您的 GitHub 仓库名');
      return;
    }
    
    // 初始化 GitHub MCP
    await initializeGitHubMCP();
    
    console.log('✅ MCP 服务初始化完成');
    console.log('GitHub MCP 已就绪，可以自动创建 Issues');
    
  } catch (error) {
    console.error('❌ MCP 初始化失败:', error.message);
    console.log('\n请检查以下配置:');
    console.log('1. GitHub Personal Access Token 是否有效');
    console.log('2. Token 是否有 repo 权限');
    console.log('3. 网络连接是否正常');
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initializeMCP();
}

module.exports = { initializeMCP };