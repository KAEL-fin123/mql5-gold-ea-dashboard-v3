const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function checkEAStatsStructure() {
  console.log('🔍 检查ea_stats表结构...');
  
  try {
    // 1. 查询表的列信息
    console.log('\n1. 查询表列信息...');
    
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'ea_stats' })
      .single();

    if (columnError) {
      console.log('❌ 无法通过RPC获取列信息，尝试直接查询...');
      
      // 尝试直接查询一条记录来查看字段
      const { data: sampleData, error: sampleError } = await supabase
        .from('ea_stats')
        .select('*')
        .limit(1);

      if (sampleError) {
        console.error('❌ 查询样本数据失败:', sampleError);
        return;
      }

      if (sampleData && sampleData.length > 0) {
        console.log('✅ 当前ea_stats表的字段:');
        const fields = Object.keys(sampleData[0]);
        fields.forEach(field => {
          console.log(`   - ${field}`);
        });
        
        // 检查是否有month字段
        if (fields.includes('month')) {
          console.log('✅ month字段存在');
        } else {
          console.log('❌ month字段不存在！');
        }
      } else {
        console.log('⚠️ 表中没有数据，无法确定字段结构');
      }
    }

    // 2. 尝试查询包含month字段的数据
    console.log('\n2. 测试month字段查询...');
    
    const { data: monthTest, error: monthError } = await supabase
      .from('ea_stats')
      .select('id, year, month')
      .limit(1);

    if (monthError) {
      console.error('❌ month字段查询失败:', monthError.message);
      console.log('\n🔧 需要添加month字段到ea_stats表');
    } else {
      console.log('✅ month字段查询成功');
      if (monthTest && monthTest.length > 0) {
        console.log('样本数据:', monthTest[0]);
      }
    }

    // 3. 检查数据总数
    console.log('\n3. 检查数据总数...');
    
    const { count, error: countError } = await supabase
      .from('ea_stats')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ 统计数据失败:', countError);
    } else {
      console.log(`✅ ea_stats表共有 ${count} 条记录`);
    }

  } catch (error) {
    console.error('❌ 检查过程中发生错误:', error);
  }
}

// 运行检查
checkEAStatsStructure()
  .then(() => {
    console.log('\n🎉 ea_stats表结构检查完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 检查失败:', error);
    process.exit(1);
  });