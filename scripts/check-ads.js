require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少Supabase环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAds() {
  console.log('🔍 检查广告数据...');
  
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ 查询错误:', error.message);
      return;
    }
    
    console.log('📊 广告数据总数:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('\n📋 广告列表:');
      data.forEach((ad, index) => {
        console.log(`${index + 1}. 位置: ${ad.position}`);
        console.log(`   图片: ${ad.image_url}`);
        console.log(`   链接: ${ad.link_url}`);
        console.log(`   状态: ${ad.is_active ? '启用' : '禁用'}`);
        console.log(`   创建时间: ${ad.created_at}`);
        console.log('---');
      });
    } else {
      console.log('📭 暂无广告数据');
    }
    
  } catch (err) {
    console.error('❌ 检查失败:', err.message);
  }
}

checkAds();