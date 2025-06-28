const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 MQL5 GOLD EA 数据库连接测试');
console.log('=====================================\n');

// 读取环境变量
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (key.trim() && !key.startsWith('#')) {
          env[key.trim()] = value;
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ 无法读取.env.local文件:', error.message);
    return null;
  }
}

// 测试Supabase连接
function testSupabaseConnection(url, key) {
  return new Promise((resolve, reject) => {
    const apiUrl = `${url}/rest/v1/`;
    const urlObj = new URL(apiUrl);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, status: res.statusCode, data });
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

// 测试表是否存在
function testTable(url, key, tableName) {
  return new Promise((resolve, reject) => {
    const apiUrl = `${url}/rest/v1/${tableName}?limit=1`;
    const urlObj = new URL(apiUrl);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ 
          success: res.statusCode === 200, 
          status: res.statusCode, 
          data: data,
          table: tableName 
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

// 主测试函数
async function runTests() {
  console.log('1. 读取环境变量...');
  
  const env = loadEnvFile();
  if (!env) {
    console.log('\n❌ 测试失败: 无法读取环境变量');
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('SUPABASE_URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
  console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ 已设置' : '❌ 未设置');

  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ 错误: 缺少Supabase环境变量');
    console.log('\n请确保.env.local文件包含:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://rllpuaybvztqqqhnvaok.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    return;
  }

  console.log('\n2. 测试Supabase基础连接...');
  
  try {
    const connectionResult = await testSupabaseConnection(supabaseUrl, supabaseKey);
    if (connectionResult.success) {
      console.log('✅ Supabase连接成功');
    } else {
      console.log(`❌ Supabase连接失败 (状态码: ${connectionResult.status})`);
      return;
    }
  } catch (error) {
    console.log('❌ Supabase连接失败:', error.message);
    return;
  }

  console.log('\n3. 测试数据表...');
  
  const tables = ['eas', 'ea_stats', 'user_requests', 'ads'];
  const tableResults = [];

  for (const table of tables) {
    try {
      const result = await testTable(supabaseUrl, supabaseKey, table);
      tableResults.push(result);
      
      if (result.success) {
        console.log(`✅ ${table}表存在`);
      } else {
        console.log(`❌ ${table}表不存在或无权限访问 (状态码: ${result.status})`);
      }
    } catch (error) {
      console.log(`❌ ${table}表测试失败:`, error.message);
      tableResults.push({ success: false, table, error: error.message });
    }
  }

  console.log('\n🎉 数据库测试完成!');
  
  const failedTables = tableResults.filter(r => !r.success);
  if (failedTables.length > 0) {
    console.log('\n⚠️  发现问题:');
    console.log('请在Supabase控制台执行 database/schema.sql 文件来创建表结构');
    console.log('访问: https://supabase.com/dashboard/project/rllpuaybvztqqqhnvaok/sql');
    console.log('\n缺失的表:', failedTables.map(r => r.table).join(', '));
  } else {
    console.log('\n✅ 所有数据表都已正确设置!');
    console.log('🚀 可以开始开发了!');
  }
}

// 运行测试
runTests().catch(error => {
  console.error('❌ 测试过程中发生错误:', error.message);
});
