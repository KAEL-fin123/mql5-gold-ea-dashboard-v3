require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdContent() {
  console.log('🔄 开始更新广告内容...');
  
  // 新的广告内容 - 更加自然，不明显引流
  const newAdContent = [
    {
      position: 'left',
      title: '黄金市场分析工具',
      description: '专业的市场数据分析，帮助您更好地理解黄金价格走势',
      category: '市场分析'
    },
    {
      position: 'right',
      title: '智能交易助手',
      description: '基于算法的交易辅助工具，提供市场趋势参考',
      category: '交易工具'
    },
    {
      position: 'footer',
      title: '实时行情数据',
      description: '获取最新的黄金市场行情和技术指标分析',
      category: '行情服务'
    },
    {
      position: 'header',
      title: '交易知识分享',
      description: '学习黄金交易的基础知识和市场分析技巧',
      category: '知识学习'
    }
  ];
  
  try {
    for (const content of newAdContent) {
      const { error: updateError } = await supabase
        .from('ads')
        .update({
          title: content.title,
          description: content.description,
          category: content.category
        })
        .eq('position', content.position);
      
      if (updateError) {
        console.error(`❌ 更新${content.position}位置广告失败:`, updateError.message);
      } else {
        console.log(`✅ 更新${content.position}位置广告成功: ${content.title}`);
      }
    }
    
    // 验证更新结果
    console.log('\n📊 验证更新结果...');
    
    const { data: updatedData, error: queryError } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (queryError) {
      console.error('❌ 查询更新后数据失败:', queryError.message);
    } else {
      console.log('\n🎉 广告内容更新完成! 新的广告数据:');
      updatedData?.forEach((ad, index) => {
        console.log(`${index + 1}. [${ad.position}] ${ad.category}`);
        console.log(`   标题: ${ad.title}`);
        console.log(`   描述: ${ad.description}`);
        console.log(`   状态: ${ad.is_active ? '✅ 启用' : '❌ 禁用'}`);
        console.log('---');
      });
      
      console.log('\n✅ 新的广告内容更加自然，减少了明显的引流特征!');
      console.log('🔄 前端页面将自动显示更新后的内容');
    }
    
  } catch (err) {
    console.error('❌ 更新广告内容失败:', err.message);
  }
}

updateAdContent();