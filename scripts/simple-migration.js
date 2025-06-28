require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleMigration() {
  console.log('🚀 开始简化迁移流程...');
  console.log('\n📋 由于Supabase限制，需要手动添加字段，请按以下步骤操作:');
  
  console.log('\n🔗 步骤1: 在Supabase Dashboard中添加字段');
  console.log('   1. 打开 https://supabase.com/dashboard');
  console.log('   2. 选择你的项目');
  console.log('   3. 进入 Table Editor');
  console.log('   4. 选择 ads 表');
  console.log('   5. 点击右上角的 "Add Column" 按钮');
  console.log('   6. 添加以下三个字段:');
  console.log('      - 字段名: title, 类型: text, 默认值: 空');
  console.log('      - 字段名: description, 类型: text, 默认值: 空');
  console.log('      - 字段名: category, 类型: text, 默认值: 空');
  
  console.log('\n⏳ 请完成上述操作后，按任意键继续...');
  
  // 等待用户确认
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', async () => {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    
    console.log('\n🔍 检查字段是否已添加...');
    
    try {
      // 尝试查询新字段
      const { data: testData, error: testError } = await supabase
        .from('ads')
        .select('id, title, description, category')
        .limit(1);
      
      if (testError) {
        console.log('❌ 字段尚未添加或添加失败');
        console.log('错误信息:', testError.message);
        console.log('\n请确保已正确添加所有字段后重新运行此脚本');
        return;
      }
      
      console.log('✅ 字段检查通过，开始更新数据...');
      
      // 更新数据
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
      
      // 验证结果
      console.log('\n📊 验证迁移结果...');
      
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
        console.log('\n🎯 下一步: 你可以在Supabase Dashboard中直接编辑这些广告内容');
      }
      
    } catch (err) {
      console.error('❌ 迁移过程中发生错误:', err.message);
    }
  });
}

simpleMigration();