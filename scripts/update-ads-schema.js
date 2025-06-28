require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdsSchema() {
  console.log('🔄 开始更新ads表结构...');
  
  try {
    // 先检查当前表结构
    const { data: currentData, error: selectError } = await supabase
      .from('ads')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ 查询当前数据失败:', selectError.message);
      return;
    }
    
    console.log('📋 当前ads表字段:', Object.keys(currentData?.[0] || {}));
    
    // 由于无法直接执行DDL，我们需要手动在Supabase Dashboard中添加字段
    console.log('⚠️  需要手动在Supabase Dashboard中为ads表添加以下字段:');
    console.log('   - title (TEXT)');
    console.log('   - description (TEXT)');
    console.log('   - category (TEXT)');
    console.log('\n请在Supabase Dashboard > Table Editor > ads表中添加这些字段后重新运行此脚本。');
    
    // 检查是否已有这些字段
    const hasTitle = currentData?.[0]?.hasOwnProperty('title');
    const hasDescription = currentData?.[0]?.hasOwnProperty('description');
    const hasCategory = currentData?.[0]?.hasOwnProperty('category');
    
    if (!hasTitle || !hasDescription || !hasCategory) {
      console.log('\n❌ 缺少必要字段，请先在Supabase Dashboard中添加字段。');
      return;
    }
    
    console.log('✅ 检测到所有必要字段已存在');
    
    // 更新现有数据，添加默认的title和description
    console.log('🔄 更新现有广告数据...');
    
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
        .eq('position', update.position)
        .is('title', null); // 只更新title为空的记录
      
      if (updateError) {
        console.error(`❌ 更新${update.position}位置广告失败:`, updateError.message);
      } else {
        console.log(`✅ 更新${update.position}位置广告成功`);
      }
    }
    
    console.log('🎉 广告表结构和数据更新完成!');
    
    // 显示更新后的数据
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ 查询更新后数据失败:', error.message);
    } else {
      console.log('\n📊 更新后的广告数据:');
      data?.forEach((ad, index) => {
        console.log(`${index + 1}. 位置: ${ad.position}`);
        console.log(`   分类: ${ad.category || '未设置'}`);
        console.log(`   标题: ${ad.title || '未设置'}`);
        console.log(`   描述: ${ad.description || '未设置'}`);
        console.log(`   图片: ${ad.image_url}`);
        console.log(`   链接: ${ad.link_url}`);
        console.log(`   状态: ${ad.is_active ? '启用' : '禁用'}`);
        console.log('---');
      });
    }
    
  } catch (err) {
    console.error('❌ 更新失败:', err.message);
  }
}

updateAdsSchema();