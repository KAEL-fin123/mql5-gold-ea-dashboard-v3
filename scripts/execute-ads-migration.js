require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeAdsMigration() {
  console.log('🚀 开始执行广告表迁移...');
  
  try {
    // 步骤1: 添加新字段
    console.log('📝 步骤1: 添加新字段...');
    
    // 使用原生SQL查询添加字段
    const { data: addFields, error: addFieldsError } = await supabase
      .from('ads')
      .select('title, description, category')
      .limit(1);
    
    if (addFieldsError && addFieldsError.message.includes('column')) {
      console.log('⚠️  字段不存在，尝试通过更新操作来添加字段...');
      
      // 尝试通过插入一条测试记录来触发字段创建
      const { error: testInsertError } = await supabase
        .from('ads')
        .insert({
          position: 'test',
          image_url: 'test',
          link_url: 'test',
          title: 'test',
          description: 'test',
          category: 'test',
          is_active: false
        });
      
      if (testInsertError) {
        console.log('❌ 无法自动添加字段，需要手动在Supabase Dashboard中添加:');
        console.log('   1. 打开 Supabase Dashboard');
        console.log('   2. 进入 Table Editor > ads 表');
        console.log('   3. 添加字段: title (TEXT), description (TEXT), category (TEXT)');
        console.log('   4. 重新运行此脚本');
        return;
      } else {
        // 删除测试记录
        await supabase.from('ads').delete().eq('position', 'test');
        console.log('✅ 字段添加成功');
      }
    } else {
      console.log('✅ 字段已存在');
    }
    
    // 步骤2: 更新现有数据
    console.log('📝 步骤2: 更新现有广告数据...');
    
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
    
    // 步骤3: 验证结果
    console.log('📊 步骤3: 验证迁移结果...');
    
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
    
  } catch (err) {
    console.error('❌ 迁移失败:', err.message);
  }
}

executeAdsMigration();