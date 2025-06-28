require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addAdsColumns() {
  console.log('🚀 开始添加广告表字段...');
  
  try {
    // 使用RPC调用执行SQL
    const sqlCommands = [
      "ALTER TABLE ads ADD COLUMN IF NOT EXISTS title TEXT;",
      "ALTER TABLE ads ADD COLUMN IF NOT EXISTS description TEXT;",
      "ALTER TABLE ads ADD COLUMN IF NOT EXISTS category TEXT;"
    ];
    
    for (const sql of sqlCommands) {
      console.log(`📝 执行SQL: ${sql}`);
      
      const { data, error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.log(`⚠️  RPC方法不可用，尝试直接查询方式...`);
        break;
      } else {
        console.log(`✅ SQL执行成功`);
      }
    }
    
    // 如果RPC不可用，尝试通过查询方式检查字段
    console.log('🔍 检查字段是否存在...');
    
    const { data: checkData, error: checkError } = await supabase
      .from('ads')
      .select('id, position, image_url, link_url, is_active, created_at, updated_at, title, description, category')
      .limit(1);
    
    if (checkError) {
      console.log('❌ 字段检查失败，可能字段不存在');
      console.log('📋 请在Supabase Dashboard中手动添加以下字段:');
      console.log('   - title (类型: text)');
      console.log('   - description (类型: text)');
      console.log('   - category (类型: text)');
      console.log('\n🔗 操作步骤:');
      console.log('   1. 打开 https://supabase.com/dashboard');
      console.log('   2. 选择你的项目');
      console.log('   3. 进入 Table Editor');
      console.log('   4. 选择 ads 表');
      console.log('   5. 点击 "Add Column" 按钮');
      console.log('   6. 分别添加 title, description, category 字段（类型选择 text）');
      console.log('   7. 添加完成后重新运行迁移脚本');
      return false;
    } else {
      console.log('✅ 所有字段都存在，可以继续迁移数据');
      return true;
    }
    
  } catch (err) {
    console.error('❌ 添加字段失败:', err.message);
    return false;
  }
}

async function updateAdsData() {
  console.log('📝 开始更新广告数据...');
  
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
    const { error: updateError } = await supabase
      .from('ads')
      .update({
        title: update.title,
        description: update.description,
        category: update.category
      })
      .eq('position', update.position);
    
    if (updateError) {
      console.error(`❌ 更新${update.position}位置广告失败:`, updateError.message);
    } else {
      console.log(`✅ 更新${update.position}位置广告成功`);
    }
  }
}

async function verifyResults() {
  console.log('📊 验证迁移结果...');
  
  const { data: finalData, error: finalError } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (finalError) {
    console.error('❌ 查询最终数据失败:', finalError.message);
  } else {
    console.log('\n🎉 迁移完成! 最终广告数据:');
    finalData?.forEach((ad, index) => {
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
  }
}

async function main() {
  const fieldsExist = await addAdsColumns();
  
  if (fieldsExist) {
    await updateAdsData();
    await verifyResults();
  }
}

main();