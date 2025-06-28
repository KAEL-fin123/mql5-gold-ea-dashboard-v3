import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

class MCPManager {
  private clients: Map<string, Client> = new Map();

  async initializeClient(serverName: string, command: string, args: string[], env?: Record<string, string>) {
    const transport = new StdioClientTransport({
      command,
      args,
      env: {
        ...process.env,
        ...env
      }
    });

    const client = new Client({
      name: `mql5-dashboard-${serverName}`,
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await client.connect(transport);
    this.clients.set(serverName, client);
    return client;
  }

  getClient(serverName: string): Client | undefined {
    return this.clients.get(serverName);
  }

  async callTool(serverName: string, toolName: string, args: any) {
    const client = this.getClient(serverName);
    if (!client) {
      throw new Error(`MCP client '${serverName}' not initialized`);
    }

    return await client.callTool({
      name: toolName,
      arguments: args
    });
  }

  async closeAll() {
    for (const [name, client] of this.clients) {
      try {
        await client.close();
      } catch (error) {
        console.error(`Error closing MCP client ${name}:`, error);
      }
    }
    this.clients.clear();
  }
}

export const mcpManager = new MCPManager();

// GitHub MCP 集成函数
export async function createIssueForSuggestion(suggestion: {
  ea_name: string;
  reason: string;
  contact?: string;
}) {
  try {
    const result = await mcpManager.callTool('github', 'create_issue', {
      owner: process.env.GITHUB_OWNER || 'your-username',
      repo: process.env.GITHUB_REPO || 'mql5-gold-ea-dashboard',
      title: `新 EA 建议: ${suggestion.ea_name}`,
      body: `**EA 名称**: ${suggestion.ea_name}\n\n**建议原因**: ${suggestion.reason}\n\n**联系方式**: ${suggestion.contact || '未提供'}\n\n**提交时间**: ${new Date().toLocaleString('zh-CN')}`,
      labels: ['user-suggestion', 'new-ea']
    });
    
    return result;
  } catch (error) {
    console.error('创建 GitHub Issue 失败:', error);
    throw error;
  }
}

// 初始化 GitHub MCP
export async function initializeGitHubMCP() {
  try {
    await mcpManager.initializeClient(
      'github',
      'npx',
      ['@modelcontextprotocol/server-github'],
      {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
      }
    );
    console.log('GitHub MCP 初始化成功');
  } catch (error) {
    console.error('GitHub MCP 初始化失败:', error);
    throw error;
  }
}