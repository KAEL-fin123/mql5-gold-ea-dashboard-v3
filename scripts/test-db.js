// 尝试导入Supabase客户端
let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (error) {
  console.error('❌ 无法加载@supabase/supabase-js包');
  console.log('💡 请运行以下命令安装依赖:');
  console.log('   npm install');
  console.log('   或者');
  console.log('   npm install @supabase/supabase-js');
  process.exit(1);
}

// 尝试加载dotenv，如果失败则手动读取.env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  dotenv包未安装，尝试手动读取环境变量...');
  // 手动读取.env.local文件
  const fs = require('fs');
  const path = require('path');

  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (key.trim() && !key.startsWith('#')) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ 成功手动读取.env.local文件');
  } catch (readError) {
    console.error('❌ 无法读取.env.local文件:', readError.message);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 检查环境变量...');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ 已设置' : '❌ 未设置');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ 错误: 缺少Supabase环境变量');
  console.log('\n请确保.env.local文件包含:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://rllpuaybvztqqqhnvaok.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('\n💡 解决方案:');
  console.log('1. 检查.env.local文件是否存在于项目根目录');
  console.log('2. 确认文件内容格式正确（无多余空格或引号）');
  console.log('3. 重新启动终端或开发服务器');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 测试数据库连接...\n');

  try {
    // 测试连接
    console.log('1. 测试基础连接...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('eas')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ 连接失败:', connectionError.message);
      return;
    }
    console.log('✅ 数据库连接成功');

    // 测试表结构
    console.log('\n2. 检查表结构...');
    
    // 检查eas表
    const { data: easData, error: easError } = await supabase
      .from('eas')
      .select('*')
      .limit(1);
    
    if (easError) {
      console.error('❌ eas表不存在或无权限访问:', easError.message);
    } else {
      console.log('✅ eas表存在');
    }

    // 检查ea_stats表
    const { data: statsData, error: statsError } = await supabase
      .from('ea_stats')
      .select('*')
      .limit(1);
    
    if (statsError) {
      console.error('❌ ea_stats表不存在或无权限访问:', statsError.message);
    } else {
      console.log('✅ ea_stats表存在');
    }

    // 检查user_requests表
    const { data: requestsData, error: requestsError } = await supabase
      .from('user_requests')
      .select('*')
      .limit(1);
    
    if (requestsError) {
      console.error('❌ user_requests表不存在或无权限访问:', requestsError.message);
    } else {
      console.log('✅ user_requests表存在');
    }

    // 检查ads表
    const { data: adsData, error: adsError } = await supabase
      .from('ads')
      .select('*')
      .limit(1);
    
    if (adsError) {
      console.error('❌ ads表不存在或无权限访问:', adsError.message);
    } else {
      console.log('✅ ads表存在');
    }

    // 检查数据
    console.log('\n3. 检查示例数据...');
    
    const { data: allEas, error: allEasError } = await supabase
      .from('eas')
      .select('*');
    
    if (allEasError) {
      console.error('❌ 无法获取EA数据:', allEasError.message);
    } else {
      console.log(`✅ 找到 ${allEas.length} 个EA记录`);
      if (allEas.length > 0) {
        console.log('   示例EA:', allEas[0].name);
      }
    }

    const { data: allStats, error: allStatsError } = await supabase
      .from('ea_stats')
      .select('*');
    
    if (allStatsError) {
      console.error('❌ 无法获取统计数据:', allStatsError.message);
    } else {
      console.log(`✅ 找到 ${allStats.length} 条统计记录`);
    }

    console.log('\n🎉 数据库测试完成!');
    
    if (easError || statsError || requestsError || adsError) {
      console.log('\n⚠️  发现问题:');
      console.log('请在Supabase控制台执行 database/schema.sql 文件来创建表结构');
      console.log('访问: https://supabase.com/dashboard/project/rllpuaybvztqqqhnvaok/sql');
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }
}

testDatabase();
