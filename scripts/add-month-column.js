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

async function addMonthColumn() {
  console.log('🔧 开始添加month字段到ea_stats表...');
  
  try {
    // 1. 添加month字段
    console.log('\n1. 添加month字段...');
    
    const { data: addResult, error: addError } = await supabase
      .rpc('exec_sql', {
        sql: `
          ALTER TABLE ea_stats 
          ADD COLUMN IF NOT EXISTS month INTEGER 
          CHECK (month >= 1 AND month <= 12);
        `
      });

    if (addError) {
      console.log('❌ 通过RPC添加失败，尝试直接执行SQL...');
      
      // 如果RPC不可用，我们需要手动在Supabase控制台执行
      console.log('\n📋 请在Supabase控制台的SQL编辑器中执行以下SQL:');
      console.log('\n' + '='.repeat(60));
      console.log('ALTER TABLE ea_stats ADD COLUMN IF NOT EXISTS month INTEGER CHECK (month >= 1 AND month <= 12);');
      console.log('='.repeat(60));
      
      // 验证字段是否已存在
      const { data: testData, error: testError } = await supabase
        .from('ea_stats')
        .select('id, year, month')
        .limit(1);

      if (testError && testError.message.includes('does not exist')) {
        console.log('\n❌ month字段仍然不存在，请手动执行上述SQL');
        return false;
      } else if (testError) {
        console.error('❌ 验证时发生其他错误:', testError);
        return false;
      } else {
        console.log('\n✅ month字段已存在！');
      }
    } else {
      console.log('✅ month字段添加成功');
    }

    // 2. 更新现有数据的唯一约束
    console.log('\n2. 更新唯一约束...');
    
    console.log('\n📋 请在Supabase控制台执行以下SQL来更新唯一约束:');
    console.log('\n' + '='.repeat(60));
    console.log(`
-- 删除旧的唯一约束（如果存在）
ALTER TABLE ea_stats DROP CONSTRAINT IF EXISTS ea_stats_ea_id_year_month_key;

-- 添加新的唯一约束
ALTER TABLE ea_stats ADD CONSTRAINT ea_stats_ea_id_year_month_key UNIQUE (ea_id, year, month);
`);
    console.log('='.repeat(60));

    // 3. 验证修复
    console.log('\n3. 验证修复...');
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('ea_stats')
      .select('id, ea_id, year, month, win_rate')
      .limit(3);

    if (verifyError) {
      console.error('❌ 验证失败:', verifyError.message);
      return false;
    } else {
      console.log('✅ 验证成功！');
      console.log('样本数据:');
      verifyData.forEach((row, index) => {
        console.log(`   ${index + 1}. ID: ${row.id.substring(0, 8)}... | Year: ${row.year} | Month: ${row.month || 'NULL'} | Win Rate: ${row.win_rate}%`);
      });
    }

    return true;

  } catch (error) {
    console.error('❌ 添加month字段时发生错误:', error);
    return false;
  }
}

// 运行修复
addMonthColumn()
  .then((success) => {
    if (success) {
      console.log('\n🎉 month字段添加完成！');
      console.log('\n📝 下一步：');
      console.log('1. 在Supabase控制台执行上述SQL语句');
      console.log('2. 重新启动开发服务器');
      console.log('3. 测试API端点');
    } else {
      console.log('\n❌ 修复未完成，请手动执行SQL语句');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 修复失败:', error);
    process.exit(1);
  });