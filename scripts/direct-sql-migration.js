require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

// 从Supabase URL中提取连接信息
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

// 解析Supabase URL获取数据库连接信息
const urlParts = supabaseUrl.replace('https://', '').split('.');
const projectRef = urlParts[0];

// 构建PostgreSQL连接字符串
const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD || '[YOUR_DB_PASSWORD]'}@db.${projectRef}.supabase.co:5432/postgres`;

async function executeDirectSQL() {
  console.log('🚀 尝试直接连接PostgreSQL数据库...');
  
  // 检查是否有数据库密码
  if (!process.env.SUPABASE_DB_PASSWORD) {
    console.log('❌ 缺少数据库密码环境变量 SUPABASE_DB_PASSWORD');
    console.log('📋 请在 .env.local 文件中添加:');
    console.log('   SUPABASE_DB_PASSWORD=你的数据库密码');
    console.log('\n🔍 获取数据库密码的方法:');
    console.log('   1. 打开 Supabase Dashboard');
    console.log('   2. 进入 Settings > Database');
    console.log('   3. 查看 Connection string 或重置数据库密码');
    return;
  }
  
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ 数据库连接成功');
    
    // 添加字段
    console.log('📝 添加新字段...');
    
    const alterQueries = [
      'ALTER TABLE ads ADD COLUMN IF NOT EXISTS title TEXT;',
      'ALTER TABLE ads ADD COLUMN IF NOT EXISTS description TEXT;', 
      'ALTER TABLE ads ADD COLUMN IF NOT EXISTS category TEXT;'
    ];
    
    for (const query of alterQueries) {
      console.log(`执行: ${query}`);
      await client.query(query);
      console.log('✅ 执行成功');
    }
    
    // 更新数据
    console.log('📝 更新广告数据...');
    
    const updates = [
      {
        position: 'left',
        title: '优质经纪商推荐',
        description: '点击查看详情，获取更多专业信息和服务',
        category: '经纪商'
      },
      {
        position: 'right',
        title: '专业EA系统', 
        description: '点击查看详情，获取更多专业信息和服务',
        category: 'EA推荐'
      },
      {
        position: 'footer',
        title: '交易信号服务',
        description: '点击查看详情，获取更多专业信息和服务',
        category: '信号服务'
      },
      {
        position: 'header',
        title: '教育培训课程',
        description: '点击查看详情，获取更多专业信息和服务',
        category: '教育培训'
      }
    ];
    
    for (const update of updates) {
      const updateQuery = `
        UPDATE ads 
        SET title = $1, description = $2, category = $3 
        WHERE position = $4
      `;
      
      await client.query(updateQuery, [
        update.title,
        update.description, 
        update.category,
        update.position
      ]);
      
      console.log(`✅ 更新${update.position}位置广告成功`);
    }
    
    // 验证结果
    console.log('📊 验证结果...');
    
    const result = await client.query('SELECT * FROM ads ORDER BY created_at DESC');
    
    console.log('\n🎉 迁移完成! 最终广告数据:');
    result.rows.forEach((ad, index) => {
      console.log(`${index + 1}. [${ad.position}] ${ad.category || '未分类'}`);
      console.log(`   标题: ${ad.title || '未设置'}`);
      console.log(`   描述: ${ad.description || '未设置'}`);
      console.log(`   图片: ${ad.image_url}`);
      console.log(`   链接: ${ad.link_url}`);
      console.log(`   状态: ${ad.is_active ? '✅ 启用' : '❌ 禁用'}`);
      console.log('---');
    });
    
    console.log('\n✅ 广告内容已成功迁移到Supabase!');
    console.log('🔄 前端组件将自动从数据库读取新的标题和描述');
    
  } catch (err) {
    console.error('❌ 操作失败:', err.message);
    
    if (err.message.includes('password')) {
      console.log('\n🔑 数据库密码错误，请检查 SUPABASE_DB_PASSWORD 环境变量');
    } else if (err.message.includes('connect')) {
      console.log('\n🌐 连接失败，请检查网络或数据库配置');
    }
    
  } finally {
    await client.end();
  }
}

executeDirectSQL();